import { NgModule } from '@angular/core';
import { DatetimepickerComponent } from './datetimepicker.component';
import { MaterialTimeControlModule } from '../material-time-control/material-time-control.module';
import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
  imports: [
    FuseSharedModule,
    MaterialTimeControlModule
  ],
  declarations: [
    DatetimepickerComponent
  ],
  exports: [
    DatetimepickerComponent
  ]
})
export class DatetimepickerModule {
}
