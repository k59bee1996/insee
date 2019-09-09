import {
  Directive,
  ElementRef,
  Input,
  HostListener
} from '@angular/core';

@Directive({ selector: '[limit-to]' })
export class LimitToDirective {
  @Input('limit-to') limitTo;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(e) {
    const limit = +this.limitTo;
    // if (e.target.value.length >= limit || (e.which < 48 || e.which > 57) || ((e.which < 48 || e.which > 57) && e.target.value.length <= limit)) {
    if (e.target.value.length >= limit || e.which < 48 || e.which > 57) {
      e.preventDefault();
    }
  }

  @HostListener('change', ['$event'])
  onChange(e) {
    const limit = +this.limitTo;
    if (e.target.value.length >= limit) {
      e.target.value = e.target.value.substring(0, limit);
    }
  }

}
