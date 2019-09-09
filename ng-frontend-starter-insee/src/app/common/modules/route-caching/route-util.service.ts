import {
  Injectable
} from '@angular/core';

import {
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';

@Injectable()
export class RouteUtilService {

  public getFullRoutePath(suffix, route: ActivatedRouteSnapshot) {
    if (route.routeConfig && route.routeConfig.path) { // If the path not empty
      suffix = `${route.routeConfig.path}/${suffix}`;
    }
    if (route.parent) { // If it still has parent
      return this.getFullRoutePath(suffix, route.parent);
    }
    return '/' + suffix;
  }

  public getFullRoutePathByActivatedRoute(suffix, route: ActivatedRoute) {
    if (route.routeConfig && route.routeConfig.path) { // If the path not empty
      suffix = `${route.routeConfig.path}/${suffix}`;
    }
    if (route.parent) { // If it still has parent
      return this.getFullRoutePathByActivatedRoute(suffix, route.parent);
    }
    return '/' + suffix;
  }

  public getLastActivatedRoute(route: ActivatedRoute) {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }
}
