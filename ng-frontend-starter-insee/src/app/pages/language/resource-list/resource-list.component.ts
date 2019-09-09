import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { of as observableOf } from 'rxjs/observable/of';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../language.service';
import { ResourceResponse } from '../language.model';
import { Subject } from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';
import { ResourceDialogComponent } from '../resource-dialog/resource-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'resource-list',
  templateUrl: 'resource-list.component.html',
  styleUrls: [],
  animations: fuseAnimations
})
export class ResourceListComponent implements OnInit, OnDestroy {
  public id;
  public name: string = '';
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = ['resourceName', 'resourceValue', 'button2'];
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
              private _activatedRoute: ActivatedRoute,
              private _dialog: MatDialog) {
  }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.paginator.pageIndex = 0;
        this.onDataChanged.next(this.id);
        this._languageService.getDetail(this.id).subscribe((resp) => this.name = resp.name, (err) => {
          this._router.navigate(['pages', 'configs', 'language', 'list']);
        });
      } else {
        this._router.navigate(['pages', 'configs', 'language', 'list']);
      }
    });
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
            id: this.id,
            pageIndex: (this.paginator.pageIndex || 0) + 1,
            pageSize: this.paginator.pageSize || 25,
            textSearch: this.filter.nativeElement.value || '',
          };
          if (this.sort.active && this.sort.direction) {
            params.sortField = this.sort.active;
            params.orderDescending = this.sort.direction === 'desc' ? 'true' : 'false';
          }
          return this._languageService.getResources(params);
        }),
        map((data: ResourceResponse) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.total;
          return data.localStringResourceList;
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
    this.dialogRef = this._dialog.open(ResourceDialogComponent, {
      autoFocus: false,
      disableClose: false,
      width: '500px'
    });
    this.dialogRef.componentInstance.id = 0;
    this.dialogRef.componentInstance.localizationId = this.id;
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDataChanged.next(result);
      }
      this.dialogRef = null;
    });
  }

  edit(id) {
    this.dialogRef = this._dialog.open(ResourceDialogComponent, {
      autoFocus: false,
      disableClose: false,
      width: '500px'
    });
    this.dialogRef.componentInstance.id = id;
    this.dialogRef.componentInstance.localizationId = this.id;
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
        this._languageService.deleteResource(id).subscribe((resp) => {
          this._toastrService.success('Success');
          this.onDataChanged.next(resp);
        });
      }
      this.confirmDialogRef = null;
    });
  }

  import(event) {
    if (event.result === 'Error') {
      this._toastrService.error(event.errorMessages && event.errorMessages[0] || 'Import failed.');
    } else if (event.result === 'Success') {
      this._toastrService.success('Import successful.');
      setTimeout(() => {
        this.onDataChanged.next(true);
      }, 1000);
    }
  }
}
