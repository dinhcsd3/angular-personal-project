import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { includeBearerTokenInterceptor } from 'keycloak-angular';
import { provideKeycloakAngular } from './key-cloak.config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import * as AllIcons from '@ant-design/icons-angular/icons';


registerLocaleData(en);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
    // provideKeycloakAngular(), // This provider initializes Keycloak Angular with the default configuration
    provideZoneChangeDetection({ eventCoalescing: true }),

    // This interceptor is used to include the Bearer token for Keycloak authentication
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),

    provideAnimations(),
    provideNzI18n(en_US),
    provideNzIcons(icons)
  ]
};
