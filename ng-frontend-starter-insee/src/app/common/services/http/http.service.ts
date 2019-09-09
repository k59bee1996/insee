import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { Util } from '../util';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { AppConstant } from '../appConstant';

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: any;
  withCredentials?: boolean;
  body?: any;
  noIntercept?: boolean;
}

@Injectable()
export class CustomHttpClient {
  public refreshTokenSubject: Subject<string>;

  constructor(private http: HttpClient,
              private _util: Util,
              private _router: Router) {

  }

  /**
   * GET request
   * @param {string} endPoint it doesn't need / in front of the end point
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public Get<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.intercept<T>(this.http.get<T>(AppConstant.domain + endPoint, options));
  }

  /**
   * POST request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public Post<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    if (options && options.noIntercept) {
      return this.http.post<T>(endPoint, params, options);
    } else {
      return this.intercept<T>(this.http.post<T>(AppConstant.domain + endPoint, params, options));
    }
  }

  /**
   * PUT request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public Put<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    return this.intercept<T>(this.http.put<T>(AppConstant.domain + endPoint, params, options));
  }

  /**
   * DELETE request
   * @param {string} endPoint end point of the api
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public Delete<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.intercept<T>(this.http.delete<T>(AppConstant.domain + endPoint, options));
  }

  public intercept<T>(observable: Observable<T>): Observable<T> {
    return new Observable<T>(subscriber => {
      observable.subscribe(
        (data) => {
          // subscribe
          subscriber.next(data);
        },
        (err) => {
          // error
          if (err.status === 401) {
            if (!this.refreshTokenSubject) {
              this.refreshTokenSubject = new Subject<string>();
              this.refreshToken().subscribe(token => {
                this.refreshTokenSubject.next(token);
              }, (error) => {
                console.log('refresh token failed', error);
                this._util.clearToken();
                this._router.navigateByUrl('auth/login');
                subscriber.error(error);
              });
            }

            this.refreshTokenSubject.subscribe(() => {
              this.intercept(observable).subscribe(
                (data) => subscriber.next(data),
                (error) => subscriber.error(error),
                () => subscriber.complete()
              );
            });
          } else if (err.status === 400 && err.error && err.error.errorMessages && err.error.errorMessages[0] === 'Permission.NotPermission') {
            setTimeout(() => {
              this._util.clearToken();
              this._router.navigateByUrl('auth/login');
              subscriber.error(err);
            }, 500);
          } else if (err.error) {
            this._util.showError(err.error);
            subscriber.error(err);
          }
        },
        () => {
          // complete
          subscriber.complete();
        }
      );
    });
  }

  public refreshToken() {
    const userToken = this._util.getToken();
    const refreshToken = userToken ? userToken.refreshToken : null;
    const httpParams = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken)
      .set('client_id', AppConstant.clientId)
      .set('client_secrect', AppConstant.clientSecret);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    });

    return this.http.post(`${AppConstant.domain}/token`, httpParams, { headers })
      .pipe(
        // map((response: any) => response.data),
        tap((responseData: any) => {
          this._util.setToken(responseData.access_token, responseData.refresh_token);
        })
      );
  }

  public sendPushNotification(data) {
    if (isDevMode()) {
      return Observable.of({});
    }
    // this push for other project, DON'T USE this app_id
    // REST API KEYS: ZmNjYjk3MDEtYTU2Ny00ZDAyLTg5Y2ItOTU5OTYyYjhlOTJl
    // APP ID: b66a2459-f49b-4efe-80e2-a61eae8c4717
    const message = {
      app_id: "2bb81cde-1669-486d-91eb-16e574f8955f",
      contents: {"en": data || "Order updated"},
      included_segments: ["All"],
      small_icon: 'ic_stat_onesignal_default',
    };
    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic NDMxNjE0NmYtMTY0NS00NTBhLTk5M2UtYzdiYTE0MDkxOTYx"
    });
    const options = {
      headers: headers,
      body: message,
      noIntercept: true
    };
    return this.Post("https://onesignal.com/api/v1/notifications", message, options);
  }
}
