import {
  SVGIcon,
  svgIcon
} from './svg-icon';
import * as L from 'leaflet';

import { SvgMarkerOptions } from './svg-icon.model';
import { MarkerType } from '@common/models/CommonConstant';

const SVGMarker = L.Marker.extend({
  options: {
    iconFactory: svgIcon,
    iconOptions: {}
  },
  initialize (latlng: L.LatLng, options: SvgMarkerOptions) {
    if (!options.icon) {
      options = L.Util.setOptions(this, options);
      options.icon = options.iconFactory(options.iconOptions);
    } else {
      options = L.Util.setOptions(this, options);
    }
    this._latlng = latlng;
  },
  onAdd (map: L.Map) {
    L.Marker.prototype.onAdd.call(this, map);
  },
  setStyle (style) {
    if (this._icon) {
      const svg = this._icon.children[0];
      const iconBody = svg && svg.children[0];
      const iconCircle = svg && svg.children[1];

      if (style.color && !style.iconOptions) {
        const stroke = style.color
          .replace('rgb', 'rgba').replace(')', ',' + this.options.icon.options.opacity + ')');
        const fill = style.color
          .replace('rgb', 'rgba').replace(')', ',' + this.options.icon.options.fillOpacity + ')');
        if (iconBody) {
          iconBody.setAttribute('stroke', stroke);
          iconBody.setAttribute('fill', fill);
        }
        if (iconCircle) {
          iconCircle.setAttribute('stroke', stroke);
        }

        this.options.icon.fillColor = fill;
        this.options.icon.color = stroke;
        this.options.icon.circleColor = stroke;
      }
      if (style.opacity) {
        this.setOpacity(style.opacity);
      }
      if (style.iconOptions) {
        if (style.color) {
          style.iconOptions.color = style.color;
        }
        // const iconOptions = L.Util.setOptions(this.options.icon, style.iconOptions);
        // this.setIcon(svgIcon(iconOptions));
        const iconOptions = Object.assign(this.options.icon.options, style.iconOptions);
        this.options.icon = L.icon(iconOptions);
        this.setIcon(this.options.icon);
      }
    }
  },
  highLight (markerType?) {
    if (!markerType || markerType === MarkerType.Normal) {
      this.setStyle({
        color: 'red',
        iconOptions: {
          iconSize: L.point(20, 30),
          iconAnchor: L.point(10, 30)
        }
      });
    } else if (markerType === MarkerType.Product) {
      this.setStyle({
        iconOptions: {
          shadowUrl: '/assets/images/leaflet/marker-product-highlight.png',
          shadowAnchor: [17, 17],
          shadowSize: [35, 32], // size of the shadow
          iconSize: L.point(33, 31),
        }
      })
    }
  },
  removeHighLight (markerType?) {
    if (!markerType || markerType === MarkerType.Normal) {
      this.setStyle({
        color: this.options.iconOptions.color,
        iconOptions: {
          iconSize: L.point(12, 18),
          iconAnchor: L.point(6, 18)
        }
      });
    } else if (markerType === MarkerType.Product) {
      this.setStyle({iconOptions: {
          shadowUrl: '',
          iconSize: L.point(24, 22),
        }})
    }
  }
});

const svgMarker = (latlng: L.LatLng, options: SvgMarkerOptions) => {
  return new SVGMarker(latlng, options);
};

export {
  svgMarker,
  SVGMarker
};
