import {
  Component,
  OnInit
} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../profile.service';
import { BaseComponent } from '@modules/base/base.component';
import { Matcher } from '@common/validators/matcher.validator';

@Component({
  selector: 'password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: []
})
export class PasswordDialogComponent extends BaseComponent implements OnInit {
  public saveOb: Observable<any>;
  public frm: FormGroup;
  public controlConfig = {
    currentPassword: new FormControl('', [Validators.minLength(4), Validators.required]),
    newPassword: new FormControl('', [Validators.minLength(4), Matcher('confirmPassword'), Validators.required]),
    confirmPassword: new FormControl('', [Validators.minLength(4), Matcher('newPassword'), Validators.required]),
  };
  public formErrors = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  public validationMessages = {
    currentPassword: {
      minlength: 'Password must at least 4 characters.',
      required: 'Current Password is required.'
    },
    newPassword: {
      minlength: 'Password must at least 4 characters.',
      nomatch: 'New Password has to same as password.',
      required: 'New Password is required.'
    },
    confirmPassword: {
      minlength: 'Password must at least 4 characters.',
      nomatch: 'Confirm password has to same as password.',
      required: 'Confirm Password is required.'
    },
  };

  constructor(public dialogRef: MatDialogRef<PasswordDialogComponent>,
              private _profileService: ProfileService,
              private _toastrService: ToastrService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  save() {
    const data = Object.assign({}, this.frm.getRawValue());
    this.saveOb = this._profileService.changePassword(data).share();
    this.saveOb.subscribe(() => {
      this._toastrService.success('Success');
      this.dialogRef.close(true);
    }, (err) => {
      // this.dialogRef.close(false);
    });
  }

}
