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
import { UsersService } from '../users.service';
import { User } from '../../../common/models/users.model';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  MatDialog,
  MatDialogRef
} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { UserRole } from '../../../common/models/roles.model';
import { fuseAnimations } from '@fuse/animations';
import { BaseComponent } from '@modules/base/base.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AppConstant } from '@common/services';
import { ValidateNumber } from '@common/validators/number.validator';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { WarehouseService } from '@services/business';
import { Gender } from '@common/models/CommonConstant';

// import * as QRCode from 'qrcode';

@Component({
  selector: 'app-user-detail',
  templateUrl: 'detail.component.html',
  styleUrls: ['detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserDetailComponent extends BaseComponent implements OnInit, OnDestroy {
  public data: User = new User();
  public pageType = 'new';
  public Gender = Gender;
  public warehouseList = [];
  public roleList: UserRole[] = [];
  public roleSelected: UserRole[] = [];
  public confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  public saveOb: Observable<any>;
  public resetPassOb: Observable<any>;
  public frm: FormGroup;
  // public urlQrCode: string;
  public controlConfig = {
    username: new FormControl('', [Validators.required, Validators.pattern(AppConstant.pattern.whiteSpace)]),
    email: new FormControl('', [Validators.pattern(AppConstant.pattern.email)]),
    fullName: new FormControl('', [Validators.pattern(AppConstant.pattern.whiteSpace)]),
    position: new FormControl('', [Validators.pattern(AppConstant.pattern.whiteSpace)]),
    birthDate: new FormControl(''),
    phone: new FormControl('', ValidateNumber()),
    genderId: new FormControl(0),
    userRoles: new FormControl([]),
    isActive: new FormControl(true),
    warehouseId: new FormControl(null),
  };
  public formErrors = {
    username: '',
    email: '',
    fullName: '',
    position: '',
    phone: ''
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
    },
    phone: {
      number: 'Phone must be number'
    }
  };

  constructor(private _usersService: UsersService,
              private _warehouseService: WarehouseService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _dialog: MatDialog,
              private _toastrService: ToastrService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this._warehouseService.fetchList().subscribe((resp: any) => {
      this.warehouseList = resp.warehouseList;
    });
    this._activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this._usersService.getRoles().subscribe((res) => {
        this.roleList = res.userRoles;
        if (!id) {
          this.pageType = 'new';
        } else {
          this.pageType = 'edit';
          this._usersService.getDetail(id).subscribe((resp) => {
            this.data = new User(resp);
            this.roleSelected = this.data.userRoles;
            this.frm.patchValue(this.data);
            // generator qrcode login from response server
            // QRCode.toDataURL(this.data.qrCode)
            //   .then(url => {
            //     this.urlQrCode = url;
            //   })
            this.frm.get('userRoles').patchValue(this.data.userRoles.map((role) => role.id));
            this.frm.get('username').disable();
            this.roleList = this.roleList.filter((available) => {
              return this.roleSelected.findIndex((selected) => {
                return selected.id === available.id;
              }) < 0;
            });
          }, (err) => {
            this._router.navigate(['pages', 'user-management', 'users']);
          });
        }
      });

    });
  }

  save() {
    const data = Object.assign({}, this.data, this.frm.getRawValue());
    // data.userRoles = this.roleList.filter((role) => {
    //   return data.userRoles.find((id) => role.id === id);
    // });
    data.userRoles = this.roleSelected;
    data.username = data.username.trim();
    this.saveOb = this._usersService.update(data).share();
    this.saveOb.subscribe(() => {
      this._toastrService.success('Success');
      this.back();
    }, (err) => {
    });
  }

  add() {
    const data = this.frm.getRawValue();
    // data.userRoles = this.roleList.filter((role) => {
    //   return data.userRoles.find((id) => role.id === id);
    // });
    data.userRoles = this.roleSelected;
    data.username = data.username.trim();
    // data.handle = FuseUtils.handleize(data.name);
    this.saveOb = this._usersService.create(data).share();
    this.saveOb.subscribe(() => {
      this._toastrService.success('Success');
      this.back();
    }, (err) => {
      this.frm.markAsPristine();
    });
  }

  delete() {
    this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._usersService.delete(this.data.id).subscribe(() => {
          this._toastrService.success('Success');
          this.back();
        });
      }
      this.confirmDialogRef = null;
    });
  }

  resetPassword() {
    this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to reset password?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetPassOb = this._usersService.resetPassword(this.data.id);
        this.resetPassOb.subscribe(() => {
          this._toastrService.success('Success');
          // this._router.navigate(['pages', 'user-management', 'users']);
        });
      }
      this.confirmDialogRef = null;
    });
  }

  back() {
    this._router.navigate(['pages', 'user-management', 'users']);
  }

  moveSelected(index?: number) {
    if (index === undefined) {
      this.roleList = this.roleList.concat(this.roleSelected);
      this.roleSelected = [];
    } else {
      this.roleList.push(this.roleSelected[index]);
      this.roleSelected.splice(index, 1);
    }
    this.frm.markAsDirty();
  }

  moveAvailable(index?: number) {
    if (index === undefined) {
      this.roleSelected = this.roleSelected.concat(this.roleList);
      this.roleList = [];
    } else {
      this.roleSelected.push(this.roleList[index]);
      this.roleList.splice(index, 1);
    }
    this.frm.markAsDirty();
  }

  drop(event: CdkDragDrop<string[]>) {
    // console.log('drop event: ', event);
    // console.log('role selected: ', this.roleSelected);
    // console.log('role available: ', this.roleList);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.frm.markAsDirty();
  }

  ngOnDestroy() {
  }

}
