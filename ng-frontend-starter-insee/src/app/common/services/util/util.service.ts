import {
  Injectable
} from '@angular/core';

import {
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { UserToken } from '@common/models/UserToken';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class Util {

  constructor(private localStorageService: LocalStorageService,
              private _translateService: TranslateService,
              private _toastrService: ToastrService) {
  }

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

  public getToken() {
    let userToken = this.localStorageService.retrieve('userToken') as UserToken;

    if (!userToken) {
      userToken = new UserToken();
    }
    return userToken;
  }

  public setToken(access_token, refresh_token) {
    const userToken = new UserToken();
    userToken.accessToken = access_token;
    userToken.refreshToken = refresh_token;

    this.localStorageService.store('userToken', userToken);
  }

  public clearToken() {
    this.localStorageService.clear('userToken');
  }

  /**
   * transformRequestHandler
   * @param obj
   * @returns {string}
   */
  public transformRequestHandler(obj): string {
    const str: string[] = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&');
  }

  public showError(error) {
    if (error.message) {
      this._toastrService.error(error.message, 'Error');
    } else if (error.error_description) {
      this._toastrService.error(error.error_description, 'Error');
    } else if (error.errorMessages && error.errorMessages instanceof Array) {
      let message = '';
      error.errorMessages.forEach((e) => {
        message += (e ? this._translateService.instant(e) : '') + '\n';
      });
      this._toastrService.error(message, 'Error');
    } else if (typeof error === 'string') {
      this._toastrService.error(error, 'Error');
    } else {
      this._toastrService.error('Unknown Error', 'Error');
    }
  }

  public getFilename(url): string {
    if (!url) {
      return null;
    }
    return url.substring(url.lastIndexOf('/') + 1);
  }


  public downloadFile(fileUrl) {
    const filename = this.getFilename(fileUrl);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
