import {
  Component,
  ViewEncapsulation,
  Input, OnInit,
} from '@angular/core';

import { Router } from '@angular/router';
import { History } from './history-page.model';
import { HistoryService } from './history-page.service';
import { MatTableDataSource } from '@angular/material';
import { Location } from '@angular/common';

@Component({
  selector: 'history-page',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'history-page.template.html',
  styleUrls: ['history-page.style.scss']
})
export class HistoryPageComponent implements OnInit {
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = ['field', 'originalValue', 'newValue'];
  public historyList: History[] = [];

  @Input() public historyId: string = '';
  @Input() public historyName: string = '';
  @Input() public historyTitle: string = '';
  @Input() public backUrl: string = '';

  constructor(private location: Location,
              private _router: Router,
              private _historyService: HistoryService) {
    // empty
  }

  ngOnInit() {
    this._historyService.getHistorys(this.historyName, this.historyId).subscribe((resp) => {
      this.historyList = resp.historyList;
      this.dataSource.data = this.historyList;
    }, (err) => {
      this.dataSource.data = [];
      this.back();
    });
  }

  public back() {
    if (this.backUrl) {
      this._router.navigateByUrl(this.backUrl);
    } else {
      this.location.back();
    }
  }
}
