import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  PromiseButtonDirective
} from './promise-button.directive';

@NgModule({
  declarations: [
    PromiseButtonDirective,
  ],
  imports: [
    CommonModule // ngTemplateOutlet
  ],
  exports: [
    PromiseButtonDirective,
  ],
})
export class PromiseButtonModule {

}
