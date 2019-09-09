import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@services/auth';
import { FuseConfigService } from '@fuse/services/config.service';
import { Observable } from 'rxjs/Observable';
import { fuseAnimations } from '@fuse/animations';
import { FuseNavigationModel } from 'app/navigation/navigation';
import { TranslateService } from '@ngx-translate/core';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Component({
  selector: 'fuse-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: fuseAnimations
})
export class FuseLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginFormErrors: any;
  loginOb: Observable<any>;

  constructor(private translate: TranslateService,
              private fuseNavigationService: FuseNavigationService,
              private fuseConfig: FuseConfigService,
              private formBuilder: FormBuilder,
              private _router: Router,
              private _toast: ToastrService,
              private _authService: AuthService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.fuseConfig.setConfig({
        layout: {
          navigation: 'none',
          toolbar: 'none',
          footer: 'none'
        }
      });
    });

    this.loginFormErrors = {
      email: {},
      password: {}
    };
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.onLoginFormValuesChanged();
    });
  }

  onLoginFormValuesChanged() {
    for (const field in this.loginFormErrors) {
      if (!this.loginFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.loginFormErrors[field] = {};

      // Get the control
      const control = this.loginForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.loginFormErrors[field] = control.errors;
      }
    }
  }

  public onSubmit() {
    // this.hasError = false;
    // this.submitted = true;
    this.loginOb = this._authService.login(this.loginForm.value.email, this.loginForm.value.password);
    this.loginOb.subscribe((resp) => {
      this._router.navigateByUrl('pages');
      this.fuseNavigationService.setNavigationModel(new FuseNavigationModel(this._authService, this.translate).model);
    }, (err) => {
      const errorMessage = err.error && err.error.error_description || 'An error occurs when login, please try again or contact administrator for support';
      this._toast.error(errorMessage);
    });
  }
}
