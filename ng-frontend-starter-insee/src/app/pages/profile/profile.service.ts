import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../../common/models/users.model';
import { CustomHttpClient } from '@services/http/http.service';

@Injectable()
export class ProfileService {

  constructor(private _http: CustomHttpClient) {
  }

  public getDetail(id): Observable<User> {
    return this._http.Get<User>(`/users/${id}`);
  }

  public update(data: User): Observable<any> {
    return this._http.Put(`/users/${data.id}`, data);
  }

  public changePassword(data: any): Observable<any> {
    return this._http.Post(`/users/changepassword`, data);
  }

}
