import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { HistoryResponse } from './history-page.model';
import { AppConstant } from '../../services';

@Injectable()
export class HistoryService {

  constructor(private _http: HttpClient) {
  }

  public getHistorys(entityName: string, id: string): Observable<HistoryResponse> {
    return this._http.get<HistoryResponse>(`${AppConstant.domain}/histories/${entityName}/${id}`);
  }

}
