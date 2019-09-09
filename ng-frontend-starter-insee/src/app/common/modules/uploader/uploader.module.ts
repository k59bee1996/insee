import { NgModule } from '@angular/core';

import { UploaderComponent } from './uploader.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services/auth';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';


@NgModule({
  declarations: [
    UploaderComponent
  ],
  imports: [
    CommonModule,
    FuseSharedModule,
    TranslateModule,
    NgxUploaderModule,
  ],
  exports: [
    UploaderComponent
  ],
  providers: [
    AuthService
  ]
})
export class UploaderModule {

}
