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
export class BillService {

  constructor(private _http: CustomHttpClient,
              private _translationLoader: FuseTranslationLoaderService,
              private _toast: ToastrService) {
  }

  public fetchBills(params) {
    params = {
      pageIndex: 0,
      orderDescending: true,
      ...params
    };
    const queryParams = new HttpParams({fromObject: params});
    return this._http.Get('/billofladings', {
      params: queryParams
    });
  }

  public fetchBill(id) {
    return this._http.Get(`/billofladings/${id}`);
  }

  public fetchCreateOrUpdateBill(data) {
    if (data && data.id) {
      return this._http.Put('/billofladings', data).pipe(
        tap(() => {
          const message = this._translationLoader.instant('UPDATE_BILL_SUCCESS');
          const title = this._translationLoader.instant('SUCCESS');
          this._toast.success(message, title);
        }),
        // catchError(error => {
        //   return of(error);
        // })
      );
    }
    return this._http.Post('/billofladings', data).pipe(
      tap(() => {
        const message = this._translationLoader.instant('ADD_BILL_SUCCESS');
        const title = this._translationLoader.instant('SUCCESS');
        this._toast.success(message, title);
      }),
      // catchError(error => {
      //   return of(error);
      // })
    );
  }

  public fetchDeleteBill(id) {
    return this._http.Delete(`/billofladings/${id}`).pipe(
      tap(() => {
        const message = this._translationLoader.instant('DELETE_BILL_SUCCESS');
        const title = this._translationLoader.instant('SUCCESS');
        this._toast.success(message, title);
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

  public fetchUpdateStatusBill(statusId: number, billIds: number[]) {
    return this._http.Post('/billofladings/status?statusId=' + statusId, billIds).pipe(
      tap(() => {
        const message = this._translationLoader.instant('UPDATE_STATUS_BILL_SUCCESS');
        const title = this._translationLoader.instant('SUCCESS');
        this._toast.success(message, title);
      }),
      catchError(error => {
        return of(error);
      })
    );
  }
}
