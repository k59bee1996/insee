import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  MaxNumberDirective
} from './max-number.directive';

@NgModule({
  declarations: [
    MaxNumberDirective,
  ],
  imports: [
    CommonModule // ngTemplateOutlet
  ],
  exports: [
    MaxNumberDirective,
  ],
})
export class MaxNumberModule {

}
