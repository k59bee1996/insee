import {
  Directive,
  ElementRef,
  HostListener
} from '@angular/core';

@Directive({ selector: '[max-number]' })
export class MaxNumberDirective {
  constructor(private elementRef: ElementRef) {
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(e) {
    if (Number(e.target.value + e.key) > Number(e.target.max)) {
      e.preventDefault();
    }
  }

  @HostListener('change', ['$event'])
  onChange(e) {
    if (e.target.value > Number(e.target.max)) {
      e.target.value = Number(e.target.max);
    }
  }
}
