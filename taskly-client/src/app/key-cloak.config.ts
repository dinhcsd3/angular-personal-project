import { provideKeycloak, createInterceptorCondition, withAutoRefreshToken, AutoRefreshTokenService, UserActivityService, INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, IncludeBearerTokenCondition } from 'keycloak-angular';

const localhostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: /^(http:\/\/localhost:4200)(\/.*)?$/i
});

export const provideKeycloakAngular = () =>
    provideKeycloak({
        config: {
            realm: 'taskly',
            url: 'http://localhost:8080/',
            clientId: 'taskly-client'
        },
        initOptions: {
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: 'http://localhost:4200/silent-check-sso.html',
            redirectUri: window.location.origin + '/starter'
        },
        features: [
            withAutoRefreshToken({
                onInactivityTimeout: 'logout',
                sessionTimeout: 600000 // 10 minutes
            })
        ],
        providers: [
            AutoRefreshTokenService,
            UserActivityService,
            {
                provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
                useValue: [localhostCondition]
            }
        ]
    });
