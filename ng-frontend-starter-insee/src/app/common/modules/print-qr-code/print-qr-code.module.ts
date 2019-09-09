import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrintQrCodeComponent } from './print-qr-code.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { DomChangeModule } from '@modules/dom-change/dom-change.module';

@NgModule({
  declarations: [
    PrintQrCodeComponent
  ],
  imports: [
    CommonModule,
    FuseSharedModule,
    DomChangeModule
  ],
  exports: [
    PrintQrCodeComponent,
  ],
})
export class PrintQrCodeModule {
}
