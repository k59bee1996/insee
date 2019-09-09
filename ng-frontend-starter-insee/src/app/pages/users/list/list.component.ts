import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { of as observableOf } from 'rxjs/observable/of';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { UserResponse } from '../../../common/models/users.model';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'user-list',
  templateUrl: 'list.component.html',
  styleUrls: [],
  animations: fuseAnimations
})
export class UserListComponent implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = ['username', 'fullName', 'email', 'userRoles', 'active', 'button2'];
  public resultsLength = 0;
  public isLoadingResults = true;
  public onDataChanged: Subject<any> = new Subject();
  public dataSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _usersService: UsersService,
              private _toastrService: ToastrService,
              private _router: Router) {
  }

  ngOnInit() {
    const searchEvent = Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(500)
      .distinctUntilChanged();
    // If the user changes the sort order or search, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    searchEvent.subscribe(() => this.paginator.pageIndex = 0);
    this.onDataChanged.subscribe(() => this.paginator.pageIndex = 0);
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
          return this._usersService.getList(params);
        }),
        map((data: UserResponse) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.total;
          return data.users;
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
    this._router.navigate(['pages', 'user-management', 'users', 'new']);
  }

  edit(id) {
    this._router.navigate(['pages', 'user-management', 'users', 'detail', id]);
  }

  history(id) {
    this._router.navigate(['pages', 'user-management', 'users', 'history', id]);
  }

  import(event) {
    if (event.result === 'Error') {
      this._toastrService.error(event.errorMessages && event.errorMessages[0] || 'Import failed.');
    } else if (event.result === 'Success') {
      this._toastrService.success('Import successful.');
      this.onDataChanged.next(event);
    }
  }

}
