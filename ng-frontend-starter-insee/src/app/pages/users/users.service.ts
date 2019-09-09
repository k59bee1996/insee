import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User, UserResponse } from '../../common/models/users.model';
import { RoleResponse } from '../../common/models/roles.model';
import { CustomHttpClient } from '@services/http/http.service';
import { HttpParams } from '@angular/common/http';


@Injectable()
export class UsersService {

  constructor(private _http: CustomHttpClient) {
  }

  public getList(params): Observable<UserResponse> {
    return this._http.Get<UserResponse>(`/users`, {
      params
    });
  }

  public getDetail(id): Observable<User> {
    return this._http.Get<User>(`/users/detail/${id}`);
  }

  public create(data: User): Observable<any> {
    return this._http.Post(`/users`, data);
  }

  public update(data: User): Observable<any> {
    return this._http.Put(`/users/detail/${data.id}`, data);
  }

  public delete(id): Observable<any> {
    return this._http.Delete(`/users/${id}`);
  }

  public getRoles(): Observable<RoleResponse> {
    return this._http.Get<RoleResponse>(`/userroles`, {
      'params': new HttpParams()
        .set('isActive', 'true')
        .set('isDelete', 'false')
    });
  }

  public resetPassword(id): Observable<any> {
    return this._http.Post(`/users/resetpassword`, {id});
  }
}
