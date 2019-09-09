import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingListComponent } from './list/list.component';
import { SettingService } from './setting.service';
import { SettingDialogComponent } from './dialog/dialog.component';
import { AppSharedModule } from '@common/index';
import { GenericListModule } from '@modules/generic-list/generic-list.module';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: SettingListComponent},
  {path: '**', redirectTo: 'list'},
];

@NgModule({
  imports: [
    AppSharedModule,
    RouterModule.forChild(routes),
    GenericListModule
  ],
  declarations: [
    SettingListComponent,
    SettingDialogComponent
  ],
  entryComponents: [
    SettingDialogComponent,
  ],
  providers: [
    SettingService
  ]
})
export class SettingModule {
}
