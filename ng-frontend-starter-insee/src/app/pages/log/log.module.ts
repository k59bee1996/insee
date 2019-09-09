import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { LogComponent } from './log.component';
import { AppSharedModule } from '@common/index';
import { GenericListModule } from '@modules/generic-list/generic-list.module';
import { DatetimepickerModule } from '@modules/datetimepicker/datetimepicker.module';
import { LogService } from '@pages/log/log.service';
import { LogDialogComponent } from '@pages/log/detail/log-dialog.component';

const routes: Routes = [
  {path: '', component: LogComponent},
];

@NgModule({
  imports: [
    AppSharedModule,
    RouterModule.forChild(routes),
    DatetimepickerModule,
    GenericListModule
  ],
  declarations: [
    LogComponent,
    LogDialogComponent
  ],
  entryComponents: [
    LogDialogComponent
  ],
  providers: [
    LogService
  ]
})
export class LogModule {
}
