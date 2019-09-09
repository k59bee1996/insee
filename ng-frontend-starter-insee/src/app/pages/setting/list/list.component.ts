import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { SettingService } from '../setting.service';
import { ToastrService } from 'ngx-toastr';
import { SettingDialogComponent } from '../dialog/dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { GenericListComponent, ListOptions } from '@modules/generic-list/generic-list.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'setting-list',
  templateUrl: 'list.component.html',
  styleUrls: [],
  animations: fuseAnimations
})
export class SettingListComponent implements OnInit {
  public dialogRef: any;
  public listOptions: ListOptions;
  public confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  @ViewChild('filterName') filterName: ElementRef;
  @ViewChild('filterValue') filterValue: ElementRef;
  @ViewChild('genericList') genericList: GenericListComponent;

  constructor(private _settingService: SettingService,
              private _toastrService: ToastrService,
              private _router: Router,
              private _dialog: MatDialog) {
  }

  ngOnInit() {
    this.listOptions = {
      getListUrl: '/settings',
      listName: 'settingList',
      hideDelete: true,
      hideEdit: true,
      rowClickable: true,
      hideHistory: true,
      filterData: { name: '', value: '' },
      columns: [
        {
          name: 'name',
          title: 'SETTING.NAME',
          type: 'text',
          ordering: true,
        },
        {
          name: 'value',
          title: 'SETTING.VALUE',
          type: 'text',
          ordering: true,
        }
      ]
    };
    const filterNameEvent = Observable.fromEvent(this.filterName.nativeElement, 'keyup')
      .debounceTime(500)
      .distinctUntilChanged();
    filterNameEvent.subscribe((e: any) => {
      this.listOptions.filterData.name = e.target.value;
      this.genericList.forceDataChange.next(true);
    });
    const filterValueEvent = Observable.fromEvent(this.filterValue.nativeElement, 'keyup')
      .debounceTime(500)
      .distinctUntilChanged();
    filterValueEvent.subscribe((e: any) => {
      this.listOptions.filterData.value = e.target.value;
      this.genericList.forceDataChange.next(true);
    });
  }

  add() {
    this.dialogRef = this._dialog.open(SettingDialogComponent, {
      autoFocus: false,
      disableClose: false,
      width: '500px'
    });
    this.dialogRef.componentInstance.id = 0;
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.genericList.add(result);
        this.genericList.forceDataChange.next(true);
      }
      this.dialogRef = null;
    });
  }

  edit(data) {
    this.dialogRef = this._dialog.open(SettingDialogComponent, {
      autoFocus: false,
      disableClose: false,
      width: '500px'
    });
    this.dialogRef.componentInstance.id = data.id;
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.genericList.edit(result);
        this.genericList.forceDataChange.next(false);
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
        this._settingService.delete(id).subscribe((resp) => {
          this._toastrService.success('Success');
          this.genericList.forceDataChange.next(true);
        });
      }
      this.confirmDialogRef = null;
    });
  }

}
