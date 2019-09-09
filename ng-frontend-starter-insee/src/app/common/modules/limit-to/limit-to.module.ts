import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  LimitToDirective
} from './limit-to.directive';

@NgModule({
  declarations: [
    LimitToDirective,
  ],
  imports: [
    CommonModule // ngTemplateOutlet
  ],
  exports: [
    LimitToDirective,
  ],
})
export class LimitToModule {

}
