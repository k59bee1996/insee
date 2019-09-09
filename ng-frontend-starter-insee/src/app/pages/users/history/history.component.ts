import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'user-history',
  encapsulation: ViewEncapsulation.None,
  template: `
    <history-page [historyId]="id" [historyName]="entityName" [backUrl]="backUrl"></history-page>`,
  styleUrls: []
})
export class UserHistoryComponent implements OnInit {
  public id;
  public entityName: string = 'User';
  public backUrl: string = 'pages/user-management/users/list';

  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute) {
    // empty
  }

  public ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (!this.id) {
        this._router.navigateByUrl(this.backUrl);
      }
    });
  }

}
