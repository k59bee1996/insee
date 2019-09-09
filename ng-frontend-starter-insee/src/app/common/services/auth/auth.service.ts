import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from '../appConstant';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Util } from '@services/util';
import { Permission } from '@common/models/permission.model';
import { User } from '@common/models/users.model';

@Injectable()
export class AuthService {
  private _currentUser: User;

  constructor(private _http: HttpClient,
              private _router: Router,
              private _util: Util,
              private _toast: ToastrService,
              private localStorageService: LocalStorageService) {
  }

  get currentUser(): User {
    this._currentUser = this.localStorageService.retrieve('userInfo') as User;

    if (!this._currentUser) {
      this._currentUser = new User();
    }
    return this._currentUser;
  }

  set currentUser(info: User) {
    this._currentUser = info;
    this.localStorageService.store('userInfo', info);
  }

  get isAuthenticated(): boolean {
    const {accessToken, refreshToken} = this._util.getToken();
    return !!accessToken && !!refreshToken && !!this.currentUser && !!this.currentUser.id;
  }

  /**
   * fillInfo
   * @param obj
   */
  public updateUserInfo(obj: any): void {
    this.currentUser = (Object as any).assign(this.currentUser, obj);
    // use broadcaster service if need
  }

  /**
   * clearInfo
   */
  public clear(): void {
    this.currentUser = new User();
    this.localStorageService.clear('userInfo');
    this._util.clearToken();
  }

  public login(username: string, password: string, cb?: any): Observable<any> {
    if (!username || !password) {
      return;
    }
    const data = {
      username: username,
      password: password,
      grant_type: 'password',
      client_id: AppConstant.clientId,
      client_secrect: AppConstant.clientSecret
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    });
    const shareRequest = this._http.post(`${AppConstant.domain}/token`, this._util.transformRequestHandler(data), {
      headers
    }).share();

    shareRequest.subscribe((resp: any) => {
        const userInfo = new User();
        userInfo.id = resp.userId;
        userInfo.userName = resp.userName;
        userInfo.userId = resp.userId;
        userInfo.userGuid = resp.userGuid;
        userInfo.fullName = resp.fullName;
        userInfo.userRoles = resp.userRoles;
        userInfo.permission = resp.permission;
        this.updateUserInfo(userInfo);
        this._util.setToken(resp.access_token, resp.refresh_token);
        // get user detail
        this._http.get(`${AppConstant.domain}/users/${userInfo.id}`).subscribe(user => {
          this.updateUserInfo(user);
        });
      }, (err) => {
        this.clear();
      }
    );
    return shareRequest;
  }

  public signup(email: string, password: string, cb: any): void {

  }

  public logout(): void {
    this.clear();
    this._router.navigateByUrl('auth/login');
  }

  public checkPermission(permissions: string | string[]) {
    if (!this.currentUser) {
      return false;
    }
    const userPermissions = (this.currentUser.permission || '').split(',');
    let permissionsArr = [];
    if (!permissions) {
      return true;
    } else if (typeof permissions === 'string') {
      permissionsArr = permissions.split(',');
    } else if (permissions instanceof Array) {
      permissionsArr = permissions;
    }
    // Find permission that user match
    return permissionsArr.some((p) => {
      return userPermissions.indexOf(p) >= 0;
    });
  }

  public isAdmin(): boolean {
    return this.checkPermission(Permission.ADMIN.MANAGE);
  }

}
