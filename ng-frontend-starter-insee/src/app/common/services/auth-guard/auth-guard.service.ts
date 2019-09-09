import {
  Injectable
} from '@angular/core';

import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, CanActivateChild
} from '@angular/router';
import { AuthService } from '@services/auth';
import { FuseConfigService } from '@fuse/services/config.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private _authService: AuthService,
              private fuseConfig: FuseConfigService,
              private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this._authService.isAuthenticated) {
      this.fuseConfig.setConfig({
        layout: {
          navigation: 'none',
          toolbar: 'none',
          footer: 'none'
        }
      });
      this.router.navigate(['auth', 'login']);
      return false;
    }
    return true;
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this._authService.isAuthenticated) {
      this.fuseConfig.setConfig({
        layout: {
          navigation: 'none',
          toolbar: 'none',
          footer: 'none'
        }
      });
      this.router.navigate(['auth', 'login']);
      return false;
    }
    return true;
  }
}
