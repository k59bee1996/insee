import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appRoutes } from './routes';
import { PageModule } from './pages';
import { AppComponent } from './app.component';
import { AppSharedModule } from './common';
import { AppModule as FuseAppModule } from 'app/app.module';
import {
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';

import { ToastrModule } from 'ngx-toastr';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ShareModule } from '@modules/share';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  const url = '/assets/i18n/';
  return new TranslateHttpLoader(http, url, '.json');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FuseAppModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppSharedModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
    ToastrModule.forRoot({
        timeOut: 5000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      }
    ),
    NgxWebstorageModule.forRoot({
      prefix: 'nois',
      separator: '.',
      caseSensitive: false
    }),
    PageModule,
    ShareModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
