import Keycloak, { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';
import {
    EnvironmentInjector,
    EnvironmentProviders,
    inject,
    makeEnvironmentProviders,
    PLATFORM_ID,
    provideAppInitializer,
    Provider,
    runInInjectionContext,
} from '@angular/core';
import {
    AutoRefreshTokenService,
    createKeycloakSignal,
    KEYCLOAK_EVENT_SIGNAL,
    KeycloakFeature,
    UserActivityService,
    withAutoRefreshToken,
} from 'keycloak-angular';
import { isPlatformBrowser } from '@angular/common';

export type ProvideKeycloakOptions = {
    /**
     * Keycloak configuration, including the server URL, realm, and client ID.
     */
    config: KeycloakConfig;

    /**
     * Optional initialization options for the Keycloak instance.
     * If not provided, Keycloak will not initialize automatically.
     */
    initOptions?: KeycloakInitOptions;

    /**
     * Optional array of additional Angular providers or environment providers.
     */
    providers?: Array<Provider | EnvironmentProviders>;

    /**
     * Optional array of Keycloak features to extend the functionality of the Keycloak integration.
     */
    features?: Array<KeycloakFeature>;
};

const provideKeycloakInAppInitializer = (
    keycloak: Keycloak,
    options: ProvideKeycloakOptions
): EnvironmentProviders | Provider[] => {
    const { initOptions, features = [] } = options;

    if (!initOptions) {
        return [];
    }

    return provideAppInitializer(async () => {
        const platform = inject(PLATFORM_ID);

        // only init keycloak in the browser
        if (isPlatformBrowser(platform)) {
            const injector = inject(EnvironmentInjector);
            runInInjectionContext(injector, () =>
                features.forEach((feature) => feature.configure())
            );

            await keycloak
                .init(initOptions)
                .catch((error) =>
                    console.error('Keycloak initialization failed', error)
                );
        } else {
            console.log('Keycloak initialization skipped on server side');
        }
    });
};

export function provideKeycloakSSR(
    options: ProvideKeycloakOptions
): EnvironmentProviders {
    const keycloak = new Keycloak(options.config);

    const providers = options.providers ?? [];
    const keycloakSignal = createKeycloakSignal(keycloak);

    return makeEnvironmentProviders([
        {
            provide: KEYCLOAK_EVENT_SIGNAL,
            useValue: keycloakSignal,
        },
        {
            provide: Keycloak,
            useValue: keycloak,
        },
        ...providers,
        provideKeycloakInAppInitializer(keycloak, options),
    ]);
}

export const provideKeycloakAngularSSR = () =>
    provideKeycloakSSR({
        config: {
            url: 'http://localhost:8080',
            realm: 'taskly',
            clientId: 'taskly-client',
        },
        initOptions: {
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: 'http://localhost:4200/silent-check-sso.html',
        },
        features: [
            withAutoRefreshToken({
                onInactivityTimeout: 'logout',
                sessionTimeout: 600000,
            }),
        ],
        providers: [AutoRefreshTokenService, UserActivityService],
    });