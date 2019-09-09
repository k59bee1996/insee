import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SHARED_SERVICES } from './services';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouteCachingModule } from '@modules/route-caching';
import { PromiseButtonModule } from '@modules/promise-button/promise-button.module';
import { MaxNumberModule } from '@modules/max-number';
import { LimitToModule } from '@modules/limit-to';
import { InputDecimalModule } from '@modules/input-decimal';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    FuseSharedModule,
    RouteCachingModule,
    PromiseButtonModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    FuseSharedModule,
    RouteCachingModule,
    PromiseButtonModule,
    MaxNumberModule,
    LimitToModule,
    InputDecimalModule
  ],
  providers: [
    ...SHARED_SERVICES
  ]
})
export class AppSharedModule {
}
