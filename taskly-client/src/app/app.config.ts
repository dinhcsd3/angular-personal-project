import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { includeBearerTokenInterceptor } from 'keycloak-angular';
import { provideKeycloakAngular } from './key-cloak.config';
import { provideKeycloakAngularSSR } from './key-cloak-ssr.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
    // provideKeycloakAngular(), // This provider initializes Keycloak Angular with the default configuration
    provideKeycloakAngularSSR(), // This provider is used for server-side rendering (SSR) with Keycloak Angular
    provideZoneChangeDetection({ eventCoalescing: true }),

    // This interceptor is used to include the Bearer token for Keycloak authentication
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor]))
  ]
};
