import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideKeycloakAngularSSR } from './key-cloak-ssr.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideKeycloakAngularSSR(), // This provider is used for server-side rendering (SSR) with Keycloak Angular
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
