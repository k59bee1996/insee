export class Setting {
  id: number;
  name: string;
  value: string;

  constructor(data?) {
    data = data || {};
    this.id = data.id;
    this.name = data.name;
    this.value = data.value;
  }
}

export class SettingResponse {
  settingList: Setting[];
  total?: number;
}
