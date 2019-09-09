import { Component, ElementRef, HostBinding, Inject, OnDestroy, Renderer2, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Subscription } from 'rxjs/Subscription';

import { FuseConfigService } from '@fuse/services/config.service';
import { Broadcaster, BroadcastKey } from '@modules/share';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';

@Component({
    selector     : 'fuse-main',
    templateUrl  : './main.component.html',
    styleUrls    : ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseMainComponent implements OnDestroy
{
    onConfigChanged: Subscription;
    broadcastEvent: Subscription;
    fuseSettings: any;
    @HostBinding('attr.fuse-layout-mode') layoutMode;

    constructor(
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private _broadcaster: Broadcaster,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private fuseConfig: FuseConfigService,
        private platform: Platform,
        @Inject(DOCUMENT) private document: any
    )
    {
        this.onConfigChanged =
            this.fuseConfig.onConfigChanged
                .subscribe(
                    (newSettings) => {
                        this.fuseSettings = newSettings;
                        this.layoutMode = this.fuseSettings.layout.mode;
                    }
                );

        if ( this.platform.ANDROID || this.platform.IOS )
        {
            this.document.body.className += ' is-mobile';
        }
        this.broadcastEvent = this._broadcaster.on(BroadcastKey.PROGRESSING).subscribe((event) => {
          if (event) {
            this._fuseSplashScreenService.show('0.5');
          } else {
            this._fuseSplashScreenService.hide();
          }
        });
    }

    ngOnDestroy()
    {
        this.onConfigChanged.unsubscribe();
        if (this.broadcastEvent) {
          this.broadcastEvent.unsubscribe();
        }
    }

    addClass(className: string)
    {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    removeClass(className: string)
    {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
}
