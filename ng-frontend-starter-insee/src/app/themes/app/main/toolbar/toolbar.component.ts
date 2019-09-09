import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthService } from '@services/auth';
import { User } from '@common/models/users.model';
import { Language } from '@common/models/CommonConstant';

@Component({
  selector: 'fuse-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class FuseToolbarComponent implements OnDestroy {
  userStatusOptions: any[];
  languages: any;
  selectedLanguage: any;
  showLoadingBar: boolean;
  horizontalNav: boolean;
  noNav: boolean;
  currentUser: User = new User();
  isSidebarFold: boolean = true;

  constructor(private router: Router,
              private fuseConfig: FuseConfigService,
              private sidebarService: FuseSidebarService,
              private translate: TranslateService,
              private _authService: AuthService) {
    this.userStatusOptions = [
      {
        'title': 'Online',
        'icon': 'icon-checkbox-marked-circle',
        'color': '#4CAF50'
      },
      {
        'title': 'Away',
        'icon': 'icon-clock',
        'color': '#FFC107'
      },
      {
        'title': 'Do not Disturb',
        'icon': 'icon-minus-circle',
        'color': '#F44336'
      },
      {
        'title': 'Invisible',
        'icon': 'icon-checkbox-blank-circle-outline',
        'color': '#BDBDBD'
      },
      {
        'title': 'Offline',
        'icon': 'icon-checkbox-blank-circle-outline',
        'color': '#616161'
      }
    ];

    this.languages = Object.values(Language);

    this.selectedLanguage = this.languages[1];

    router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          this.showLoadingBar = true;
        }
        if (event instanceof NavigationEnd) {
          this.showLoadingBar = false;
        }
      });

    this.fuseConfig.onConfigChanged.subscribe((settings) => {
      this.horizontalNav = settings.layout.navigation === 'top';
      this.noNav = settings.layout.navigation === 'none';
    });

    this.currentUser = this._authService.currentUser;

    this.sidebarService.onSidebarToggle.subscribe((value) => {
      this.isSidebarFold = value;
    });

  }

  toggleSidebarOpened(key) {
    this.sidebarService.getSidebar(key).toggleOpen();
  }

  search(value) {
    // Do your search here...
    console.log(value);
  }

  setLanguage(lang) {
    // Set the selected language for toolbar
    this.selectedLanguage = lang;

    // Use the selected language for translations
    this.translate.use(lang.id);
  }

  logout() {
    this._authService.logout();
  }

  profile() {
    this.router.navigateByUrl('pages/profile');
  }

  ngOnDestroy() {

  }
}
