import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { QrCodeComponent } from './qr-code.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    QrCodeComponent
  ],
  imports: [
    CommonModule, // ngTemplateOutlet
    FuseSharedModule,
    TranslateModule,
  ],
  exports: [
    QrCodeComponent,
  ],
})
export class QrCodeModule {
}
