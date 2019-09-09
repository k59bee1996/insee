import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { GenericListComponent } from './generic-list.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ImageDialogComponent } from '@modules/generic-list/image-dialog/image-dialog.component';
import { FuseConfirmDialogModule } from '@fuse/components';


@NgModule({
  declarations: [
    GenericListComponent,
    ImageDialogComponent
  ],
  imports: [
    CommonModule, // ngTemplateOutlet
    FuseSharedModule,
    TranslateModule,
    FuseConfirmDialogModule,
  ],
  entryComponents: [
    ImageDialogComponent
  ],
  exports: [
    GenericListComponent,
  ],
})
export class GenericListModule {
}
