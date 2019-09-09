import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AuthService } from '@services/auth';
import { UserIdleService } from '@modules/user-idle';
import { ISignalRConnection } from 'ng2-signalr';
import {
  Broadcaster, BroadcastKey,
  // ConnectionResolver
} from '@modules/share';

@Component({
  selector: 'pages',
  template: '<router-outlet></router-outlet>',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {
  title = 'pages';

  private _connection: ISignalRConnection;

  constructor(private _authService: AuthService,
              // private _connectionResolver: ConnectionResolver,
              private _broadcaster: Broadcaster,
              private _userIdle: UserIdleService) {
  }

  ngOnInit() {
    // Start watching for user inactivity.
    this._userIdle.startWatching();

    // Start watching when user idle is starting.
    this._userIdle.onTimerStart().subscribe(count => console.log(count));

    // Start watch when time is up.
    this._userIdle.onTimeout().subscribe(() => this._authService.logout());

    // SignalR
    // this._connectionResolver.resolve().then((c) => {
    //   this._connection = c;
    //   this._connection.listenFor(BroadcastKey.NOTIFICATIONS).subscribe((data: any) => {
    //     // console.log('data', data);
    //     this._broadcaster.fire(BroadcastKey.NOTIFICATIONS, data);
    //   });
    // }).catch((e) => {
    //   console.warn(e);
    // });
  }

  ngOnDestroy() {
    this._userIdle.stopWatching();
    if (this._connection) {
      this._connection.stop();
    }
  }
}
