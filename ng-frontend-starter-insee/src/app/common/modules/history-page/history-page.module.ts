import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { HistoryPageComponent } from './history-page.component';
import { HistoryService } from './history-page.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HistoryPageComponent
  ],
  imports: [
    CommonModule, // ngTemplateOutlet
    FuseSharedModule,
    TranslateModule,
    NgxDatatableModule
  ],
  exports: [
    HistoryPageComponent,
  ],
  providers: [
    HistoryService
  ]
})
export class HistoryPageModule {

}
