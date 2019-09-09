import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { MaterialModule } from '@fuse/material.module';
import { FuseConfirmDialogModule } from '@fuse/components/confirm-dialog/confirm-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    FuseConfirmDialogModule,
    FuseDirectivesModule,
    FusePipesModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    FuseConfirmDialogModule,
    FuseDirectivesModule,
    FusePipesModule
  ]
})
export class FuseSharedModule {
}
