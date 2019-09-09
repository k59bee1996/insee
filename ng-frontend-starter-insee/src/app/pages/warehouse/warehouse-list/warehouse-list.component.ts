import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { GenericListComponent, ListOptions } from '@modules/generic-list/generic-list.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from '@pages/warehouse/warehouse.service';
import { WarehouseDialogComponent } from '@pages/warehouse/warehouse-dialog/warehouse-dialog.component';
import { WarehouseModel } from '@pages/warehouse/warehouse.model';
import { MarkerType, OrderItem } from '@common/models/CommonConstant';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LocationMapComponent } from "@pages/warehouse/location-map/location-map.component";
import { AuthService } from '@services/auth';

@Component({
  selector: 'warehouse-list',
  templateUrl: 'warehouse-list.component.html',
  styleUrls: ['warehouse-list.component.scss', '../warehouse.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class WarehouseListComponent implements OnInit, OnDestroy, AfterViewInit {
  public isAdmin: boolean = false;
  public areaId: number = 0;
  public dialogRef: any;
  public confirmDialogRef: any;
  public listOptions: ListOptions;
  public warehouseData: any = new WarehouseModel();
  public layoutData: any = new WarehouseModel();
  public MarkerType = MarkerType;
  public dataSubscription: Subscription;
  public showColumnLayout = true;
  @ViewChild('genericList') genericList: GenericListComponent;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('locationMap') locationMap: LocationMapComponent;

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
      this.areaId = +params.get('id');
      if (this.areaId) {
        // this._warehouseService.getArea(this.areaId).subscribe((resp) => {
          this.warehouseData.id = this.areaId;
          this.warehouseData.name = 'GI-GO';
          this.warehouseData.width = 1000;
          this.warehouseData.height = 500;
          this.warehouseData.imageUrl = "assets/images/factory-thiv1.png";
          this.warehouseData.MarkerType=MarkerType.Warehouse;
          this.warehouseData.locations = [
            {
              "id": 1,
              "name": "CI-CO",
              "column":true,
              "xAxis": 877  ,
              "yAxis": 311,
              // "points": "[[680 ,-1582],[750   ,-1537  ],[750 ,-1446],[876  ,-1349],[876,-1305],[967  ,-1245],[967,-1150],[1009  ,-1150],[1149  ,-1239],[1149,-1318],[1244 ,-1381],[1244 ,-1543],[1273   ,-1568],[962   ,-1754]]",
            },
            {
              "id": 2,
              "name": "WI-WO",
              "column":true,
              "xAxis": 759   ,
              "yAxis": 269,
              // "points": "[[680 ,-1582],[750   ,-1537  ],[750 ,-1446],[876  ,-1349],[876,-1305],[967  ,-1245],[967,-1150],[1009  ,-1150],[1149  ,-1239],[1149,-1318],[1244 ,-1381],[1244 ,-1543],[1273   ,-1568],[962   ,-1754]]",
            },
            {
              "id": 3,
              "name": "Loading",
              "xAxis": 500  ,
              "yAxis": 159,
              // "points": "[[680 ,-1582],[750   ,-1537  ],[750 ,-1446],[876  ,-1349],[876,-1305],[967  ,-1245],[967,-1150],[1009  ,-1150],[1149  ,-1239],[1149,-1318],[1244 ,-1381],[1244 ,-1543],[1273   ,-1568],[962   ,-1754]]",
            },
            {
              "id": 4,
              "name": "Loadding",
              "xAxis": 500   ,
              "yAxis": 253,
              // "points": "[[680 ,-1582],[750   ,-1537  ],[750 ,-1446],[876  ,-1349],[876,-1305],[967  ,-1245],[967,-1150],[1009  ,-1150],[1149  ,-1239],[1149,-1318],[1244 ,-1381],[1244 ,-1543],[1273   ,-1568],[962   ,-1754]]",
            },
            {
              "id": 5,
              "name": "Waterway",
              "xAxis": 255    ,
              "yAxis": 213,
              // "points": "[[680 ,-1582],[750   ,-1537  ],[750 ,-1446],[876  ,-1349],[876,-1305],[967  ,-1245],[967,-1150],[1009  ,-1150],[1149  ,-1239],[1149,-1318],[1244 ,-1381],[1244 ,-1543],[1273   ,-1568],[962   ,-1754]]",
            },
            {
              "id": 6,
              "name": "Loadding-Waterway",
              "xAxis": 200    ,
              "yAxis": 218,
              // "points": "[[680 ,-1582],[750   ,-1537  ],[750 ,-1446],[876  ,-1349],[876,-1305],[967  ,-1245],[967,-1150],[1009  ,-1150],[1149  ,-1239],[1149,-1318],[1244 ,-1381],[1244 ,-1543],[1273   ,-1568],[962   ,-1754]]",
            },
            {
              "id": 7,
              "name": "Loadding-Waterway",
              "xAxis": 200    ,
              "yAxis": 240,
              // "points": "[[680 ,-1582],[750   ,-1537  ],[750 ,-1446],[876  ,-1349],[876,-1305],[967  ,-1245],[967,-1150],[1009  ,-1150],[1149  ,-1239],[1149,-1318],[1244 ,-1381],[1244 ,-1543],[1273   ,-1568],[962   ,-1754]]",
            },
          ];

          this.layoutData.id = this.areaId;
          this.layoutData.name = 'STOCK';
          this.layoutData.width = 1000;
          this.layoutData.height = 500;
          this.layoutData.imageUrl = "assets/images/factory-thiv2.png";

          this.layoutData.locations=[
            {
              "id": 1,
              "name": "Gympsom Silo",
              "xAxis": 850 ,
              "yAxis": 303,
              "points": "[[870  ,-368],[870   ,-325  ],[830  ,-325],[830  ,-368]]",
            },{
              "id": 2,
              "name": "Clinker Silo",
              "xAxis": 850    ,
              "yAxis": 402,
              "points": "[[873  ,-466],[873   ,-459  ],[826  ,-459],[826  ,-466]]",
            },
            {
              "id": 3,
              "name": "788",
              "xAxis": 744    ,
              "yAxis": 424,
              "points": "[[765  ,-467],[765   ,-458  ],[725  ,-458],[725  ,-467]]",
            },
            {
              "id": 4,
              "name": "788",
              "xAxis": 647    ,
              "yAxis": 426,
              "points": "[[667  ,-469],[667   ,-458  ],[627  ,-458],[627   ,-469]]",
            },
            {
              "id": 5,
              "name": "Limestone",
              "xAxis": 647    ,
              "yAxis": 360,
              "points": "[[667  ,-403],[667   ,-388  ],[627  ,-388],[627  ,-403]]",
            },
            {
              "id": 6,
              "name": "IPS Silo",
              "xAxis": 397    ,
              "yAxis": 174,
              "points": "[[421  ,-224],[421   ,-221  ],[373  ,-221],[373  ,-224]]",
            },
            {
              "id": 7,
              "name": "ISC Silo",
              "xAxis": 401    ,
              "yAxis": 80,
              "points": "[[425  ,-130],[425   ,-126  ],[377  ,-126],[377  ,-130]]",
            },
          ]
        // }, (err) => {
        //   this.goBack();
        // });

        // if (areaId === 1) {
        //   this.warehouseData = new WarehouseModel({
        //     height: 685,
        //     width: 1027,
        //     imageUrl: 'assets/images/floor1.jpg',
        //     locations: [
        //       {
        //         colorCode: '#63b9ff',
        //         id: 1,
        //         name: `warehouse 1`,
        //         xAxis: 200,
        //         yAxis: 200,
        //       },
        //     ],
        //     name: `1<sup>st</sup> Floor - Tầng 1`,
        //   });
        // } else if (areaId === 2) {
        //   this.warehouseData = new WarehouseModel({
        //     height: 830,
        //     width: 1245,
        //     imageUrl: 'assets/images/floor2.jpg',
        //     locations: [
        //       // {
        //       //   colorCode: '#63b9ff',
        //       //   id: 2,
        //       //   name: `2<sup>nd</sup> Floor - Tầng 2`,
        //       //   xAxis: 3750,
        //       //   yAxis: 2100,
        //       // }
        //     ],
        //     name: `2<sup>nd</sup> Floor - Tầng 2`,
        //   });
        // }
      } else {
        this.goBack();
      }
    });
    // this.listOptions = {
    //   getListUrl: '/warehouses',
    //   listName: 'warehouses',
    //   hideHistory: true,
    //   hideEdit: true,
    //   hideDelete: true,
    //   pagination: false,
    //   rowClickable: true,
    //   filterData: { areaId: this.areaId },
    //   columns: [
    //     {
    //       name: 'name',
    //       title: 'WAREHOUSE.NAME',
    //       ordering: true,
    //     },
    //     // {
    //     //   name: 'warehouseStatusId',
    //     //   title: 'WAREHOUSE.STATUS',
    //     //   ordering: true,
    //     // },
    //     {
    //       name: 'imageUrl',
    //       title: 'WAREHOUSE.IMAGE',
    //       type: 'image_sm'
    //     },
    //   ]
    // };
    // const searchEvent = Observable.fromEvent(this.filter.nativeElement, 'keyup')
    //   .debounceTime(500)
    //   .distinctUntilChanged();
    // this.dataSubscription = searchEvent.subscribe((e: any) => {
    //   this.listOptions.filterData.product = e.target.value;
    //   this.genericList.forceDataChange.next(true);
    // });
    // this._activatedRoute.queryParamMap.subscribe((params) => {
    //   this.filter.nativeElement.value = params.get('product');
    //   this.listOptions.filterData.product = params.get('product');
    // });
  }

  ngAfterViewInit() {
    // this.genericList.onDataChanged.subscribe((resp) => {
    //   this.warehouseData.locations = resp || [];
    // });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  add(data?) {
    // this.dialogRef = this._dialog.open(WarehouseDialogComponent, {
    //   autoFocus: false,
    //   disableClose: false,
    //   width: '800px'
    // });
    // this.dialogRef.componentInstance.areaId = this.areaId;
    // if (data) {
    //   this.dialogRef.componentInstance.data = new WarehouseModel(data);
    // }
    // this.dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.genericList.forceDataChange.next(true);
    //   }
    //   this.dialogRef = null;
    // });
  }

  edit(id) {
    // this.dialogRef = this._dialog.open(WarehouseDialogComponent, {
    //   autoFocus: false,
    //   disableClose: false,
    //   width: '800px'
    // });
    // this.dialogRef.componentInstance.id = id;
    // this.dialogRef.componentInstance.isAdmin = this.isAdmin;
    // this.dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.genericList.forceDataChange.next(false);
    //   }
    //   this.dialogRef = null;
    // });
  }

  delete(id) {
    // this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
    //   disableClose: false
    // });
    // this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    // this.confirmDialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this._warehouseService.delete(id).subscribe((resp) => {
    //       this._toastrService.success('Success');
    //       this.genericList.forceDataChange.next(true);
    //     });
    //   }
    //   this.confirmDialogRef = null;
    // });
  }

  rowClick(id) {
    // this._router.navigate(
    //   ['pages', 'warehouse', 'manage', id],
    //   { queryParams: { product: this.filter.nativeElement.value } }
    // );
  }

  goBack() {
    this._router.navigate(['pages', 'warehouse', 'overview']);
  }
}
