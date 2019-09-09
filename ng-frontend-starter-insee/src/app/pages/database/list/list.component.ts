import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { of as observableOf } from 'rxjs/observable/of';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { BackupResponse } from '../database.model';
import { Subject } from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';
import { DatabaseDialogComponent } from '../dialog/dialog.component';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from '@services/auth';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AppConstant } from '@common/services';
import { Broadcaster, BroadcastKey } from '@modules/share';

@Component({
  selector: 'database-list',
  templateUrl: 'list.component.html',
  styleUrls: [],
  animations: fuseAnimations
})
export class DatabaseListComponent implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = ['name', 'createdOn', 'createdBy', 'button2'];
  public resultsLength = 0;
  public isLoadingResults = true;
  public pipe = AppConstant.format.pipe;
  public confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  public dialogRef: any;
  public onDataChanged: Subject<any> = new Subject();
  public dataSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _databaseService: DatabaseService,
              private _toastrService: ToastrService,
              private _authService: AuthService,
              private _broadcaster: Broadcaster,
              private _router: Router,
              private _dialog: MatDialog) {
  }

  ngOnInit() {
    this.dataSubscription = Observable.merge(this.paginator.page, this.onDataChanged)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const params: any = {
            pageIndex: (this.paginator.pageIndex || 0) + 1,
            pageSize: this.paginator.pageSize || 10,
          };
          return this._databaseService.getList(params);
        }),
        map((data: BackupResponse) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.total;
          return data.backupList;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  backup() {
    this.dialogRef = this._dialog.open(DatabaseDialogComponent, {
      autoFocus: false,
      disableClose: true,
      hasBackdrop: true,
      width: '500px'
    });
    this.dialogRef.componentInstance.id = 0;
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDataChanged.next(result);
      }
      this.dialogRef = null;
    });
  }

  restore(data) {
    this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = `Are you sure you want to restore backup: "${data.name}" ? 
      Created On: ${moment(data.createdOn).format(AppConstant.format.moment.fullDateTime)} 
      Created By: ${data.createdBy}`;
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._broadcaster.fire(BroadcastKey.PROGRESSING, true);
        this._databaseService.restore(data.id).subscribe((resp) => {
          this._toastrService.success('Success');
          this._broadcaster.fire(BroadcastKey.PROGRESSING, false);
          this._authService.logout();
        }, (err) => {
          this._broadcaster.fire(BroadcastKey.PROGRESSING, false);
        });
      }
      this.confirmDialogRef = null;
    });
  }

  delete(id) {
    this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._databaseService.delete(id).subscribe((resp) => {
          this._toastrService.success('Success');
          this.onDataChanged.next(resp);
        });
      }
      this.confirmDialogRef = null;
    });
  }

  cleanup(month: number) {
    this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to cleanup scanned log data?' +
      '\nYou should backup data before confirm cleanup.';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._databaseService.cleanup(month).subscribe((resp) => {
          this._toastrService.success('Success');
          // this.onDataChanged.next(resp);
        });
      }
      this.confirmDialogRef = null;
    });
  }
}
