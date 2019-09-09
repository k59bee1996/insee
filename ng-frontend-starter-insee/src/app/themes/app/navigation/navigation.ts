import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@services/auth';
import { Permission } from '@common/models/permission.model';

export class FuseNavigationModel {
  public model = [];

  constructor(private _authService: AuthService,
              private _translateService: TranslateService) {
    this.model = [
      {
        'id': 'applications',
        'title': this._translateService.instant('NAV.APPLICATIONS'),
        'translate': 'NAV.APPLICATIONS',
        'type': 'group',
        'children': [
          // {
          //   'id': 'dashboard',
          //   'title': this._translateService.instant('NAV.DASHBOARD.TITLE'),
          //   'translate': 'NAV.DASHBOARD.TITLE',
          //   'type': 'item',
          //   'icon': 'multiline_chart',
          //   'url': '/pages/dashboard',
          //   'hide': !this._authService.checkPermission(Permission.DASHBOARD),
          // },
          {
            'id': 'warehouse',
            'title': this._translateService.instant('NAV.WAREHOUSE.TITLE'),
            'translate': 'NAV.WAREHOUSE.TITLE',
            'type': 'item',
            'icon': 'map',
            'url': '/pages/warehouse',
            // 'hide': !this._authService.checkPermission(Permission.WAREHOUSE.MANAGE),
          },
          // {
          //   'id': 'report',
          //   'title': this._translateService.instant('REPORT'),
          //   'translate': 'REPORT',
          //   'type': 'item',
          //   'icon': 'bar_chart',
          //   'url': '/pages/report',
          //   'hide': !this._authService.checkPermission(Permission.REPORT),
          // },
          {
            'id': 'users',
            'title': this._translateService.instant('NAV.USER.TITLE'),
            'translate': 'NAV.USER.TITLE',
            'type': 'collapse',
            'icon': 'group',
            'hide': !this._authService.checkPermission(Permission.USER.MANAGE),
            'children': [
              {
                'id': 'user',
                'title': this._translateService.instant('NAV.USER.USERS'),
                'translate': 'NAV.USER.USERS',
                'type': 'item',
                'url': '/pages/user-management/users',
                'hide': !this._authService.checkPermission(Permission.USER.USERS),
              },
              {
                'id': 'role',
                'title': this._translateService.instant('NAV.USER.ROLES'),
                'translate': 'NAV.USER.ROLES',
                'type': 'item',
                'url': '/pages/user-management/roles',
                'hide': !this._authService.checkPermission(Permission.USER.ROLES),
              }
            ]
          },
          {
            'id': 'configuration',
            'title': this._translateService.instant('NAV.CONFIGURATION'),
            'translate': 'NAV.CONFIGURATION',
            'type': 'collapse',
            'icon': 'settings',
            'hide': !this._authService.checkPermission(Permission.ADMIN.MANAGE),
            'children': [
              {
                'id': 'log',
                'title': this._translateService.instant('NAV.LOG.TITLE'),
                'translate': 'NAV.LOG.TITLE',
                'type': 'item',
                'url': '/pages/configs/log',
                'hide': !this._authService.checkPermission(Permission.ADMIN.LOG),
              },
              {
                'id': 'setting',
                'title': this._translateService.instant('NAV.SETTING.TITLE'),
                'translate': 'NAV.SETTING.TITLE',
                'type': 'item',
                'url': '/pages/configs/setting',
                'hide': !this._authService.checkPermission(Permission.ADMIN.SETTING),
              },
              {
                'id': 'language',
                'title': this._translateService.instant('NAV.LANGUAGE.TITLE'),
                'translate': 'NAV.LANGUAGE.TITLE',
                'type': 'item',
                'url': '/pages/configs/language',
                'hide': !this._authService.checkPermission(Permission.ADMIN.LANGUAGE),
              },
              {
                'id': 'database',
                'title': this._translateService.instant('NAV.DATABASE.TITLE'),
                'translate': 'NAV.DATABASE.TITLE',
                'type': 'item',
                'url': '/pages/configs/database',
                'hide': !this._authService.checkPermission(Permission.ADMIN.DATABASE),
              },
            ]
          }
        ]
      },
    ];
  }
}
