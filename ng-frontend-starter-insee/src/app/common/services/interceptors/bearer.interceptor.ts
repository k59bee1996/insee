import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { AuthService } from '@services/auth';
import { Util } from '@services/util';

@Injectable()
export class BearerInterceptor implements HttpInterceptor {
  private anonymousUrl: string[] = ['token', 'assets/i18n', 'https://onesignal.com/api/v1/notifications'];

  constructor(private inj: Injector,
              private _util: Util) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // TODO: check url of activatedroute when need
    const token = this._util.getToken();
    const auth = this.inj.get(AuthService);
    if (this.anonymousUrl.findIndex(i => req.url.toLowerCase().indexOf(i.toLowerCase()) >= 0) < 0) {
      // req.headers.append
      if (!auth.isAuthenticated) {
        // Error
        auth.logout();
        return;
      } else {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token.accessToken}`,
            'X-Timezone-Offset': '' + new Date().getTimezoneOffset()
          }
        });
        return next.handle(authReq);
      }
    }
    // this.showLoading(auth, req);
    return next.handle(req);
  }
}
