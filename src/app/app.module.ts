import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {JWT_OPTIONS, JwtModule} from '@auth0/angular-jwt';

import {routing} from './app.routes';

import {AppComponent} from './app.component';

import {AppConfigService} from './service';

import {WelcomeModule} from './welcome/welcome.module';
import {AppMarketModule} from './appmarket';
import {SharedModule} from './shared';

import {AuthGuard} from './auth/auth.guard';
import {AuthService} from './auth/auth.service';

import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CustomMissingTranslationService} from './i18n/custommissingtranslation.service';
import {TranslateLoaderImpl} from './i18n/translate-loader-impl.service';
import {ServiceUnavailableModule} from './service-unavailable/service-unavailable.module';
import {ServiceUnavailableService} from './service-unavailable/service-unavailable.service';
import {NgTerminalModule} from 'ng-terminal';

export function appConfigFactory(config: AppConfigService) {
    return function create() {
        return config.load();
    }
}

export function serviceAvailableFactory(config: AppConfigService, http: HttpClient, provider: ServiceUnavailableService) {
    return function create() {
        return config.load().then(() => {
            console.log('App Config', config.config)
            return provider.validateServicesAvailability();
        });
    }
}

export const jwtOptionsFactory = (appConfig: AppConfigService) => ({
    tokenGetter: () => {
        return localStorage.getItem('token'); // TODO: change this to be able to replace 'token' with definied name
    },
    allowedDomains: appConfig.jwtAllowedDomains
});

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        JwtModule.forRoot({
            jwtOptionsProvider: {
                provide: JWT_OPTIONS,
                deps: [AppConfigService],
                useFactory: jwtOptionsFactory
            }
        }),
        AppMarketModule,
        SharedModule,
        WelcomeModule,
        ServiceUnavailableModule,
        routing,
        TranslateModule.forRoot({
            missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationService},
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient, AppConfigService, ServiceUnavailableService]
            }
        }),
        NgTerminalModule
    ],
    providers: [
        AuthGuard,
        AuthService,
        AppConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: appConfigFactory,
            deps: [AppConfigService],
            multi: true,
        },
        TranslateService,
        ServiceUnavailableService,
        {
            provide: APP_INITIALIZER,
            useFactory: serviceAvailableFactory,
            deps: [AppConfigService, HttpClient, ServiceUnavailableService],
            multi: true,
        }
    ],
    exports: [
        TranslateModule
    ],
    bootstrap: [AppComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule {
}

export function HttpLoaderFactory(httpClient: HttpClient, appConfig: AppConfigService, serviceAvailability: ServiceUnavailableService) {
    // return new TranslateHttpLoader(httpClient);// Use this if you want to get the language json from local asset folder
    return new TranslateLoaderImpl(httpClient, appConfig, serviceAvailability);
}

