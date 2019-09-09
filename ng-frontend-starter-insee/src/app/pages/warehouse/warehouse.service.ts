import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LocationModel, LocationResponse, WarehouseModel, WarehouseResponse } from './warehouse.model';
import { CustomHttpClient } from '@services/http';

@Injectable()
export class WarehouseService {
  public apiUrl: string = '/warehouses';

  constructor(private _http: CustomHttpClient) {
  }

  public getList(): Observable<WarehouseResponse> {
    return this._http.Get<WarehouseResponse>(`${this.apiUrl}`);
  }

  public getDetail(id): Observable<WarehouseModel> {
    return this._http.Get<WarehouseModel>(`${this.apiUrl}/${id}`);
  }

  public create(data: WarehouseModel): Observable<any> {
    return this._http.Post(this.apiUrl, data);
  }

  public update(data: WarehouseModel): Observable<any> {
    return this._http.Put(this.apiUrl, data);
  }

  public delete(id): Observable<any> {
    return this._http.Delete(`${this.apiUrl}/${id}`);
  }

  public getLocations(warehouseId, params?): Observable<LocationResponse> {
    return this._http.Get<LocationResponse>(`/locations/warehouses/${warehouseId}`, {
      params
    });
  }

  public getLocation(id): Observable<LocationModel> {
    return this._http.Get<LocationModel>(`/locations/${id}`);
  }

  public createLocation(data: LocationModel): Observable<any> {
    return this._http.Post(`/locations`, data);
  }

  public updateLocation(data: LocationModel): Observable<any> {
    return this._http.Put(`/locations`, data);
  }

  public deleteLocation(id): Observable<any> {
    return this._http.Delete(`/locations/${id}`);
  }

  public moveLocation(data): Observable<any> {
    return this._http.Put(`/locations/move`, data);
  }

  public getProductsByLocationId(locationId): Observable<any> {
    return this._http.Get(`/locations/${locationId}/itembylocationid`);
  }

  public getAreas(): Observable<any> {
    return this._http.Get(`/areas`);
  }

  public getArea(id): Observable<any> {
    return this._http.Get(`/areas/${id}`);
  }

  public moveWarehouse(data): Observable<any> {
    return this._http.Put(`/warehouses/move`, data);
  }

  public updateBarcodeItem(data): Observable<any> {
    return this._http.Put('/barcodeitems/UpdateProductItem', data);
  }
}
