import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';
// import { NgxDhis2MenuModule } from '@iapps/ngx-dhis2-menu';
import { EffectsModule } from '@ngrx/effects';
import {
  RouterStateSerializer,
  StoreRouterConnectingModule,
  FullRouterStateSerializer,
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '../environments/environment';
import { RoutingModule } from './app.routes';
import { CoreModule, RouteSerializer } from './core';
import { effects } from './store/effects';
import { metaReducers, reducers } from './store/reducers';
import { materialModules } from './shared/materials.module';
import { HeaderBarModule, ReactWrapperModule } from '@iapps/ng-dhis2-ui';
import { AppShellModule } from '@iapps/ng-dhis2-shell';
import { AppWrapper } from './app-wrapper';
import { AppComponentContent } from './app.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppWrapper, AppComponentContent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    ReactWrapperModule,
    CoreModule,
    HeaderBarModule,
    ...materialModules,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    NgxDhis2HttpClientModule.forRoot({
      version: 1,
      namespace: 'iapps',
      models: {
        organisationUnits: 'id,level',
        organisationUnitLevels: 'id,level',
        organisationUnitGroups: 'id',
      },
    }),
    AppShellModule.forRoot({
      pwaEnabled: false,
      isDevMode: !environment.production,
    }),
    /**
     Translation module
    */

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store
     */
    StoreRouterConnectingModule.forRoot({
      serializer: FullRouterStateSerializer,
    }),

    !environment.production
      ? StoreDevtoolsModule.instrument({ connectInZone: true })
      : [],
  ],
  providers: [{ provide: RouterStateSerializer, useClass: RouteSerializer }],
  bootstrap: [AppWrapper],
})
export class AppModule {}
