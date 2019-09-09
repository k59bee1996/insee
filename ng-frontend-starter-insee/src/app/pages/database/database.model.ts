export class Backup {
  id: number;
  name: string;
  createdOn: string;
  createdBy: string;

  constructor(data?) {
    data = data || {};
    this.id = data.id;
    this.name = data.name;
    this.createdOn = data.createdOn;
    this.createdBy = data.createdBy;
  }
}

export class BackupResponse {
  backupList: Backup[];
  total?: number;
}
