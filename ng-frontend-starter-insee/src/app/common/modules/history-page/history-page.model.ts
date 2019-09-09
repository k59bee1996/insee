export interface History {
  dateLog: string;
  actionDescription: string;
  actionActor: string;
  historyRemark: string;
  fields: Field[];
}

export interface Field {
  field: string;
  new: string;
  origin: number;
}

export interface HistoryResponse {
  historyList: History[];
}
