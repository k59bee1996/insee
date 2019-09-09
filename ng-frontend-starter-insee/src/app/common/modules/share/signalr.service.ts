import {
  Inject,
  Injectable,
  InjectionToken,
  Optional,
  isDevMode
} from '@angular/core';
import {
  BroadcastEventListener,
  ISignalRConnection,
  SignalR,
  SignalRConnection
} from 'ng2-signalr';
import { Resolve } from '@angular/router';

// Create the injection token for the service
export const CONNECTION_RESOLVER = new InjectionToken('CONNECTION_RESOLVER');

@Injectable()
export class ConnectionResolver implements Resolve<SignalRConnection> {
  private _eventListener: BroadcastEventListener<any>;
  private _connection: ISignalRConnection;
  private _status: string;

  constructor(private _signalR: SignalR,
              @Inject(CONNECTION_RESOLVER) @Optional() connection) {
    if (connection) {
      this._connection = connection;
    } else {
      // create signalR connection
      this._connection = this._signalR.createConnection();
    }
    this._connection.status.subscribe((s) => {
      this._status = s.name;
      console.warn(s.name);
    });
    this._connection.errors.subscribe((err) => {
      console.warn(err);
    });
  }

  resolve() {
    if (isDevMode()) {
      console.log('ConnectionResolver. Resolving...');
    }
    if (!this._status || this._status === 'disconnected') {
      return this._connection.start();
    } else {
      return new Promise((resolve) => resolve(this._connection));
    }
  }

  get eventListener() {
    return this._eventListener;
  }

  set eventListener(event) {
    this._eventListener = event;
  }

  get connection() {
    return this._connection;
  }

  set connection(c) {
    this._connection = c;
  }

}
