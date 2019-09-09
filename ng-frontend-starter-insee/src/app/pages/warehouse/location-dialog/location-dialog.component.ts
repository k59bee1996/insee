import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {LocationModel, LocationStatus, LocationType} from '../warehouse.model';
import {WarehouseService} from '../warehouse.service';
import {BaseComponent} from '@modules/base/base.component';
import {TypeBarcode} from "@common/models/CommonConstant";
import {PrintQrCodeComponent} from "@modules/print-qr-code/print-qr-code.component";
import * as moment from 'moment';
import {AppConstant} from "@common/services";

@Component({
  selector: 'location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['location-dialog.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LocationDialogComponent extends BaseComponent implements OnInit {
  public id: number;
  public warehouseId: string;
  public data: LocationModel = new LocationModel();
  public statusList = LocationStatus;
  public typeList = LocationType;
  public productList = [];
  public originProductList = [];
  public productDialogRef: any;
  public saveOb: Observable<any>;
  public frm: FormGroup;
  public controlConfig = {
    name: new FormControl('', [Validators.required]),
    area: new FormControl(''),
    line: new FormControl(''),
    row: new FormControl(''),
    cell: new FormControl(''),
    colorCode: new FormControl(this.data.colorCode),
    locationStatusId: new FormControl(this.data.locationStatusId),
    locationTypeId: new FormControl(this.data.locationTypeId),
  };
  public formErrors = {
    name: ''
  };
  public validationMessages = {
    name: {
      required: 'Name is required.',
    },
  };
  public printQrCode: PrintQrCodeComponent;

  constructor(public dialogRef: MatDialogRef<LocationDialogComponent>,
              private _dialog: MatDialog,
              private _warehouseService: WarehouseService,
              private _toastrService: ToastrService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.id) {
      this._warehouseService.getLocation(this.id).subscribe((resp) => {
        this.data = new LocationModel(resp);
        this.frm.patchValue(this.data);
      }, (err) => {
        this.dialogRef.close(false);
      });
      this._warehouseService.getProductsByLocationId(this.id).subscribe((resp) => {
        this.productList = resp && resp.barcodeItems || [];
        this.originProductList = this.productList.map(o => Object.assign({}, o));
      });
    }
  }

  save() {
    const data = Object.assign({}, this.data, this.frm.getRawValue());
    data.name = data.name.trim();
    data.warehouseId = this.warehouseId;
    if (this.id) {
      this.saveOb = this._warehouseService.updateLocation(data).share();
    } else {
      this.saveOb = this._warehouseService.createLocation(data).share();
    }
    this.saveOb.subscribe(() => {
      this._toastrService.success('Success');
      this.dialogRef.close(true);
    }, (err) => {
      this.dialogRef.close(false);
    });
  }

  onSelectColor(color) {
    this.frm.patchValue({colorCode: color});
    this.frm.markAsDirty();
  }

  selectProduct(item) {
    // this.productDialogRef = this._dialog.open(ItemListDialogComponent, {
    //   autoFocus: false,
    //   disableClose: false,
    //   width: '1000px',
    //   data: {
    //     id: this.id
    //   }
    // });
    // this.productDialogRef.componentInstance.allowMultiSelect = false;
    // this.productDialogRef.afterClosed().subscribe(result => {
    //   if (Array.isArray(result) && result.length && result[0].id !== item.productId) {
    //     item.productId = result[0].id;
    //     item.productName = result[0].productName;
    //     item.productCode = result[0].upcCode;
    //     item.isEditing = true
    //   }
    //   this.productDialogRef = null;
    // });
  }

  async saveItem(p) {
    if (isNaN(p.quantity) || p.quantity < 0) {
      return;
    }
    if (p.expiryDate) {
      p.expiriedDate = moment(p.expiryDate).format(AppConstant.format.moment.fullDate);
    } else {
      p.expiriedDate = moment().add(1, 'y').format(AppConstant.format.moment.fullDate);
    }
    this._warehouseService.updateBarcodeItem(p).subscribe(() => {
      p.isEditing = false;
      this._toastrService.success('Success');
    });
  }

  cancelEdit(data) {
    const item = this.originProductList.find(p => p.barcodeItemId === data.barcodeItemId);
    if (item) {
      data.isEditing = false;
      data.quantity = item.quantity;
      data.productId = item.productId;
      data.productCode = item.productCode;
      data.productName = item.productName;
      data.expiryDate = item.expiryDate;
      // this._cd.markForCheck();
    }
  }

  async print(data) {
    if (this.printQrCode) {
      await this.printQrCode.print([data], 250, TypeBarcode.Product);
    }
  }

}
