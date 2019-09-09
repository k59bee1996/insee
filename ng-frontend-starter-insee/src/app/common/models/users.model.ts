import { UserRole } from './roles.model';

export class User {
  id?: string;
  userName?: string;
  userId?: string;
  userGuid?: string;
  fullName?: string;
  userRoles?: UserRole[];
  permission?: string;
  position?: string;
  warehouseId?: number;
  warehouseName?: string;
  email?: string;
  phone?: string;
  genderId?: number;
  latestLoggedin?: string;
  isActive?: boolean;
  qrCode?: string;
  username?: string;

  constructor(user?) {
    user = user || {};
    this.id = user.id;
    this.userName = user.userName;
    this.userId = user.userId;
    this.userGuid = user.userGuid;
    this.fullName = user.fullName;
    this.userRoles = user.userRoles || [];
    this.permission = user.permission;
    this.position = user.position;
    this.warehouseId = user.warehouseId;
    this.warehouseName = user.warehouseName;
    this.email = user.email;
    this.phone = user.phone;
    this.genderId = user.genderId;
    this.latestLoggedin = user.latestLoggedin;
    this.isActive = user.isActive;
    this.qrCode = user.qrCode || '';
    this.username = user.username;
  }
}

export class UserResponse {
  total: number;
  users: User[];
}
