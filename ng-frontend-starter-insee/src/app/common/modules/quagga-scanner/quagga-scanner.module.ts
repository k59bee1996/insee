import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { QuaggaScannerComponent } from './quagga-scanner.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    QuaggaScannerComponent
  ],
  imports: [
    CommonModule, // ngTemplateOutlet
    FuseSharedModule,
    TranslateModule,
  ],
  exports: [
    QuaggaScannerComponent,
  ],
  providers: []
})
export class QuaggaScannerModule {
}
