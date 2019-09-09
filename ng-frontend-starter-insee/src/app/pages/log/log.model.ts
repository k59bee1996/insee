export class LogModel {
  id: number;
  logLevel: string;
  shortMessage: string;
  fullMessage: string;
  createdOnUtc: string;

  constructor(data?) {
    data = data || {};
    this.id = data.id;
    this.logLevel = data.logLevel;
    this.shortMessage = data.shortMessage;
    this.fullMessage = data.fullMessage;
    this.createdOnUtc = data.createdOnUtc;
  }
}

export interface LogLevels {
  logLevelList: {
    id: number,
    name: string
  }[];
}
