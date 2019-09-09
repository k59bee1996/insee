import { ModuleWithProviders, NgModule } from '@angular/core';
import { Broadcaster } from './broadcaster.service';
import { CONNECTION_RESOLVER, ConnectionResolver } from '@modules/share/signalr.service';
import { ISignalRConnection } from 'ng2-signalr';

/**
 * User's idle module.
 */
@NgModule({
  providers: [
    Broadcaster,
    ConnectionResolver
  ]
})
export class ShareModule {
  static forRoot(signalrConnection: ISignalRConnection): ModuleWithProviders {
    return {
      ngModule: ShareModule,
      providers: [
        {provide: CONNECTION_RESOLVER, useValue: signalrConnection}
      ]
    };
  }
}
