import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseError404Component } from './error-404.component';
import { AppSharedModule } from '@common/index';

const routes = [
  {
    path: '',
    component: FuseError404Component
  }
];

@NgModule({
  declarations: [
    FuseError404Component
  ],
  imports: [
    AppSharedModule,
    RouterModule.forChild(routes)
  ]
})

export class Error404Module {

}
