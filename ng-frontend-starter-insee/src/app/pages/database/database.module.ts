import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { DatabaseListComponent } from './list/list.component';
import { DatabaseService } from './database.service';
import { DatabaseDialogComponent } from './dialog/dialog.component';
import { AppSharedModule } from '@common/index';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: DatabaseListComponent},
  {path: '**', redirectTo: 'list'},
];

@NgModule({
  imports: [
    AppSharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    DatabaseListComponent,
    DatabaseDialogComponent
  ],
  entryComponents: [
    DatabaseDialogComponent,
  ],
  providers: [
    DatabaseService
  ]
})
export class DatabaseModule {
}
