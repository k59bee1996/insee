import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {
  filter,
  map,
  takeUntil
} from 'rxjs/operators';

interface BroadcastEvent {
  key: any;
  data?: any;
}

export const BroadcastKey = {
  PROGRESSING: 'Progressing',
  UPLOADING: 'Uploading',
  PROFILE: 'Profile',
  LOGS: 'Logs',
  NOTIFICATIONS: 'notifications'
};

@Injectable()
export class Broadcaster {
  private _eventBus: BehaviorSubject<BroadcastEvent>;

  private destroy$: Subject<void> = new Subject<void>();

  constructor() {
    this._eventBus = new BehaviorSubject<BroadcastEvent>({key: ''});
  }

  public fire(key: any, data?: any) {
    this._eventBus.next({key, data});
  }

  public on<T>(key: any): Observable<T> {
    return this._eventBus.asObservable().pipe(
      filter((event) => event.key === key),
      takeUntil(this.destroy$),
      map((event) => <T>event.data)
    );
  }

  public unsubscribeAll() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
