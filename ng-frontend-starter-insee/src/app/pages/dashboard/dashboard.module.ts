import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { ReportService } from '@services/business';
import { AppSharedModule } from '@common/index';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MaterialModule } from '@fuse/material.module';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from 'ng-pick-datetime';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    AppSharedModule,
    NgxChartsModule,
    MaterialModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    ReportService
  ]
})
export class DashboardModule {
}
