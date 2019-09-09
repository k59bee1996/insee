import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { pageRoutes } from './routes';
import { PagesComponent } from '@pages/pages.component';
import { UserIdleModule } from '@modules/user-idle';
import { SignalRConfiguration, SignalRModule } from 'ng2-signalr';
import { AppConstant } from '@services/index';

export function createConfig(): SignalRConfiguration {
  const c = new SignalRConfiguration();
  c.hubName = 'notificationHub';
  c.url = AppConstant.domain;
  c.logging = true;
  // >= v5.0.0
  c.executeEventsInZone = true; // optional, default is true
  c.executeErrorsInZone = false; // optional, default is false
  c.executeStatusChangeInZone = true; // optional, default is true
  return c;
}

@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    RouterModule.forChild(pageRoutes),
    // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
    // Default values: `idle` is 900 (15 minutes), `timeout` is 60 (1 minute)
    // and `ping` is 30 (30 seconds).
    UserIdleModule.forRoot({ idle: 900, timeout: 60, ping: 30 }),
    SignalRModule.forRoot(createConfig),
  ]
})
export class PageModule {
}
