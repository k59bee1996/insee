import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '@modules/base/base.component';
import { ValidateNumber } from '@common/validators/number.validator';
import { WarehouseModel, WarehouseStatus } from '@pages/warehouse/warehouse.model';
import { WarehouseService } from '@pages/warehouse/warehouse.service';
import { AppConstant } from '@common/services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'warehouse-dialog',
  templateUrl: './warehouse-dialog.component.html',
  styleUrls: []
})
export class WarehouseDialogComponent extends BaseComponent implements OnInit {
  public id: string;
  public areaId: number = 0;
  public data: WarehouseModel = new WarehouseModel();
  public areaList = [];
  public isAdmin: boolean = false;
  public confirmDialogRef: any;
  // public statusList = WarehouseStatus;
  public domain = AppConstant.domain + '/';
  public saveOb: Observable<any>;
  public frm: FormGroup;
  public controlConfig = {
    name: new FormControl('', [Validators.required]),
    warehouseStatusId: new FormControl(10),
    pictureId: new FormControl(0, [Validators.required]),
    imageUrl: new FormControl(''),
    points: new FormControl(''),
    temperature: new FormControl(null),
    humidity: new FormControl(null),
    acreage: new FormControl(''),
    areaId: new FormControl(this.areaId),
  };
  public formErrors = {
    name: '',
  };
  public validationMessages = {
    name: {
      required: 'Name is required.',
    },
  };

  constructor(public dialogRef: MatDialogRef<WarehouseDialogComponent>,
              private _warehouseService: WarehouseService,
              private _dialog: MatDialog,
              private _toastrService: ToastrService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this._warehouseService.getAreas().subscribe((resp) => {
      this.areaList = resp && resp.areaList || [];
    });
    if (this.id) {
      this._warehouseService.getDetail(this.id).subscribe((resp) => {
        this.data = new WarehouseModel(resp);
        this.frm.patchValue(this.data);
      }, (err) => {
        this.dialogRef.close(false);
      });
    } else {
      if (this.areaId) {
        this.frm.patchValue({areaId: this.areaId});
      }
    }
  }

  save() {
    const data = Object.assign({}, this.data, this.frm.getRawValue());
    data.name = data.name.trim();
    if (!data.pictureId) {
      this._toastrService.warning('Please upload image.');
      return;
    }
    if (this.id) {
      this.saveOb = this._warehouseService.update(data).share();
    } else {
      this.saveOb = this._warehouseService.create(data).share();
    }
    this.saveOb.subscribe(() => {
      this._toastrService.success('Success');
      this.dialogRef.close(true);
    }, (err) => {
      this.dialogRef.close(false);
    });
  }

  delete() {
    if (!this.id) {
      return;
    }
    this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._warehouseService.delete(this.id).subscribe((resp) => {
          this._toastrService.success('Success');
          this.dialogRef.close(true);
        });
      }
      this.confirmDialogRef = null;
    });
  }

  uploadImage(resp) {
    this.frm.get('pictureId').setValue(resp.id);
    this.frm.get('imageUrl').setValue(resp.pictureUrl);
    this.frm.markAsDirty();
  }

}
