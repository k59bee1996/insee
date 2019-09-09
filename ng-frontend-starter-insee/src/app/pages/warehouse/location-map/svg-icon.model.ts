import * as L from 'leaflet';

export interface SvgIconOptions extends L.DivIconOptions {
  circleText?: string;
  className?: string;
  circleAnchor?: L.Point;
  circleColor?: string;
  circleOpacity?: number;
  circleFillColor?: string;
  circleFillOpacity?: number;
  circleRatio?: number;
  circleWeight?: number;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  fontColor?: string;
  fontOpacity?: string;
  fontSize?: number;
  iconAnchor?: L.Point;
  iconSize?: L.Point;
  opacity?: number;
  popupAnchor?: L.Point;
  weight?: number;
  html?: string;
}

export interface SvgMarkerOptions extends L.MarkerOptions {
  icon?: any;
  iconOptions?: SvgIconOptions;
  iconFactory?: Function;
  draggable?: boolean;
  
}
