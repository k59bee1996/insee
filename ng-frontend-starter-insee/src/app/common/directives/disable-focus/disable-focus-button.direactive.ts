import {
  Directive,
  HostListener,
  Renderer2
} from '@angular/core';
import {
  MatButton,
  MatDialog
} from '@angular/material';

@Directive({
  selector: '[disableFocus]'
})

export class DisableFocusButtonDirective {

  constructor(private matButton: MatButton,
              private dialog: MatDialog,
              private renderer: Renderer2) {
  }

  @HostListener('click', ['$event.target']) onClick() {
    this.dialog.afterAllClosed.subscribe(() => this.fixFocusButton());
  }

  private fixFocusButton() {
    this.renderer.removeClass(this.matButton._elementRef.nativeElement, 'cdk-program-focused');
    this.renderer.addClass(this.matButton._elementRef.nativeElement, 'cdk-mouse-focused');
  }
}
