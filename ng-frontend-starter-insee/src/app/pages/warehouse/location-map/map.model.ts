import * as L from 'leaflet';

interface ContextMenuItem {
  text: string;
  index: number;
  callback: Function;
}

export interface CustomMapOptions extends L.MapOptions {
  contextmenu?: boolean;
  contextmenuItems?: ContextMenuItem[];
  center: any;
  crs: any;
  maxZoom: number;
  minZoom: number;
  zoomSnap: number;
  attributionControl: boolean;
}

export class CustomMap extends L.Map {
  public options: CustomMapOptions;

  constructor(element: string | HTMLElement, options?: CustomMapOptions) {
    super(element, options);
  }
}

export interface CustomMarker extends L.Marker {
  seatId: number;
  highLight: Function;
  removeHighLight: Function;
  _latlng: L.LatLng;
}
