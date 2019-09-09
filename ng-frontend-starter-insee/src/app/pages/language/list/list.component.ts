import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { of as observableOf } from 'rxjs/observable/of';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { Router } from '@angular/router';
import { LanguageService } from '../language.service';
import { LanguageResponse } from '../language.model';
import { Subject } from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';
import { LanguageDialogComponent } from '../language-dialog/language-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'language-list',
  templateUrl: 'list.component.html',
  styleUrls: [],
  animations: fuseAnimations
})
export class LanguageListComponent implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = ['name', 'languageCulture', 'active', 'button3'];
  public resultsLength = 0;
  public isLoadingResults = true;
  public confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  public dialogRef: any;
  public onDataChanged: Subject<any> = new Subject();
  public dataSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _languageService: LanguageService,
              private _toastrService: ToastrService,
              private _router: Router,
              private _dialog: MatDialog) {
  }

  ngOnInit() {
    const searchEvent = Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(500)
      .distinctUntilChanged();
    // If the user changes the sort order or search, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    searchEvent.subscribe(() => this.paginator.pageIndex = 0);
    this.dataSubscription = Observable.merge(this.sort.sortChange, this.paginator.page, searchEvent, this.onDataChanged)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const params: any = {
            pageIndex: (this.paginator.pageIndex || 0) + 1,
            pageSize: this.paginator.pageSize || 10,
            textSearch: this.filter.nativeElement.value || '',
          };
          if (this.sort.active && this.sort.direction) {
            params.sortField = this.sort.active;
            params.orderDescending = this.sort.direction === 'desc' ? 'true' : 'false';
          }
          return this._languageService.getList(params);
        }),
        map((data: LanguageResponse) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.total;
          return data.languageList;
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

  add() {
    this.dialogRef = this._dialog.open(LanguageDialogComponent, {
      autoFocus: false,
      disableClose: false,
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

  edit(id) {
    this.dialogRef = this._dialog.open(LanguageDialogComponent, {
      autoFocus: false,
      disableClose: false,
      width: '500px'
    });
    this.dialogRef.componentInstance.id = id;
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDataChanged.next(result);
      }
      this.dialogRef = null;
    });
  }

  delete(id) {
    this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._languageService.delete(id).subscribe((resp) => {
          this._toastrService.success('Success');
          this.onDataChanged.next(resp);
        });
      }
      this.confirmDialogRef = null;
    });
  }

  manage(id) {
    this._router.navigate(['pages', 'configs', 'language', 'manage', id]);
  }
}
