import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import {
  Observable,
  of
} from 'rxjs';
import {
  catchError,
  tap
} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CustomHttpClient } from '@services/http';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

@Injectable()
export class LocationService {

  constructor(private _http: CustomHttpClient,
              private _translationLoader: FuseTranslationLoaderService,
              private _toast: ToastrService) {
  }

  public onSearchCity(cities, keyword) {
    if (keyword && keyword.trim().length > 0) {
      return cities.filter(city => {
        return city.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
    }
    return cities;
  }

  public onSearchAddress(addresses, keyword) {
    if (keyword && keyword.trim().length > 0) {
      return addresses.filter(city => {
        return (city.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1 || city.hubCode.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
      });
    }
    return addresses;
  }

  public fetchAddresses(params = {}, isGetAll?) {
    if (isGetAll) {
      params = {
        name: '',
      };
    } else {
      params = {
        name: '',
        ...params
      };
    }
    const queryParams = new HttpParams({fromObject: params});
    return this._http.Get('/addresses', {
      params: queryParams
    });
  }

  public fetchCities(params = {}) {
    params = {
      name: '',
      ...params
    };
    const queryParams = new HttpParams({fromObject: params});
    return this._http.Get('/cities', {
      params: queryParams
    });
  }

  public fetchDeleteCity(id) {
    return this._http.Delete(`/cities/${id}`).pipe(
      tap(() => {
        const message = this._translationLoader.instant('DELETE_CITY_SUCCESS');
        const title = this._translationLoader.instant('SUCCESS');
        this._toast.success(message, title);
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

  public fetchDeleteAddress(id) {
    return this._http.Delete(`/addresses/${id}`).pipe(
      tap(() => {
        const message = this._translationLoader.instant('DELETE_ADDRESS_SUCCESS');
        const title = this._translationLoader.instant('SUCCESS');
        this._toast.success(message, title);
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

  public fetchCreateOrUpdateCity(data): Observable<any> {
    if (data && data.id) {
      return this._http.Put('/cities', data).pipe(
        tap(() => {
          const message = this._translationLoader.instant('UPDATE_CITY_SUCCESS');
          const title = this._translationLoader.instant('SUCCESS');
          this._toast.success(message, title);
        }),
        catchError(error => {
          return of(error);
        })
      );
    }
    return this._http.Post('/cities', data).pipe(
      tap(() => {
        const message = this._translationLoader.instant('ADD_CITY_SUCCESS');
        const title = this._translationLoader.instant('SUCCESS');
        this._toast.success(message, title);
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

  public fetchCreateOrUpdateAddress(data): Observable<any> {
    if (data && data.id) {
      return this._http.Put('/addresses', data).pipe(
        tap(() => {
          const message = this._translationLoader.instant('UPDATE_ADDRESS_SUCCESS');
          const title = this._translationLoader.instant('SUCCESS');
          this._toast.success(message, title);
        }),
        catchError(error => {
          return of(error);
        })
      );
    }
    return this._http.Post('/addresses', data).pipe(
      tap(() => {
        const message = this._translationLoader.instant('ADD_ADDRESS_SUCCESS');
        const title = this._translationLoader.instant('SUCCESS');
        this._toast.success(message, title);
      }),
      catchError(error => {
        return of(error);
      })
    );
  }
}
