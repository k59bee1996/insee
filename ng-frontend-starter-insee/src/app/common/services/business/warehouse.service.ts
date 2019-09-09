import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  catchError,
  tap
} from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { HttpParams } from '@angular/common/http';
import { CustomHttpClient } from '@services/http';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

@Injectable()
export class WarehouseService {
  public apiUrl = '/warehouses';

  constructor(private _http: CustomHttpClient,
              private _translationLoader: FuseTranslationLoaderService,
              private _toast: ToastrService) {
  }

  public fetchList(params?) {
    params = Object.assign({}, params || {});
    const queryParams = new HttpParams({fromObject: params});
    return this._http.Get(this.apiUrl, {
      params: queryParams
    });
  }

  public fetchDetail(id) {
    return this._http.Get(`${this.apiUrl}/${id}`);
  }

  public fetchCreateOrUpdate(data) {
    if (data && data.id) {
      return this._http.Put(this.apiUrl, data).pipe(
        tap(() => {
          const message = this._translationLoader.instant('UPDATE_SUCCESS');
          const title = this._translationLoader.instant('SUCCESS');
          this._toast.success(message, title);
        }),
        catchError(error => {
          return of(error);
        })
      );
    }
    return this._http.Post(this.apiUrl, data).pipe(
      tap(() => {
        const message = this._translationLoader.instant('CREATE_SUCCESS');
        const title = this._translationLoader.instant('SUCCESS');
        this._toast.success(message, title);
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

  public fetchDelete(id) {
    return this._http.Delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const message = this._translationLoader.instant('DELETE_SUCCESS');
        const title = this._translationLoader.instant('SUCCESS');
        this._toast.success(message, title);
      }),
      catchError(error => {
        return of(error);
      })
    );
  }
}
