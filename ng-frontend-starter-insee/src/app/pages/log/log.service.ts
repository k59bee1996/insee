import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CustomHttpClient } from '@services/http';
import {
  LogLevels,
  LogModel
} from '@pages/log/log.model';

@Injectable()
export class LogService {
  public apiUrl: string = '/logs';

  constructor(private _http: CustomHttpClient) {
  }

  public getLogLevels(): Observable<LogLevels> {
    return this._http.Get<LogLevels>(`${this.apiUrl}/levels`);
  }

  public getDetail(id): Observable<LogModel> {
    return this._http.Get<LogModel>(`${this.apiUrl}/${id}`);
  }

  public delete(id): Observable<any> {
    return this._http.Delete(`${this.apiUrl}/${id}`);
  }

}
