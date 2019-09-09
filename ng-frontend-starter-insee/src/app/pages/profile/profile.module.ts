import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { ProfileService } from './profile.service';
import { ProfileComponent } from './profile.component';
import { ProfileDialogComponent } from './detail-dialog/detail-dialog.component';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { AppSharedModule } from '@common/index';
import { QrCodeModule } from '@modules/qr-code/qr-code.module';

const routes: Routes = [
  {path: '', component: ProfileComponent},
];

@NgModule({
  imports: [
    AppSharedModule,
    RouterModule.forChild(routes),
    QrCodeModule,
  ],
  declarations: [
    ProfileComponent,
    ProfileDialogComponent,
    PasswordDialogComponent
  ],
  entryComponents: [
    ProfileDialogComponent,
    PasswordDialogComponent
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule {
}
