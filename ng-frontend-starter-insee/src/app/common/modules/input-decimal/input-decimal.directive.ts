import {
  Directive,
  ElementRef,
  Input,
  HostListener
} from '@angular/core';

@Directive({ selector: '[input-decimal]' })
export class InputDecimalDirective {
  @Input('input-decimal') inputDecimal;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(e) {
    const regex = new RegExp('/^(\\+|-)?[0-9]{0,}((\\.){1}[0-9]{1,}){0,1}$/');
    // var a = regex.test(parseInt(e.target.value, null))
    // if (e.target.value.length >= limit || (e.which < 48 || e.which > 57) || ((e.which < 48 || e.which > 57) && e.target.value.length <= limit)) {
    if (e.target.value.length > 0 && !regex.test(e.target.value) ) {
      e.preventDefault();
    }
  }

  @HostListener('change', ['$event'])
  onChange(e) {
    const regex = new RegExp('[0-9]+(\\.[0-9][0-9]?)?');
    if (e.target.value.length > 0 && !regex.test(e.target.value)) {
      e.target.value = e.target.value.substring();
    }
  }

}
