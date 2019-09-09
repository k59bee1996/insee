import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { LanguageListComponent } from './list/list.component';
import { LanguageService } from './language.service';
import { LanguageDialogComponent } from './language-dialog/language-dialog.component';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceDialogComponent } from './resource-dialog/resource-dialog.component';
import { AppSharedModule } from '@common/index';
import { UploaderModule } from '@modules/uploader';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: LanguageListComponent},
  {path: 'manage/:id', component: ResourceListComponent},
  {path: '**', redirectTo: 'list'},
];

@NgModule({
  imports: [
    AppSharedModule,
    RouterModule.forChild(routes),
    UploaderModule
  ],
  declarations: [
    LanguageListComponent,
    LanguageDialogComponent,
    ResourceListComponent,
    ResourceDialogComponent
  ],
  entryComponents: [
    LanguageDialogComponent,
    ResourceDialogComponent
  ],
  providers: [
    LanguageService
  ]
})
export class LanguageModule {
}
