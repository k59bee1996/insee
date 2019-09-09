import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../common/models/users.model';
import { ProfileService } from '../profile.service';
import { BaseComponent } from '@modules/base/base.component';
import { AppConstant } from '@common/services';
import { Gender } from '@common/models/CommonConstant';

@Component({
  selector: 'profile-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: []
})
export class ProfileDialogComponent extends BaseComponent implements OnInit {
  public data: User = new User();
  public Gender = Gender;
  public saveOb: Observable<any>;
  public frm: FormGroup;
  public controlConfig = {
    username: new FormControl({value: '', disabled: true}, [
      Validators.required,
      Validators.pattern('^\\S*$')
    ]),
    email: new FormControl('', [Validators.pattern(AppConstant.pattern.email)]),
    fullName: new FormControl('', [Validators.pattern(AppConstant.pattern.whiteSpace)]),
    // position: new FormControl('', [Validators.pattern(AppConstant.pattern.whiteSpace)]),
    // birthDate: new FormControl(''),
    phone: new FormControl(''),
    genderId: new FormControl(0),
  };
  public formErrors = {
    username: '',
    email: '',
    fullName: '',
  };
  public validationMessages = {
    username: {
      required: 'Username is required.',
      pattern: 'White space is not allowed'
    },
    email: {
      pattern: 'Email incorrect format'
    },
    fullName: {
      pattern: 'White space is not allowed'
    },
  };

  constructor(public dialogRef: MatDialogRef<ProfileDialogComponent>,
              private _profileService: ProfileService,
              private _toastrService: ToastrService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.data && this.data.id) {
      this.frm.patchValue(this.data);
    } else {
      this.dialogRef.close(false);
    }
  }

  save() {
    const data = Object.assign({}, this.data, this.frm.getRawValue());
    this.saveOb = this._profileService.update(data).share();
    this.saveOb.subscribe(() => {
      this._toastrService.success('Success');
      this.dialogRef.close(data);
    }, (err) => {
      this.dialogRef.close(false);
    });
  }

}
