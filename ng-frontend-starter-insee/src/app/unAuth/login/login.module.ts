import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseLoginComponent } from './login.component';
import { AppSharedModule } from '@common/index';

const routes = [
  {
    path: '',
    component: FuseLoginComponent
  }
];

@NgModule({
  declarations: [
    FuseLoginComponent
  ],
  imports: [
    AppSharedModule,
    RouterModule.forChild(routes)
  ]
})

export class LoginModule {

}
