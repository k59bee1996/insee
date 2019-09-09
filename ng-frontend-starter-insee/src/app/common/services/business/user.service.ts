import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { CustomHttpClient } from '@services/http';

@Injectable()
export class UserService {

  constructor(private _http: CustomHttpClient) {
  }

  public fetchUsers(params) {
    if (params.getAll) {
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
    return this._http.Get('/users', {
      params: queryParams
    });
  }

  public onSearchUsers(users, keyword) {
    if (keyword && keyword.trim().length > 0) {
      return users.filter(user => {
        return (user.fullName.toLowerCase().indexOf(keyword.toLowerCase()) > -1 || user.username.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
      });
    }
    return users;
  }
}
