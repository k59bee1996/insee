import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDialogModule
} from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    FuseConfirmDialogComponent
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslateModule
  ],
  entryComponents: [
    FuseConfirmDialogComponent
  ],
})
export class FuseConfirmDialogModule {
}
