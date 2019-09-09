import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output
} from '@angular/core';

@Directive({
  selector: '[domChange]'
})
export class DomChangeDirective implements OnDestroy {
  private changes: MutationObserver;

  @Output()
  public domChange = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    const element = this.elementRef.nativeElement;

    this.changes = new MutationObserver((mutations: MutationRecord[]) => {
      // find element duplicate and remove
      // mutations = mutations.filter((item, index, self) => self.findIndex(t => t.target === item.target) === index)
        mutations.forEach((mutation: MutationRecord) => this.domChange.emit(mutation));
      }
    );

    this.changes.observe(element, {
      attributes: true,
      childList: false,
      characterData: false
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
