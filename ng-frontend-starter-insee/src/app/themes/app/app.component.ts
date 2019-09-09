import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigationModel } from 'app/navigation/navigation';
import { AuthService } from '@services/auth';
import { Language } from '@common/models/CommonConstant';

@Component({
  selector: 'fuse-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private translate: TranslateService,
              private fuseNavigationService: FuseNavigationService,
              private fuseSplashScreen: FuseSplashScreenService,
              private fuseTranslationLoader: FuseTranslationLoaderService,
              private _authService: AuthService) {
    // Add languages
    this.translate.addLangs([Language.English.id, Language.VietNam.id]);

    // Set the default language
    this.translate.setDefaultLang(Language.VietNam.id);

    // Use a language
    this.translate.use('vi');

    this.fuseNavigationService.setNavigationModel(new FuseNavigationModel(this._authService, this.translate).model);
  }
}
