import {
  Component,
  ViewEncapsulation,
  Input,
  AfterViewInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-contextmenu';
import 'leaflet-responsive-popup';
import { svgMarker } from './svg-marker';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';


import { ILocation, IPoint } from './location-map.model';
import { SvgMarkerOptions } from './svg-icon.model';
import { CustomMap, CustomMarker } from './map.model';
import { WarehouseService } from '@pages/warehouse/warehouse.service';
import { formatDate } from '@angular/common';
import { MarkerType } from '@common/models/CommonConstant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'location-map',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'location-map.template.html',
  styleUrls: ['location-map.style.scss']
})

export class LocationMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() public imageUrl: string = '';
  @Input() public floorId: string = '';
  @Input() public floorName: string = '';
  @Input() public seats: ILocation[] = [];
  @Input() public floorWidth: number;
  @Input() public floorHeight: number;
  @Input() public info: any = {};
  @Input() public editable: boolean = false;
  @Input() public moveable: boolean = false;
  @Input() public isLoadData: boolean = false;
  @Input() public markerType: number = MarkerType.Normal;
  @Input() public zoomLevel: number = 4;
  @Input() public popupOffset: number[] = [15, 15];
  @Input() public groups = []; // display on legend if need

  @Output() public onSeatClicked = new EventEmitter<number>();
  @Output() public onAddNewSeat = new EventEmitter<IPoint>();

  public editableLayer;
  public map;
  public overlay;
  public geoJsonLayer;
  public lat;
  public lng;
  public mapName: string;
  public highLighted: CustomMarker;
  public legend: L.Control;
  private defaultSeatColor: string = '#63b9ff';
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _toast: ToastrService,
    private _translateService: TranslateService,
    private _warehouseService: WarehouseService) {
    this.mapName = 'seat-map' + Date.now();
  }

  public ngAfterViewInit(): void {
    // Set time out for bind map name to view
    setTimeout(() => {
      this.initMap();
      this.initSeats();
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'seats' && this.seats && this.map) {
        this.reloadSeats();
      }
    }
  }

  public updateLegendTable(myMap) {
    if (this.legend) {
      this.legend.remove();
    }
    if (this.groups.length) {
      this.legend = new L.Control({ position: 'topright' });
      this.legend.onAdd = (map) => {
        const divContainer = L.DomUtil.create('div', 'legend');
        const div = L.DomUtil.create('div', 'info');
        // if (this.info.acreage) {
        //   div.innerHTML += '<div class="legend-container">' +
        //     `<img src="/assets/images/leaflet/acreage-icon.png" width='22'>` +
        //     `<strong>${this._translateService.instant('COMMON.ACREAGE')}: </strong>` +
        //     `<span>&nbsp;${this.info.acreage}m<sup>2</sup></span>` +
        //     '</div>';
        // }
        // if (this.info.temperature || this.info.temperature === 0) {
        //   div.innerHTML += '<div class="legend-container">' +
        //     `<img src="/assets/images/leaflet/temperature-icon.png" width='22'>` +
        //     `<strong>${this._translateService.instant('COMMON.TEMPERATURE')}: </strong>` +
        //     `<span>&nbsp;${this.info.temperature}℃</span>` +
        //     '</div>';
        // }
        // if (this.info.humidity || this.info.humidity === 0) {
        //   div.innerHTML += '<div class="legend-container">' +
        //     `<img src="/assets/images/leaflet/humidity-icon.png" width='22'>` +
        //     `<strong>${this._translateService.instant('COMMON.HUMIDITY')}: </strong>` +
        //     `<span>&nbsp;${this.info.humidity}%</span>` +
        //     '</div>';
        // }
        // if (this.info.capacity || this.info.capacity === 0) {
        //   div.innerHTML += '<div class="legend-container">' +
        //     `<img src="/assets/images/leaflet/capacity-icon.png" width='22'>` +
        //     `<strong>${this._translateService.instant('COMMON.CAPACITY')}: </strong>` +
        //     `<span>&nbsp;${this.info.capacity}%</span>` +
        //     '</div>';
        // }



        let row = '';
        for (let i = 0; i < this.groups.length; i++) {
          row += `<tr><td style="background:	#42D3C8;width:65%">${this.groups[i].name}</td><td style="background:white;text-align:center;width:35%">${this.groups[i].value}</td></tr>`;
        }
        div.innerHTML = `<table>${row}</table>`;
        divContainer.appendChild(div);

        // div button to expand and collapse legend
        const divButton = L.DomUtil.create('button', 'collapseButton collapse');
        divButton.innerHTML = `<mat-icon class="mat-icon material-icons">keyboard_arrow_up</mat-icon>`;
        divButton.addEventListener('click', () => {
          if (div.style.display === 'none') {
            div.style.display = 'block';
            divButton.innerHTML = `<mat-icon class="mat-icon material-icons">keyboard_arrow_up</mat-icon>`;
            divButton.className = 'collapseButton collapse';
          } else {
            div.style.display = 'none';
            divButton.innerHTML = `<mat-icon class="mat-icon material-icons">keyboard_arrow_down</mat-icon>`;
            divButton.className = 'collapseButton expand';
          }
        });
        divContainer.appendChild(divButton);

        return divContainer;
      };
      this.legend.addTo(myMap);
    }
  }

  public initTest(map) {
    L.Control.Watermark = L.Control.extend({
      onAdd: function (map) {
        var img = L.DomUtil.create('img');

        img.src = 'https://leafletjs.com/docs/images/logo.png';
        img.style.width = '200px';

        return img;
      },

      onRemove: function (map) {
        // Nothing to do here
      }
    });

    L.control.watermark = function (opts) {
      return new L.Control.Watermark(opts);
    }

    L.control.watermark({ position: 'topright' }).addTo(map);
  }


  public initMap() {
    let self = this;
    this.map = new CustomMap(this.mapName, {
      // set map center to center of floor image
      center: L.latLng(-this.floorHeight / 2, this.floorWidth / 2),
      crs: L.CRS.Simple,
      maxZoom: 6 + this.zoomLevel,
      minZoom: -10,
      attributionControl: false,
      contextmenu: this.editable,
      contextmenuItems: [{
        text: this._translateService.instant('COMMON.ADDNEW'),
        index: 0,
        callback: (e) => {
          this.addNewSeat(e.latlng);
        }
      }],
      zoomSnap: 0
    });

    // bound by width and height of floor
    const bounds = L.latLngBounds(L.latLng(-this.floorHeight, 0), L.latLng(0, this.floorWidth));
    this.overlay = L.imageOverlay(this.imageUrl, bounds).addTo(this.map);
    this.geoJsonLayer = L.geoJSON([], {
      style: {
        weight: 2,
        opacity: 1,
        color: '#3388ff',
        dashArray: '3',
        fillOpacity: 0.2
      },
      onEachFeature: this.onEachFeature.bind(this)
    }).addTo(this.map);
    this.map.fitBounds(bounds);
    this.map.setMaxBounds(bounds);
    // this.map.on('drag', () => {
    //   this.map.panInsideBounds(bounds, {animate: false});
    // });

    const currentZoom = this.map.getZoom();
    this.map.setMaxZoom(currentZoom + this.zoomLevel);
    this.map.setMinZoom(currentZoom);

    // draw control options
    const options: L.Control.DrawConstructorOptions = {
      position: 'topleft',
      draw: {
        polyline: null,
        polygon: null,
        circle: null, // Turns off this drawing tool
        circlemarker: null,
        rectangle: null,
        marker: null
      },
      edit: null
    };
    const drawControl = new L.Control.Draw(options);
    this.map.addControl(drawControl);
    // this.map.off('zoomend');

    this.createEditableLayer();
    this.map.keyboard.disable(); // disable window auto scroll to map
    //for debug
    this.map.addEventListener('mousemove', function (ev) {
      self.lat = Math.round(ev.latlng.lat);
      self.lng = Math.round(ev.latlng.lng);
    });

    this.map.addEventListener('click', function (e) {
      console.log(Math.round(e.latlng.lng) + " | " + Math.round(e.latlng.lat))
    })


    // if (this.markerType === MarkerType.Product) {
    //   this.groups = [
    //     { iconUrl: '/assets/images/leaflet/marker-product.png', colorCode: '#b28d5d', name: 'Sản phẩm (NVL)' },
    //     { iconUrl: '/assets/images/leaflet/marker-product-empty.png', colorCode: 'grey', name: 'Vị trí trống' },
    //   ];
    // }
    this.updateLegendTable(this.map);

    //this.initTest(this.map);

    // (L as any).easyButton('<i class="material-icons custom-icon-button">get_app</i>', (btn, map) => {
    //   const url = `${AppConstant.domain}/m-api/Files/exportfile/${this.floorId}`;
    // }).addTo(this.map);
  }

  public resize() {
    setTimeout(() => {
      this.map.invalidateSize();
    });
  }

  /**
   * create editable layer to draw
   */
  public createEditableLayer() {
    this.editableLayer = new L.FeatureGroup([]);
    this.map.addLayer(this.editableLayer);
  }

  public initSeats() {
    let geojsonFeatures = [];
    this.seats.forEach((seat: ILocation) => {
      if (typeof seat.xAxis === 'number' && typeof seat.yAxis === 'number') {
        const point = L.latLng(-seat.yAxis, seat.xAxis);
        debugger;
        this.createMarker(point, seat);
        if (seat.points) {
          try {
            const coordinates = JSON.parse(seat.points);
            if (Array.isArray(coordinates)) {
              geojsonFeatures.push({
                'type': 'Feature',
                'properties': seat,
                'geometry': {
                  'type': 'Polygon',
                  'coordinates': [coordinates]
                }
              });
            }
          } catch (e) {
            console.log('Create geoJson: ', e);
          }
        }
      }
    });
    if (this.geoJsonLayer && geojsonFeatures.length) {
      this.geoJsonLayer.addData(geojsonFeatures);
    }
  }

  /***
   * Create seat on map by cordinate
   * @param position
   * @param data
   */
  public createMarker(position: L.LatLng, data: ILocation) {
    let color = data.colorCode || this.defaultSeatColor;
    let options: SvgMarkerOptions = {};
    debugger
    if (!data.customIcon) {
      options = {
        iconOptions: {
          color: '#01579b',
          fillColor: color,
          iconSize: L.point(20, 30),
          iconAnchor: L.point(10, 30)
        },
        draggable: this.moveable
      };
    }
    else {
      options.iconOptions = null;
    }


    if (this.markerType === MarkerType.Warehouse) {
      options.icon = L.icon({
        iconUrl: '/assets/images/leaflet/marker-warehouse.png',
        shadowUrl: '/assets/images/leaflet/marker-shadow.png',
        iconSize: [41, 41], // size of the icon
        shadowSize: [40, 40], // size of the shadow
        // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [12, 19],  // the same for the shadow
        // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
    } else if (this.markerType === MarkerType.Area) {
      if (!options.iconOptions) {
        options.icon = L.icon({
          iconUrl: '/assets/images/leaflet/marker-ship.jpg',
          shadowUrl: '/assets/images/leaflet/marker-ship.jpg',

          iconSize: [38, 95], // size of the icon
          shadowSize: [50, 64], // size of the shadow
          iconAnchor: L.point(10, 30), // point of the icon which will correspond to marker's location

        });
        options.draggable = false;
      }
      else {
        options.icon = L.icon({
          iconUrl: '/assets/images/leaflet/marker-area.png',
          shadowUrl: '/assets/images/leaflet/marker-shadow.png',
          iconSize: [41, 41], // size of the icon
          shadowSize: [40, 40], // size of the shadow
          shadowAnchor: [12, 19],  // the same for the shadow
        });
      }
    } else if (this.markerType === MarkerType.Product) {
      if (!data.itemQuantity) {
        options.icon = L.icon({
          iconUrl: '/assets/images/leaflet/marker-product-empty.png',
          iconSize: [24, 22], // size of the icon
        });
      } else {
        options.icon = L.icon({
          iconUrl: '/assets/images/leaflet/marker-product.png',
          iconSize: [24, 22], // size of the icon
        });
      }
    } else if (this.markerType === MarkerType.None) {
      options.icon = null;
    }


    const marker = svgMarker(position, options);

    marker.seatId = data.id;
    this.editableLayer.addLayer(marker);

    // marker.setBouncingOptions({
    //   bounceHeight: 20,    // height of the bouncing
    //   bounceSpeed: 60,    // bouncing speed coefficient
    //   exclusive: true,  // if this marker bouncing all others must stop,
    //   elastic: false,
    // });

    this.listenMarkerMove(marker);

    this.bindPopupMarker(marker, data);

    this.bindTooltipMarker(marker, data);

    this.listerMarkerClick(marker);
  }

  public highlightFeature(e) {
    let layer = e.target;
    layer.setStyle({
      weight: 3,
      // color: '#01579b',
      dashArray: '',
      fillOpacity: 0.4
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }
  public resetHighlightFeature(e) {
    if (this.geoJsonLayer) {
      this.geoJsonLayer.resetStyle(e.target);
    }
  }

  public zoomToFeature(e) {
    // this.map.fitBounds(e.target.getBounds());
    const id = e.target.feature && e.target.feature.properties && e.target.feature.properties.id;
    if (id) {
      this.selectSeat(id, false);
      this.onSeatClicked.emit(id);
    }
  }

  public onEachFeature(feature, layer) {
    this.bindPopupMarker(layer, feature.properties);
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlightFeature.bind(this),
      click: this.zoomToFeature.bind(this)
    });
  }

  public highlightSeat(data: ILocation) {
    const seat = this.getSeat(data.id);
    if (seat) {
      this.map.panTo(seat._latlng);
      // seat.hightLight();
      // seat.bounce(3);
      this.setMarkerHighLight(seat);
    } else {
      data.xAxis = 0;
      data.yAxis = 0;
      this.createSeat(data);
      this.highlightSeat(data);
    }
  }

  /**
   * bouncing making infinity
   * @param id
   */
  public selectSeat(id: number, panTo?: boolean) {
    const seat = this.getSeat(id);
    if (seat) {
      if (panTo) {
        this.map.panTo(seat._latlng);
      }
      this.setMarkerHighLight(seat);
    }
  }

  public listenMarkerMove(marker: L.Marker) {
    marker.on('moveend', (ev) => {
      const seat = ev.target;
      const model = {
        id: seat.seatId,
        xAxis: seat._latlng.lng,
        yAxis: -seat._latlng.lat
      };
      this.updateSeatPosition(model);
      seat.setLatLng(seat._latlng); // update new latlng to make bounce work
    });
  }

  public bindTooltipMarker(marker: L.marker, data: ILocation) {
    let cementValue = '';
    let materialValue = '';
    let contentTooltip1 = '';
    if (data.data) {
      data.data.cement.forEach((v)=>{
        cementValue += `<div style='display: inline-flex; align-items: center'>
        <div style='width: 22px'>${v.name}</div><div style='height: 10px; width: ${v.value}px; background-color: ${v.color}'></div></div>`;
      })
      data.data.material.forEach((v)=>{
        materialValue += `<div style='display: inline-flex; align-items: center'>
        <div style='width: 53px'>${v.name}</div><div style='height: 10px; width: ${v.value}px; background-color: ${v.color}'></div></div>`;
      })
      // <tr><th>Cement</th><th>Material</th></tr>
      contentTooltip1 = `<table>
        <tr><td>${cementValue}</td><td>${materialValue}</td></tr>
      </table>`;
    }
  
    // let contentTooltip1=``;
    let direction  = 'right';
    let offset=L.point(40,20);
    if (data.name === 'CATL' || data.name === 'HIEP')  {
      direction = 'left';
      offset=L.point(-40,20);
    }
    const optionsTooltip1 =
    {
      offset: offset,
      permanent: true,
      direction: direction, 
      sticky: true,
    }

    if (contentTooltip1) {
      marker.bindTooltip(contentTooltip1,optionsTooltip1).openTooltip();
    }
    
  }

  public bindPopupMarker(marker: L.Marker, data: ILocation) {
    const labelName = this.markerType === MarkerType.Product ? this._translateService.instant('COMMON.LOCATION') + ': ' : '';
    //   // debugger;
    //   let coloumnContent = `<table>
    //   <tr>
    //     <th>${data.name.split('-')[0]}</th>
    //     <th>${data.name.split('-')[1]}</th> 
    //   </tr>
    //   <tr>
    //     <td>1234</td>
    //     <td>Smith</td> 
    //   </tr>
    // </table>`

    //let content = `<div class='map-location-name'>${labelName}${data.column ? coloumnContent : `<strong>${data.name}</strong>`}</div>`;
    let content = `<div class='map-location-name'>${labelName}<strong>${data.name}</strong></div>`;

    if (data.acreage) {
      content += `<div class="mt-5 text-nowrap">${this._translateService.instant('COMMON.ACREAGE')}: <strong>${data.acreage}m<sup>2</sup></strong></div>`;
    }
    if (data.temperature || data.temperature === 0) {
      content += `<div class="mt-5 text-nowrap">${this._translateService.instant('COMMON.TEMPERATURE')}: <strong>${data.temperature}℃</strong></div>`;
    }
    if (data.humidity || data.humidity === 0) {
      content += `<div class="mt-5 text-nowrap">${this._translateService.instant('COMMON.HUMIDITY')}: <strong>${data.humidity}%</strong></div>`;
    }
    if (data.capacity || data.capacity === 0) {
      content += `<div class="mt-5 text-nowrap">${this._translateService.instant('COMMON.CAPACITY')}: <strong>${data.capacity}%</strong></div>`;
    }
    if (data.customIcon) {
      content += `<div class="mt-5 text-nowrap">Nguồn: <strong>Hòn chong</strong> -> Đích: <strong>Thị Vãi</strong> </div>`;
      content += `<div class="mt-5 text-nowrap">Khối lượng: <strong>50.000kg</strong></div>`;
      content += `<div class="mt-5 text-nowrap">Ngày đi: <strong>03/09/2019</strong> -> Ngày đến: <strong>10/09/2019</strong> </div>`;
      content += `<div class="mt-5 text-nowrap">Số xà lang: <strong>123</strong></div>`;
    }
    // if (data.locationStatus) {
    //   content += `<div class="mt-5">Status: <strong>${data.locationStatus}</strong></div>`;
    // }
    // if (data.locationType) {
    //   content += `<div class="mt-5">Location Type: <strong>${data.locationType}</strong></div>`;
    // }
    const popup = (L as any).responsivePopup({
      closeButton: false,
      autoPan: false,
      offset: this.popupOffset,
      hasTip: false
    }).setContent(content);
    marker.bindPopup(popup);
    marker.on('mouseover', (e) => {
      if (!marker.isLoadProduct && this.isLoadData && data.itemQuantity > 0) {
        marker.isLoadProduct = true;
        this._warehouseService.getProductsByLocationId(marker.seatId).subscribe((resp) => {
          const barcodeList = resp && resp.barcodeItems || [];
          if (barcodeList.length) {
            let row = '';
            barcodeList.forEach((p) => {
              row += `<tr><td>${p.productCode}</td><td>${p.productName}</td><td>${p.quantity}</td><td>${formatDate((p.expiryDate), 'dd-MM-yyyy', 'en-US', '+0700')}</td><tr>`;
            });
            content += `<div class="map-product-table">
              <table><thead><tr>
                  <th>${this._translateService.instant('PRODUCT.CODE')}</th>
                  <th>${this._translateService.instant('PRODUCT.NAME')}</th>
                  <th>${this._translateService.instant('PRODUCT.QUANTITY')}</th>
                  <th>${this._translateService.instant('PRODUCT.EXPIRYDATE')}</th>
                </tr></thead>
                <tbody>${row}</tbody>
              </table>
            </div>`;
            popup.setContent(content);
          }
          marker.isLoadProduct = true;
        }, (err) => {
          marker.isLoadProduct = false;
          // self._toast.error(err.message, 'Error');
        });
      }
      marker.openPopup();
    });
    marker.on('mouseout', (e) => {
      marker.closePopup();
    });
  }

  public listerMarkerClick(marker: L.Marker) {
    marker.on('click', (ev) => {
      this.selectSeat(ev.target.seatId, false);
      this.onSeatClicked.emit(ev.target.seatId);
    });
  }

  /**
   * Call api to update new position for seat
   * @param model
   */
  public updateSeatPosition(model) {
    if (this.markerType === MarkerType.Warehouse) {
      // this._warehouseService.moveWarehouse(model).subscribe((res) => {
      //   this._toast.success('Move position successfully.', 'Success');
      // })
    } else {
      // this._warehouseService.moveLocation(model).subscribe((res) => {
      //   this._toast.success('Move position successfully.', 'Success');
      // }, (err) => {
      //   this._toast.error(err.message, 'Error');
      // });
    }
  }

  public updateSeat(data: ILocation) {
    const seat = this.getSeat(data.id);
    if (seat) {
      const latLng = L.latLng(-data.yAxis, data.xAxis);
      this.editableLayer.removeLayer(seat);
      this.createSeat(data);
      if (this.highLighted === seat) {
        const newSeat = this.getSeat(data.id);
        if (newSeat) {
          this.highLighted = newSeat;
          newSeat.highLight();
        }
      }
    }
  }

  public removeSeat(id: number) {
    const seat = this.getSeat(id);
    if (seat) {
      this.editableLayer.removeLayer(seat);
      this.updateLegendTable(this.map);
    }
  }

  public createSeat(data: ILocation) {
    const point = L.latLng(-data.yAxis, data.xAxis);
    this.createMarker(point, data);
    this.updateLegendTable(this.map);
  }

  public reloadSeats() {
    this.map.removeLayer(this.editableLayer);
    this.createEditableLayer();
    this.initSeats();
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  private getSeat(id: number) {
    const layers = this.editableLayer.getLayers();
    const selectedItem = _.find(layers, (layer: CustomMarker) => {
      return layer.seatId === id;
    });
    return selectedItem;
  }

  private addNewSeat(latlng: L.LatLng) {
    const pos = {
      xAxis: latlng.lng,
      yAxis: -latlng.lat
    };
    this.onAddNewSeat.emit(pos);
  }

  private setMarkerHighLight(seat: CustomMarker) {
    if (this.highLighted) {
      this.highLighted.removeHighLight(this.markerType);
      this.highLighted = null;
    }
    seat.highLight(this.markerType);
    this.highLighted = seat;
  }


}
