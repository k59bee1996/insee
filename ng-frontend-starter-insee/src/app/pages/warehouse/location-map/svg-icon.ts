import * as L from 'leaflet';
import {
  SvgIconOptions,
} from './svg-icon.model';

const SVGIcon = L.DivIcon.extend({
  options: {
    circleText: '',
    className: 'svg-icon animated-icon',
    circleAnchor: null, // defaults to [iconSize.x/2, iconSize.x/2]
    circleColor: null, // defaults to color
    circleOpacity: null, // defaults to opacity
    circleFillColor: 'rgb(255,255,255)',
    circleFillOpacity: null, // default to opacity
    circleRatio: 0,
    circleWeight: null, // defaults to weight
    color: 'rgb(0,102,255)',
    fillColor: null, // defaults to color
    fillOpacity: 1,
    fontColor: 'rgb(0, 0, 0)',
    fontOpacity: '1',
    fontSize: null, // defaults to iconSize.x/4
    iconAnchor: null, // defaults to [iconSize.x/2, iconSize.y] (point tip)
    iconSize: L.point(12, 18),
    opacity: 1,
    popupAnchor: null,
    weight: 1
  },
  initialize (options: SvgIconOptions) {
    options = L.Util.setOptions(this, options);

    if (!options.circleAnchor) {
      options.circleAnchor = L.point(Number(options.iconSize.x) / 2, Number(options.iconSize.x) / 2);
    }
    if (!options.circleColor) {
      options.circleColor = options.color;
    }
    if (!options.circleFillOpacity) {
      options.circleFillOpacity = options.opacity;
    }
    if (!options.circleOpacity) {
      options.circleOpacity = options.opacity;
    }
    if (!options.circleWeight) {
      options.circleWeight = options.weight;
    }
    if (!options.fillColor) {
      options.fillColor = options.color;
    }
    if (!options.fontSize) {
      options.fontSize = Number(options.iconSize.x / 4);
    }
    if (!options.iconAnchor) {
      options.iconAnchor = L.point(Number(options.iconSize.x) / 2, Number(options.iconSize.y));
    }
    if (!options.popupAnchor) {
      options.popupAnchor = L.point(0, (-0.75) * (options.iconSize.y));
    }

    const path = this._createPath();
    const circle = this._createCircle();

    options.html = this._createSVG();
  },
  _createCircle () {
    const cx = Number(this.options.circleAnchor.x);
    const cy = Number(this.options.circleAnchor.y);
    const radius = this.options.iconSize.x / 2 * Number(this.options.circleRatio);
    const fill = this.options.circleFillColor;
    const fillOpacity = this.options.circleFillOpacity;
    const stroke = this.options.circleColor;
    const strokeOpacity = this.options.circleOpacity;
    const strokeWidth = this.options.circleWeight;
    const className = this.options.className + '-circle';

    const circle = '<circle class="' + className + '" cx="' + cx + '" cy="' + cy + '" r="' + radius +
      '" fill="' + fill + '" fill-opacity="' + fillOpacity +
      '" stroke="' + stroke + '" stroke-opacity=' + strokeOpacity +
      '" stroke-width="' + strokeWidth + '"/>';

    return circle;
  },
  _createPathDescription () {
    const height = Number(this.options.iconSize.y);
    const width = Number(this.options.iconSize.x);
    const weight = Number(this.options.weight);
    const margin = weight / 2;

    const startPoint = 'M ' + margin + ' ' + (width / 2) + ' ';
    const leftLine = 'L ' + (width / 2) + ' ' + (height - weight) + ' ';
    const rightLine = 'L ' + (width - margin) + ' ' + (width / 2) + ' ';
    const arc = 'A ' + (width / 4) + ' ' + (width / 4) + ' 0 0 0 ' + margin + ' ' +
      (width / 2) + ' Z';

    const d = startPoint + leftLine + rightLine + arc;

    return d;
  },
  _createPath () {
    const pathDescription = this._createPathDescription();
    const strokeWidth = this.options.weight;
    // const stroke = this.options.color;
    const stroke = '#01579b';
    const strokeOpacity = this.options.Opacity;
    const fill = this.options.fillColor;
    const fillOpacity = this.options.fillOpacity;
    const className = this.options.className + '-path';

    const path = '<path class="' + className + '" d="' + pathDescription +
      '" stroke-width="' + strokeWidth + '" stroke="' + stroke + '" stroke-opacity="' +
      strokeOpacity + '" fill="' + fill + '" fill-opacity="' + fillOpacity + '"/>';

    return path;
  },
  _createSVG () {
    const path = this._createPath();
    const circle = this._createCircle();
    const text = this._createText();
    const className = this.options.className + '-svg';

    const style = 'width:' + this.options.iconSize.x + '; height:' + this.options.iconSize.y + ';';

    const svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="' +
      className + '" style="' + style + '">' + path + circle + text + '</svg>';

    return svg;
  },
  _createText () {
    const fontSize = this.options.fontSize + 'px';
    const lineHeight = Number(this.options.fontSize);

    const x = Number(this.options.iconSize.x) / 2;
    const y = x + (lineHeight * 0.35);  // 35% was found experimentally
    const circleText = this.options.circleText;
    const textColor = this.options.fontColor
      .replace('rgb(', 'rgba(').replace(')', ',' + this.options.fontOpacity + ')');

    const text = '<text text-anchor="middle" x="' + x + '" y="' + y + '" style="font-size: ' +
      fontSize + '" fill="' + textColor + '">' + circleText + '</text>';

    return text;
  }
});

const svgIcon = (options: L.DivIconOptions) => {
  return new SVGIcon(options);
};

export {
  SVGIcon,
  svgIcon
};
