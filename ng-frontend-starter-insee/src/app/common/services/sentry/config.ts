import * as Raven from 'raven-js';
declare const VARS: any;

// If SENTRY_DNS defined, then enable sentry error handler
if (VARS.SENTRY_DNS) {
  Raven
    .config(VARS.SENTRY_DNS, {
      release: VARS.VERSION,
      environment: VARS.ENV
    })
    .install();
}
