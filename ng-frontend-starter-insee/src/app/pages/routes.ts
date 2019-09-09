import {
  AuthGuard,
  PermissionGuard
} from '@common/services';
import { Permission } from '@common/models/permission.model';
import { PagesComponent } from '@pages/pages.component';


export const pageRoutes = [
  {
    path: 'pages',
    component: PagesComponent,
    canActivateChild: [
      AuthGuard,
      PermissionGuard
    ],
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'warehouse',
        // data: {permission: Permission.WAREHOUSE.MANAGE},
        loadChildren: './warehouse/warehouse.module#WarehouseModule'
      },
      {
        path: 'user-management/users',
        data: {permission: Permission.USER.USERS},
        loadChildren: './users/users.module#UsersModule'
      },
      {
        path: 'user-management/roles',
        data: {permission: Permission.USER.ROLES},
        loadChildren: './roles/roles.module#RolesModule'
      },
      {
        path: 'configs',
        data: {permission: Permission.ADMIN.MANAGE},
        children: [
          {path: '', redirectTo: 'language', pathMatch: 'full'},
          {
            path: 'setting',
            data: {permission: Permission.ADMIN.SETTING},
            loadChildren: './setting/setting.module#SettingModule'
          },
          {
            path: 'language',
            data: {permission: Permission.ADMIN.LANGUAGE},
            loadChildren: './language/language.module#LanguageModule'
          },
          {
            path: 'database',
            data: {permission: Permission.ADMIN.DATABASE},
            loadChildren: './database/database.module#DatabaseModule'
          },
          {
            path: 'log',
            data: {permission: Permission.ADMIN.LOG},
            loadChildren: './log/log.module#LogModule'
          },
        ]
      },
      {
        path: 'profile',
        loadChildren: './profile/profile.module#ProfileModule'
      },
      {
        path: '',
        redirectTo: 'warehouse',
        pathMatch: 'full'
      },
      {
        path: '**', redirectTo: 'warehouse'
      },
    ]
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadChildren: '../unAuth/login/login.module#LoginModule'
      },
      {
        path: 'error',
        loadChildren: '../unAuth/404/error-404.module#Error404Module'
      },
      {
        path: '**', redirectTo: 'error'
      }
    ]
  },
];

