import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { of as observableOf } from 'rxjs/observable/of';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';
import { LocationDialogComponent } from '../location-dialog/location-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { WarehouseService } from '@pages/warehouse/warehouse.service';
import { LocationModel, LocationResponse, WarehouseModel } from '@pages/warehouse/warehouse.model';
import { AppConstant } from '@common/services';
// import * as QRCode from 'qrcode';
// import printJS from 'print-js';
import { LocationMapComponent } from '@pages/warehouse/location-map/location-map.component';
import { PrintQrCodeComponent } from '@modules/print-qr-code/print-qr-code.component';
import { MarkerType, TypeBarcode } from '@common/models/CommonConstant';
import { AuthService } from '@services/auth';

@Component({
  selector: 'location-list',
  templateUrl: 'location-list.component.html',
  styleUrls: ['location-list.component.scss', '../warehouse.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LocationListComponent implements OnInit, OnDestroy {
  public id;
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = ['name', 'line', 'cell', 'button2'];
  public isAdmin: boolean = false;
  public isLoadingResults = true;
  public confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  public dialogRef: any;
  public onDataChanged: Subject<any> = new Subject();
  public dataSubscription: Subscription;
  public warehouseData: WarehouseModel = new WarehouseModel();
  public domain: string = AppConstant.domain + '/';
  public printCodeData: { name?: string, barcode?: string }[] = [];
  public barcodeWidth: number = 270;
  public MarkerType = MarkerType;
  public showColumnLayout = false;
  public selectedStatus = '';

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('filterLine') filterLine: ElementRef;
  @ViewChild('filterProduct') filterProduct: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('locationMap') locationMap: LocationMapComponent;
  @ViewChild('printQrCode') printQrCode: PrintQrCodeComponent;

  constructor(private _warehouseService: WarehouseService,
              private _authService: AuthService,
              private _toastrService: ToastrService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _dialog: MatDialog) {
  }

  ngOnInit() {
    this.isAdmin = this._authService.isAdmin();
    this._activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      const locationId = +params.get('locationId');
      if (locationId) {
        setTimeout(() => {
          this.locationMap && this.locationMap.selectSeat(locationId, true);
        }, 2000);
      }

      if (this.id) {
        // this.paginator.pageIndex = 0;
        this.onDataChanged.next(this.id);
        this._warehouseService.getDetail(this.id).subscribe((resp) => {
          this.warehouseData = new WarehouseModel(resp);
        }, (err) => {
          this.goBack();
        });
      } else {
        this.goBack();
      }
    });
    const searchEvent = Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(500)
      .distinctUntilChanged();
    const searchProduct = Observable.fromEvent(this.filterProduct.nativeElement, 'keyup')
      .debounceTime(500)
      .distinctUntilChanged();
    const searchLine = Observable.fromEvent(this.filterLine.nativeElement, 'keyup')
      .debounceTime(500)
      .distinctUntilChanged();
    // If the user changes the sort order or search, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // searchEvent.subscribe(() => this.paginator.pageIndex = 0);
    this.dataSubscription = Observable.merge(this.sort.sortChange, searchEvent, searchLine, searchProduct, this.onDataChanged)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          let params: any = {
            // pageIndex: (this.paginator.pageIndex || 0) + 1,
            // pageSize: this.paginator.pageSize || 25,
          };
          if (this.filter && this.filter.nativeElement.value) {
            params.textSearch = this.filter.nativeElement.value;
          }
          if (this.filterProduct && this.filterProduct.nativeElement.value) {
            params.product = this.filterProduct.nativeElement.value;
          }
          if (this.filterLine && this.filterLine.nativeElement.value) {
            params.line = this.filterLine.nativeElement.value;
          }
          if (this.sort.active && this.sort.direction) {
            params.sortField = this.sort.active;
            params.orderDescending = this.sort.direction === 'desc' ? 'true' : 'false';
          }
          params.isEmpty = this.selectedStatus;
          if (!this.id) {
            return observableOf({ locations: [] });
          }
          return this._warehouseService.getLocations(this.id, params);
        }),
        map((data: LocationResponse) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          // this.resultsLength = data.total || 0;
          return data.locations;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
    this._activatedRoute.queryParamMap.subscribe((params) => {
      const product = params.get('product');
      this.filterProduct.nativeElement.value = product;
      if (product) {
        setTimeout(() => {
          this.onDataChanged.next(product);
        });
      }
    });
  }

  statusChange(status) {
    this.onDataChanged.next(status.value);

  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  add(data) {
    this.dialogRef = this._dialog.open(LocationDialogComponent, {
      autoFocus: false,
      disableClose: false,
      width: '800px'
    });
    this.dialogRef.componentInstance.id = 0;
    this.dialogRef.componentInstance.warehouseId = this.id;
    this.dialogRef.componentInstance.data = new LocationModel(data);
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDataChanged.next(result);
      }
      this.dialogRef = null;
    });
  }

  edit(id) {
    this.locationMap.selectSeat(id, true);
    this.dialogRef = this._dialog.open(LocationDialogComponent, {
      autoFocus: false,
      disableClose: false,
      width: '800px'
    });
    this.dialogRef.componentInstance.id = id;
    this.dialogRef.componentInstance.warehouseId = this.id;
    this.dialogRef.componentInstance.printQrCode = this.printQrCode;
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDataChanged.next(result);
      }
      this.dialogRef = null;
    });
  }

  delete(id) {
    this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._warehouseService.deleteLocation(id).subscribe((resp) => {
          this._toastrService.success('Success');
          this.onDataChanged.next(resp);
        });
      }
      this.confirmDialogRef = null;
    });
  }

  goBack() {
    const areaId = this.warehouseData && this.warehouseData.areaId;
    if (areaId) {
      this._router.navigate(['pages', 'warehouse', 'list', areaId]);
    } else {
      this._router.navigate(['pages', 'warehouse', 'overview']);
    }
  }

  async print(data) {
    this.printCodeData = [data];
    if (this.printQrCode) {
      await this.printQrCode.print(this.printCodeData, this.barcodeWidth, TypeBarcode.Location);
    }
    // QRCode.toDataURL(data.id + '').then((url) => {
    //   printJS({ printable: url, type: 'image' });
    // }).catch((err) => {
    //   console.error(err);
    // });
  }

  async printAll() {
    this.printCodeData = this.dataSource.data;
    if (this.printQrCode) {
      await this.printQrCode.print(this.printCodeData, this.barcodeWidth, TypeBarcode.Location);
    }
  }
}
