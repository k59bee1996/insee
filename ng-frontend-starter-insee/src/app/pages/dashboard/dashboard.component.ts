import {
  AfterViewInit,
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Broadcaster, BroadcastKey } from '@modules/share';
import { MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  public sidebarServiceWatcher: Subscription;
  public confirmDialogRef: any;

  constructor(private fuseSidebarService: FuseSidebarService,
              private _dialog: MatDialog,
              private _broadcaster: Broadcaster) {
  }

  public ngOnInit() {
    this.initData();
    this.sidebarServiceWatcher = this.fuseSidebarService.onSidebarToggle.subscribe(() => {
      setTimeout(() => {
        // UPDATE CHART
      }, 500);
    });
  }

  public ngAfterViewInit() {

  }

  public ngOnDestroy() {
    if (this.sidebarServiceWatcher) {
      this.sidebarServiceWatcher.unsubscribe();
    }
  }

  public testLoading() {
    this._broadcaster.fire(BroadcastKey.PROGRESSING, true);
    setTimeout(() => {
      this._broadcaster.fire(BroadcastKey.PROGRESSING, false);
    }, 1500);
  }

  public openDialog() {
    this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
      autoFocus: false,
      disableClose: false,
      // width: '600px'
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.confirmDialogRef = null;
    });
  }

  private initData() {
    // call server, get data
  }

}
