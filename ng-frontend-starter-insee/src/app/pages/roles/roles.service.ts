import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  RoleResponse,
  UserRole
} from '../../common/models/roles.model';
import { CustomHttpClient } from '@services/http/http.service';


@Injectable()
export class RolesService {

  constructor(private _http: CustomHttpClient) {
  }

  public getList(params): Observable<RoleResponse> {
    return this._http.Get<RoleResponse>(`/userroles`, {
      params
    });
  }

  public getDetail(id): Observable<UserRole> {
    return this._http.Get<UserRole>(`/userroles/${id}`);
  }

  public create(data: UserRole): Observable<any> {
    return this._http.Post(`/userroles`, data);
  }

  public update(data: UserRole): Observable<any> {
    return this._http.Put(`/userroles`, data);
  }

  public delete(id): Observable<any> {
    return this._http.Delete(`/userroles/${id}`);
  }

  public getPermissions(): Observable<any> {
    return this._http.Get(`/permissions`);
  }

}
