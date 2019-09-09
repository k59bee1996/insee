import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy} from './custom-reuse-strategy';
import { RouterService } from './router.service';
import { RouteUtilService } from './route-util.service';
import { RouterLinkOptionsDirective } from './router-link-options.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    RouterLinkOptionsDirective
  ],
  exports: [
    RouterLinkOptionsDirective
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    RouteUtilService,
    RouterService,
  ]
})
export class RouteCachingModule { }
