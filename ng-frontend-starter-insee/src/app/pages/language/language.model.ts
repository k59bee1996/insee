export class LanguageModel {
  id: number;
  name: string;
  languageCulture: string;
  flagImageFileName: string;
  isActive: boolean;
  displayOrder: number;

  constructor(data?) {
    data = data || {};
    this.id = data.id;
    this.name = data.name;
    this.languageCulture = data.languageCulture;
    this.flagImageFileName = data.flagImageFileName;
    this.isActive = data.isActive;
    this.displayOrder = data.displayOrder;
  }
}

export class LanguageResponse {
  languageList: LanguageModel[];
  total?: number;
}

export class ResourceModel {
  id: number;
  resourceName: string;
  resourceValue: string;
  languageId?: number;

  constructor(data?) {
    data = data || {};
    this.id = data.id;
    this.resourceName = data.resourceName;
    this.resourceValue = data.resourceValue;
    this.languageId = data.languageId;
  }
}

export class ResourceResponse {
  localStringResourceList: ResourceModel[];
  total?: number;
}
