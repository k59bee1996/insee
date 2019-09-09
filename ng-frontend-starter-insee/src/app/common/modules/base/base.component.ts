import {
  Component, OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'base-component',
  encapsulation: ViewEncapsulation.None,
  template: '',
})
export class BaseComponent implements OnInit {

  public frm: any;
  public formErrors: any;
  public validationMessages: any;
  public controlConfig: any;

  public ngOnInit() {
    this.buildForm();
  }

  public buildForm() {
    this.frm = new FormGroup(this.controlConfig);

    this.frm.valueChanges
      .subscribe((data) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  public revalidateOnChanges(control): void {
    if (control && control._parent && !control._revalidateOnChanges) {
      control._revalidateOnChanges = true;
      control._parent
        .valueChanges
        .distinctUntilChanged((a, b) => {
          // These will always be plain objects coming from the form, do a simple comparison
          if (a && !b || !a && b) {
            return false;
          } else if (a && b && Object.keys(a).length !== Object.keys(b).length) {
            return false;
          } else if (a && b) {
            for (const i in a) {
              if (a[i] !== b[i]) {
                return false;
              }
            }
          }
          return true;
        })
        .subscribe(() => {
          control.updateValueAndValidity();
        });

      control.updateValueAndValidity();
    }
    return;
  }

  public conditional(conditional, validator) {
    return (control) => {
      this.revalidateOnChanges(control);

      if (control && control._parent) {
        if (conditional(control._parent)) {
          return validator(control);
        }
      }
    };
  }

  public onValueChanged(data?: any) {
    const self = this;

    if (!self.frm) {
      return;
    }
    const form = self.frm;
    for (const field in self.formErrors) {
      if (self.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        self.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = self.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              self.formErrors[field] += messages[key] + ' ';
              break;
            }
          }
        }
      }
    }
  }

  public checkFormInvalid() {
    const self = this;

    if (!self.frm) {
      return;
    }
    const form = self.frm;
    for (const field in self.formErrors) {
      if (self.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        self.formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = self.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              self.formErrors[field] += messages[key] + ' ';
              control.markAsTouched();
              control.markAsPristine();
              break;
            }
          }
        }
      }
    }
  }
}
