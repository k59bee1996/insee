import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { UserListComponent } from './list/list.component';
import { UsersService } from './users.service';
import { UserDetailComponent } from './detail/detail.component';
import { UploaderModule } from '@common/modules/uploader';
import { HistoryPageModule } from '@common/modules/history-page';
import { UserHistoryComponent } from './history/history.component';
import { AppSharedModule } from '@common/index';
import { QrCodeModule } from '@modules/qr-code/qr-code.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WarehouseService } from '@services/business';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: UserListComponent},
  {path: 'new', component: UserDetailComponent},
  {path: 'detail/:id', component: UserDetailComponent},
  {path: 'history/:id', component: UserHistoryComponent},
  {path: '**', redirectTo: 'list'},
];

@NgModule({
  imports: [
    AppSharedModule,
    RouterModule.forChild(routes),
    UploaderModule,
    HistoryPageModule,
    QrCodeModule,
    DragDropModule
  ],
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserHistoryComponent
  ],
  providers: [
    UsersService,
    WarehouseService
  ]
})
export class UsersModule {
}
