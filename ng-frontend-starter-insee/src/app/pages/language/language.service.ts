import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  LanguageModel,
  LanguageResponse,
  ResourceModel,
  ResourceResponse
} from './language.model';
import { CustomHttpClient } from '@services/http';

@Injectable()
export class LanguageService {

  constructor(private _http: CustomHttpClient) {
  }

  public getList(params): Observable<LanguageResponse> {
    return this._http.Get<LanguageResponse>(`/languages`, {
      params
    });
  }

  public getDetail(id): Observable<LanguageModel> {
    return this._http.Get<LanguageModel>(`/languages/${id}`);
  }

  public create(data: LanguageModel): Observable<any> {
    return this._http.Post(`/languages`, data);
  }

  public update(data: LanguageModel): Observable<any> {
    return this._http.Put(`/languages`, data);
  }

  public delete(id): Observable<any> {
    return this._http.Delete(`/languages/${id}`);
  }

  public getResources(params): Observable<ResourceResponse> {
    return this._http.Get<ResourceResponse>(`/languages/${params.id}/localstringresources`, {
      params
    });
  }

  public getResource(id): Observable<ResourceModel> {
    return this._http.Get<ResourceModel>(`/localestringresources/${id}`);
  }

  public createResource(data: ResourceModel): Observable<any> {
    return this._http.Post(`/localestringresources`, data);
  }

  public updateResource(data: ResourceModel): Observable<any> {
    return this._http.Put(`/localestringresources`, data);
  }

  public deleteResource(id): Observable<any> {
    return this._http.Delete(`/localestringresources/${id}`);
  }

}
