import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ProfileService } from './profile.service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { MatDialog } from '@angular/material';
import { User } from '../../common/models/users.model';
import * as moment from 'moment';
import { ProfileDialogComponent } from './detail-dialog/detail-dialog.component';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { BaseComponent } from '@modules/base/base.component';
import { AppConstant } from '@common/services';
import { AuthService } from '@services/auth';
import { Gender } from '@common/models/CommonConstant';

@Component({
  selector: 'user-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProfileComponent extends BaseComponent implements OnInit, OnDestroy {
  public data: User = new User();
  public Gender = Gender;
  public dialogRef: any;
  public frm: FormGroup;
  public controlConfig = {
    username: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\S*$')
    ]),
    email: new FormControl('', [Validators.pattern(AppConstant.pattern.email)]),
    fullName: new FormControl('', [Validators.pattern(AppConstant.pattern.whiteSpace)]),
    position: new FormControl('', [Validators.pattern(AppConstant.pattern.whiteSpace)]),
    birthDate: new FormControl(''),
    phone: new FormControl(''),
    latestLoggedin: new FormControl(''),
    latestLoggedString: new FormControl(''),
    genderId: new FormControl(0),
  };
  public formErrors = {
    username: '',
    email: '',
    fullName: '',
    position: '',
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
    position: {
      pattern: 'White space is not allowed'
    }
  };

  constructor(private _profileService: ProfileService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _dialog: MatDialog,
              private _authService: AuthService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this._profileService.getDetail(this._authService.currentUser.id).subscribe((resp) => {
      this.data = new User(resp);
      this.frm.patchValue(this.data);
      if (this.data.latestLoggedin) {
        const dateString = moment(this.data.latestLoggedin).format(AppConstant.format.moment.pipe);
        this.frm.patchValue({latestLoggedString: dateString});
      }
      this.frm.disable();
    }, (err) => {
    });
  }

  edit() {
    this.dialogRef = this._dialog.open(ProfileDialogComponent, {
      autoFocus: false,
      disableClose: false,
      width: '500px'
    });
    this.dialogRef.componentInstance.data = this.data;
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data = Object.assign(this.data, result);
        this.frm.patchValue(this.data);
      }
      this.dialogRef = null;
    });
  }

  changePassword() {
    this.dialogRef = this._dialog.open(PasswordDialogComponent, {
      autoFocus: false,
      disableClose: false,
      width: '500px'
    });
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
  }

  ngOnDestroy() {
  }

}
