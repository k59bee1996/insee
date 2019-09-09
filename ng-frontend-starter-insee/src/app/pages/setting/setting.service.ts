import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Setting, SettingResponse } from './setting.model';
import { CustomHttpClient } from '@services/http';

@Injectable()
export class SettingService {

  constructor(private _http: CustomHttpClient) {
  }

  public getList(params): Observable<SettingResponse> {
    return this._http.Get<SettingResponse>(`/settings`, {
      params
    });
  }

  public getDetail(id): Observable<Setting> {
    return this._http.Get<Setting>(`/settings/${id}`);
  }

  public create(data: Setting): Observable<any> {
    return this._http.Post(`/settings`, data);
  }

  public update(data: Setting): Observable<any> {
    return this._http.Put(`/settings`, data);
  }

  public delete(id): Observable<any> {
    return this._http.Delete(`/settings/${id}`);
  }

}
