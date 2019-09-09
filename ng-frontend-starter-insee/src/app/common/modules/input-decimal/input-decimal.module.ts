import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  InputDecimalDirective
} from './input-decimal.directive';

@NgModule({
  declarations: [
    InputDecimalDirective,
  ],
  imports: [
    CommonModule // ngTemplateOutlet
  ],
  exports: [
    InputDecimalDirective,
  ],
})
export class InputDecimalModule {

}
