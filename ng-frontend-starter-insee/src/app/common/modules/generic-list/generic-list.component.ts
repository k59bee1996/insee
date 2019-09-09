import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSort,
  MatTableDataSource
} from '@angular/material';
import { AppConstant } from '../../services';
import { CustomHttpClient } from '@services/http';
import { ImageDialogComponent } from '@modules/generic-list/image-dialog/image-dialog.component';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import {
  map,
  switchMap,
  startWith,
  catchError
} from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

export interface ListOptions {
  data?: any[];
  getListUrl?: string;
  method?: string; // GET (default), POST
  listName: string;
  pagination?: boolean; // default true
  actionButtons?: string; // '' (not display) or 'button1', 'button2', 'button3' (class to fix action column width)
  extraButton?: { icon: string, name: string };
  rowClickable?: boolean; // default false
  hideEdit?: boolean; // default false, show this
  hideDelete?: boolean; // default false, show this
  hideHistory?: boolean; // default false, show this
  filterData?: { [key: string]: string | number; };
  sortIdDesc?: boolean; // default false, if true sort ID by desc
  columns: {
    name: string,
    sortName?: string, // if not define, use name as sortName
    title: string, // display title, can input key to translate
    type?: string, // text(default), translate, date, datetime, boolean, status, image_sm, image_url, image_binary, attribute, link, dropdown
    dropdown?: {id: number, name: string}[],
    ordering?: boolean, // default false
    orderingDefault?: string, // default undefined or 'desc', 'asc'
    responsive?: boolean, // default false
  }[];
}

@Component({
  selector: 'generic-list',
  templateUrl: 'generic-list.component.html',
  styleUrls: ['generic-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericListComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() public options: ListOptions;
  @Input() public tableClass: string = '';
  @Input() public confirmMessage: string;
  @Input() public total: string;
  @Input() public dataBody: any;
  public displayedColumns: string[] = [];

  public dataSource = new MatTableDataSource();
  public resultsLength = 0;
  public isLoadingResults = true;
  public pipe = AppConstant.format.pipe;
  public domain = AppConstant.domain + '/';
  public forceDataChange: Subject<any> = new Subject();
  public dataSubscription: Subscription;
  public dialogRef: any;

  @Output() public onEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onHistory: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onDataChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onRowClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onExtraClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onSelectionChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(private _http: CustomHttpClient,
              private _cd: ChangeDetectorRef,
              private _dialog: MatDialog) {
  }

  ngOnInit() {
    this.options = Object.assign({
      getListUrl: undefined,
      listName: '',
      method: 'GET',
      pagination: true,
      hideEdit: false,
      hideDelete: false,
      hideHistory: false,
      filterData: {},
      columns: []
    }, this.options);

    // auto set action buttons
    if (!this.options.actionButtons) {
      const num = [this.options.hideDelete, this.options.hideEdit, this.options.hideHistory, !this.options.extraButton].reduce((total, cur) => {
        if (!cur) {
          total++;
        }
        return total;
      }, 0);
      if (num) {
        this.options.actionButtons = 'button' + num;
      }
    }

    if (this.options.actionButtons) {
      this.displayedColumns = this.options.columns.map((c) => c.name).concat(this.options.actionButtons);
    } else {
      this.displayedColumns = this.options.columns.map((c) => c.name);
    }

    // find and set default sorting
    const sortingDefCol = this.options.columns.find((c) => !!c.orderingDefault);
    if (sortingDefCol) {
      this.sort.active = sortingDefCol.sortName || sortingDefCol.name;
      if (sortingDefCol.orderingDefault === 'desc') {
        this.sort.direction = 'desc';
      } else {
        this.sort.direction = 'asc';
      }
    }

    this.dataSubscription = Observable.merge(this.sort.sortChange, this.paginator.page, this.forceDataChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this._cd.markForCheck();
          const params: any = {};
          if (this.options.pagination) {
            params.pageIndex = (this.paginator.pageIndex || 0) + 1;
            params.pageSize = this.paginator.pageSize || 25;
          }
          if (this.sort.active && this.sort.direction) {
            const column = this.options.columns.find(c => c.name === this.sort.active);
            params.sortField = column ? column.sortName ? column.sortName : column.name : this.sort.active;
            params.orderDescending = this.sort.direction === 'desc' ? 'true' : 'false';
          } else if (this.options.sortIdDesc) {
            params.sortField = 'id';
            params.orderDescending = 'true';
          }
          for (const key of Object.keys(this.options.filterData)) {
            if (this.options.filterData[key] === 0 || this.options.filterData[key]) {
              params[key] = this.options.filterData[key];
            }
          }
          if (this.options.getListUrl) {

            // server side
            if (this.options.method === 'POST') {
              return this._http.Post(this.options.getListUrl, this.dataBody);
            } else {
              return this._http.Get(this.options.getListUrl, {
                params
              });
            }

          } else if (this.options.data) {
            // client side
            const obj = {};
            obj[this.options.listName] = [...this.options.data];
            // sort client
            if (params.sortField) {
              obj[this.options.listName].sort((a, b) => {
                if (typeof a[params.sortField] === 'string' && typeof b[params.sortField] === 'string') {
                  const textA = a[params.sortField].toUpperCase();
                  const textB = b[params.sortField].toUpperCase();
                  if (params.orderDescending === 'true') {
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                  } else {
                    return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
                  }
                } else if (typeof a[params.sortField] === 'number' && typeof b[params.sortField] === 'number') {
                  if (params.orderDescending === 'true') {
                    return (a[params.sortField] < b[params.sortField]) ? -1 : (a[params.sortField] > b[params.sortField]) ? 1 : 0;
                  } else {
                    return (a[params.sortField] < b[params.sortField]) ? 1 : (a[params.sortField] > b[params.sortField]) ? -1 : 0;
                  }
                }
                return 0;
              });
            }
            return Observable.of(obj);
          }
          return Observable.of({});
        }),
        map((resp: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = this.options.pagination ? resp.total || 0 : 0;
          return resp[this.options.listName] || [];
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return Observable.of([]);
        })
      ).subscribe(list => {
        this.dataSource.data = list;
        this.onDataChanged.emit(list);
        this._cd.markForCheck();
      });

  }

  ngAfterViewInit() {
    // If the user changes the sort order or search, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.forceDataChange.subscribe((isResetPage) => {
      if (isResetPage) {
        this.paginator.pageIndex = 0;
      }
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  openImageDialog(data, type) {
    this.dialogRef = this._dialog.open(ImageDialogComponent, {
      autoFocus: false,
      disableClose: false,
      width: '500px'
    });
    if (type === 'image_binary') {
      this.dialogRef.componentInstance.imageBinary = data;
    }
    if (type === 'image_url') {
      this.dialogRef.componentInstance.imageUrl = data;
    }
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
  }

  clickHistory(id) {
    this.onHistory.emit(id);
  }

  clickEdit(data) {
    this.onEdit.emit(data);
  }

  clickDelete(id) {
    if (this.confirmMessage) {
      this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
        disableClose: false,
        autoFocus: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = this.confirmMessage;

      this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            this.onDelete.emit(id);
          }
          this.confirmDialogRef = null;
        });
    } else {
      this.onDelete.emit(id);
    }
  }

  clickRow(data) {
    if (!this.options.rowClickable) {
      return;
    } else {
      this.onRowClick.emit(data);
    }
  }

  clickLink(data) {
    this.onRowClick.emit(data);
  }

  clickExtraButton(data) {
    if (this.options.extraButton) {
      this.onExtraClick.emit(data);
    }
  }

  selectionChange(data, event) {
    this.onSelectionChange.emit({data, event});
  }

  getStatusColor(status) {
    let color = '';
    if (status === 'New' || status === 'Pending' || status === 'RECEIVED') {
      color = 'mat-accent-100-bg';
    } else if (status === 'Processing' || status === 'OUT_STOCK') {
      color = 'mat-orange-100-bg';
    } else if (status === 'Done' || status === 'Completed' || status === 'DELIVERED') {
      color = 'mat-green-100-bg';
    } else if (status === 'Fail' || status === 'IN_STOCK') {
      color = 'mat-warn-100-bg';
    } else {
      color = 'mat-light-blue-100-bg';
    }
    return color;
  }
}
