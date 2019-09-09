import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { RoleListComponent } from './list/list.component';
import { RolesService } from './roles.service';
import { RoleDetailComponent } from './detail/detail.component';
import { AppSharedModule } from '@common/index';
import { DragDropModule } from '@angular/cdk/drag-drop';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: RoleListComponent},
  {path: 'new', component: RoleDetailComponent},
  {path: 'detail/:id', component: RoleDetailComponent},
  {path: '**', redirectTo: 'list'},
];

@NgModule({
  imports: [
    AppSharedModule,
    RouterModule.forChild(routes),
    DragDropModule
  ],
  declarations: [
    RoleListComponent,
    RoleDetailComponent
  ],
  providers: [
    RolesService
  ]
})
export class RolesModule {
}
