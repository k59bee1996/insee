import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from '../auth';
import { FuseConfigService } from '@fuse/services/config.service';
import { Permission } from '@common/models/permission.model';

@Injectable()
export class PermissionGuard implements CanActivate, CanActivateChild {
  constructor(private _authService: AuthService,
              private fuseConfig: FuseConfigService,
              private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const permissions = route.data && route.data.permission;
    if (!this._authService.checkPermission(permissions)) {
      return this.processPermission();
    }
    return true;
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const permissions = route.data && route.data.permission;
    if (!this._authService.checkPermission(permissions)) {
      return this.processPermission();
    }
    return true;
  }

  public processPermission(): boolean {
    if (this._authService.checkPermission(Permission.TRACKING)) {
      this.router.navigate(['pages', 'tracking']);
    } else if (this._authService.checkPermission(Permission.BILL.VIEW)) {
      this.router.navigate(['pages', 'bill']);
    } else {
      this.fuseConfig.setConfig({
        layout: {
          navigation: 'none',
          toolbar: 'none',
          footer: 'none'
        }
      });
      this.router.navigate(['auth', 'login']);
    }
    return false;
  }
}
