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
import { RolesService } from '../roles.service';
import { UserRole } from '../../../common/models/roles.model';
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
import { fuseAnimations } from '@fuse/animations';
import { BaseComponent } from '@modules/base/base.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AppConstant } from '@common/services';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-role-detail',
  templateUrl: 'detail.component.html',
  styleUrls: ['detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RoleDetailComponent extends BaseComponent implements OnInit, OnDestroy {
  public data: UserRole = new UserRole();
  public pageType = 'new';
  public permissionList: any[] = [];
  public permissionSelected: any[] = [];
  public confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  public saveOb: Observable<any>;
  public frm: FormGroup;
  public controlConfig = {
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(AppConstant.pattern.alphabet)
    ]),
    description: new FormControl(''),
    permissions: new FormControl([]),
    isActive: new FormControl(true),
  };
  public formErrors = {
    name: ''
  };
  public validationMessages = {
    name: {
      required: 'Role name is required.',
      pattern: 'Role name must be alphabet characters only.'
    }
  };

  constructor(private _rolesService: RolesService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _dialog: MatDialog,
              private _toastrService: ToastrService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this._activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this._rolesService.getPermissions().subscribe((res) => {
        this.permissionList = res.permissionList;
        if (!id || id === 'new') {
          this.pageType = 'new';
        } else {
          this.pageType = 'edit';
          this._rolesService.getDetail(id).subscribe((resp) => {
            this.data = new UserRole(resp);
            this.frm.patchValue(this.data);
            this.permissionSelected = this.data.permissions;
            this.frm.get('permissions').patchValue(this.data.permissions.map((p) => p.id));
            this.permissionList = this.permissionList.filter((availableP) => {
              return this.permissionSelected.findIndex((selectedP) => {
                return selectedP.id === availableP.id;
              }) < 0;
            });
          }, (err) => {
            this.back();
          });
        }
      });
    });
  }

  save() {
    const data = Object.assign({}, this.data, this.frm.getRawValue());
    data.name = data.name.trim();
    if (!data.systemName) {
      data.systemName = data.name.replace(/ /g, '');
    }
    // data.permissions = this.permissionList.filter((p) => {
    //   return data.permissions.find((id) => p.id === id);
    // });
    data.permissions = this.permissionSelected;
    this.saveOb = this._rolesService.update(data).share();
    this.saveOb.subscribe(() => {
      this._toastrService.success('Success');
      this.back();
    }, (err) => {
    });
  }

  add() {
    const data = this.frm.getRawValue();
    data.name = data.name.trim();
    data.systemName = data.name.replace(/ /g, '');
    // data.permissions = this.permissionList.filter((p) => {
    //   return data.permissions.find((id) => p.id === id);
    // });
    data.permissions = this.permissionSelected;
    this.saveOb = this._rolesService.create(data).share();
    this.saveOb.subscribe(() => {
      this._toastrService.success('Success');
      this.back();
    }, (err) => {
    });
  }

  delete() {
    this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._rolesService.delete(this.data.id).subscribe(() => {
          this._toastrService.success('Success');
          this.back();
        });
      }
      this.confirmDialogRef = null;
    });
  }

  back() {
    this._router.navigate(['pages', 'user-management', 'roles']);
  }

  moveSelected(index?: number) {
    if (index === undefined) {
      this.permissionList = this.permissionList.concat(this.permissionSelected);
      this.permissionSelected = [];
    } else {
      this.permissionList.push(this.permissionSelected[index]);
      this.permissionSelected.splice(index, 1);
    }
    this.frm.markAsDirty();
  }

  moveAvailable(index?: number) {
    if (index === undefined) {
      this.permissionSelected = this.permissionSelected.concat(this.permissionList);
      this.permissionList = [];
    } else {
      this.permissionSelected.push(this.permissionList[index]);
      this.permissionList.splice(index, 1);
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
