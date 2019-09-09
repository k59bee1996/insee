import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { WarehouseService } from '@pages/warehouse/warehouse.service';
import { WarehouseModel } from '@pages/warehouse/warehouse.model';
import { AppConstant } from '@common/services';
import { MarkerType } from '@common/models/CommonConstant';


@Component({
  selector: 'factory-map',
  templateUrl: 'factory-map.component.html',
  styleUrls: ['factory-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FactoryMapComponent implements OnInit {
  public warehouseData = {
    height: 4724,
    width: 7086,
    imageUrl: 'assets/images/factory-map.png',
    locations: [],
    name: 'Plant Layout',
  };
  public domain: string = AppConstant.domain + '/';
  public MarkerType = MarkerType;
  public groups = [
        { iconUrl: '/assets/images/leaflet/marker-product.png', colorCode: '#b28d5d', name: 'No.Shipments', value: '60' },
        { iconUrl: '/assets/images/leaflet/marker-product-empty.png', colorCode: 'grey', name: 'RM Transfer (tons)', value: '372,750' },
        { iconUrl: '/assets/images/leaflet/marker-product-empty.png', colorCode: 'grey', name: 'Cement sold (tons)', value: '798,888'},
      ];

  constructor(private _warehouseService: WarehouseService,
    private _router: Router) {
  }

  ngOnInit() {
    this.warehouseData.locations = [
      {
        "id": 1,
        "name": "Hon chong",
        // "width": 1027.0,
        // "height": 685.0,
        "xAxis": 980.0,
        "yAxis": 1148.0,
        "imageUrl": "assets/images/factory-thiv1.png",
        "points": "[[680 ,-1582],[750   ,-1537  ],[750 ,-1446],[876  ,-1349],[876,-1305],[967  ,-1245],[967,-1150],[1009  ,-1150],[1149  ,-1239],[1149,-1318],[1244 ,-1381],[1244 ,-1543],[1273   ,-1568],[962   ,-1754]]",
        "acreage": null,
        data: {
          cement: [
            {name: 'IPS', color: 'yellow', value: 20},
            {name: 'IWP', color: 'yellow', value: 15},
          ],
          material: [
            {name: 'Pozolana', color: 'red', value: 24},
            {name: 'Gypsum', color: 'green', value: 18},
            {name: 'Limestone', color: 'blue', value: 10},
            {name: 'clinker', color: 'aqua', value: 15},
          ]
        }
      },
      {
        "id": 2,
        "name": "CATL",
        // "width": 1245.0,
        // "height": 830.0,
        "xAxis": 5315.0,
        "yAxis": 199.0,
        "imageUrl": "assets/images/floor2.jpg",
        "points": "[[5103 ,-480],[5150 ,-447],[5150,-390],[5230 ,-320],[5230,-293],[5295 ,-245],[5295,-190],[5338 ,-190],[5426 ,-241],[5426,-305],[5488 ,-346],[5488,-456],[5510 ,-469],[5300 ,-599]]",
        "acreage": "",
        data: {
          cement: [
            {name: 'IBF', color: 'yellow', value: 20},
            {name: 'IPS', color: 'yellow', value: 15},
            {name: 'IAIP', color: 'yellow', value: 15},
            {name: 'IEF', color: 'yellow', value: 1},
          ],
          material: [
            {name: 'Pozolana', color: 'red', value: 24},
            {name: 'Gypsum', color: 'green', value: 18},
            {name: 'Limestone', color: 'blue', value: 10},
            {name: 'clinker', color: 'aqua', value: 15},
          ]
        }
      },
      {
        "id": 3,
        "name": "NHOT",
        // "width": 1027.0,
        // "height": 685.0,
        "xAxis": 5695.0,
        "yAxis": 554.0,
        "imageUrl": "assets/images/floor1.jpg",
        "points": "[[5509  ,-841],[5549  ,-813  ],[5549,-755],[5630 ,-696],[5630,-659],[5687 ,-626],[5687,-561],[5715 ,-561],[5807 ,-624],[5807,-669],[5868  ,-709],[5872 ,-816],[5891  ,-829],[5686  ,-951]]",
        "acreage": null,
        data: {
          cement: [
            {name: 'IVL', color: 'yellow', value: 20},
            {name: 'IPC', color: 'yellow', value: 15},
          ],
          material: [
            {name: 'Pozolana', color: 'pink', value: 24},
            {name: 'Gypsum', color: 'green', value: 18},
            {name: 'Limestone', color: 'blue', value: 10},
            {name: 'clinker', color: 'RED', value: 15},
          ]
        }
      },
      {
        "id": 4,
        "name": "THIV",
        // "width": 1027.0,
        // "height": 685.0,
        "xAxis": 5658.0,
        "yAxis": 1018.0,
        "imageUrl": "assets/images/floor1.jpg",
        "points": "[[5482   ,-1282],[5516   ,-1258  ],[5516,-1202],[5592 ,-1143],[5592,-1121],[5645  ,-1082],[5645,-1022],[5681  ,-1022],[5759  ,-1078],[5759,-1126],[5817 ,-1163],[5817 ,-1258],[5836   ,-1276],[5649   ,-1393]]",
        "acreage": null,
        data: {
          cement: [
            
            {name: 'IMP', color: 'yellow', value: 1},
            {name: 'IPC', color: 'yellow', value: 5},
            {name: 'IPS', color: 'yellow', value: 20},
            {name: 'IEF', color: 'yellow', value: 15},
          ],
          material: [
            {name: 'Pozolana', color: 'aqua', value: 24},
            {name: 'Gypsum', color: 'green', value: 18},
            {name: 'Limestone', color: 'blue', value: 10},
            {name: 'clinker', color: 'red', value: 15},
          ]
        }
      },
      {
        "id": 5,
        "name": "HIEP",
        // "width": 1027.0,
        // "height": 685.0,
        "xAxis": 5139.0,
        "yAxis": 771.0,
        "imageUrl": "assets/images/floor1.jpg",
        "points": "[[4935 ,-1055],[4982 ,-1024],[4982,-962],[5063 ,-906],[5063,-877],[5118 ,-843],[5118,-777],[5154 ,-777],[5237 ,-839],[5237,-892],[5312 ,-929],[5312,-1029],[5323 ,-1044],[5125 ,-1167]]",
        "acreage": null,
        data: {
          cement: [
            {name: 'IPS', color: 'yellow', value: 20},
            {name: 'IEF', color: 'yellow', value: 15},
          ],
          material: [
            {name: 'Pozolana', color: 'aqua', value: 24},
            {name: 'Gypsum', color: 'green', value: 18},
            {name: 'Limestone', color: 'blue', value: 10},
            {name: 'clinker', color: 'red', value: 15},
          ]
        }
      },
      {
        "id": 6,
        "name": "Limestone",
        "customIcon":true,
        // "width": 1027.0,
        // "height": 685.0,
        "xAxis": 5482.0,
        "yAxis": 1978.0,
        //"imageUrl": "assets/images/icon-ship.jpg",
        // "points": "[[4935 ,-1055],[4982 ,-1024],[4982,-962],[5063 ,-906],[5063,-877],[5118 ,-843],[5118,-777],[5154 ,-777],[5237 ,-839],[5237,-892],[5312 ,-929],[5312,-1029],[5323 ,-1044],[5125 ,-1167]]",
        "acreage": null
      },
    ];
    // this._warehouseService.getAreas().subscribe((resp) => {
    // this.warehouseData.locations = resp && resp.areaList || [];
    // this.warehouseData.locations.forEach((area) => {
    //   if (area.id === 1) {
    //     area.points = '[[3177,-1888],[4068,-2232],[5040,-1718],[5032,-1924],[4145,-2465],[3772,-2285],[3775,-2200],[3180,-1962]]';
    //   } else if (area.id === 2) {
    //     area.points = '[[3171,-1657],[4099,-1259],[5009,-1525],[4992,-1535],[5050,-1554],[5040,-1718],[4068,-2232],[3177,-1888]]';
    //   }
    // })
    // });
  }

  locationClick(id) {
    // const area  = this.warehouseData.locations.find((location)=> location.id === id);
    this._router.navigate(['pages', 'warehouse', 'list', id]);
  }

}
