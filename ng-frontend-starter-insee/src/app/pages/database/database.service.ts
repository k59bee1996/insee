import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  Backup,
  BackupResponse
} from './database.model';
import { CustomHttpClient } from '@services/http';

@Injectable()
export class DatabaseService {

  constructor(private _http: CustomHttpClient) {
  }

  public getList(params): Observable<BackupResponse> {
    return this._http.Get<BackupResponse>(`/backups`, {
      params
    });
  }

  public backup(data: Backup): Observable<any> {
    return this._http.Post(`/backups`, data);
  }

  public restore(id): Observable<any> {
    return this._http.Post(`/backups/restore/${id}`, {});
  }

  public delete(id): Observable<any> {
    return this._http.Delete(`/backups/${id}`);
  }

  public cleanup(month): Observable<any> {
    return this._http.Delete(`/scannedlogs/cleanup/${month}`);
  }

}
