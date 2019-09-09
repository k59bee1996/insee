import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  HostBinding,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Directive({selector: '[promise-btn]'})
export class PromiseButtonDirective implements OnChanges {
  @Input() public promiseButton: Observable<any>;

  @Input() public promiseButtonOptions = {
    disableBtn: true
  };

  @HostBinding('class.loading') public isLoading: boolean = false;

  constructor(private elementRef: ElementRef) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'promiseButton') {
        const change = changes[propName].currentValue;
        if (change) {
          const promise = change.share();
          this.start();
          promise.subscribe((res) => {
            this.stop();
          }, (error) => {
            this.stop();
          });
        }
      }
    }
  }

  private start() {
    this.isLoading = true;
    if (this.promiseButtonOptions.disableBtn) {
      this.elementRef.nativeElement.disabled = true;
    }
  }

  private stop() {
    this.isLoading = false;
    if (this.promiseButtonOptions.disableBtn) {
      this.elementRef.nativeElement.disabled = false;
    }
  }
}
