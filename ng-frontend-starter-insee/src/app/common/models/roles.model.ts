export class UserRole {
  id: number;
  systemName: string;
  name: string;
  description: string;
  permissions: any[];
  displayOrder: number;
  isActive: boolean;

  constructor(userRole?) {
    userRole = userRole || {};
    this.id = userRole.id;
    this.systemName = userRole.systemName;
    this.name = userRole.name;
    this.description = userRole.description;
    this.permissions = userRole.permissions || [];
    this.displayOrder = userRole.displayOrder;
    this.isActive = userRole.isActive;
  }
}

export class RoleResponse {
  userRoles: UserRole[];
  total?: number;
}
