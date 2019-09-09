import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import {
  GenericListComponent,
  ListOptions
} from '@modules/generic-list/generic-list.component';
import {
  FormControl,
  FormGroup
} from '@angular/forms';
import * as moment from 'moment';
import { AppConstant } from '@common/services';
import { LogService } from '@pages/log/log.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { LogDialogComponent } from '@pages/log/detail/log-dialog.component';

@Component({
  selector: 'log-list',
  templateUrl: 'log.component.html',
  styleUrls: ['log.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LogComponent implements OnInit {
  public frm: FormGroup;
  public listOptions: ListOptions;
  public logLevels = [];
  public dialogRef: any;
  public confirmDialogRef: any;
  @ViewChild('genericList') genericList: GenericListComponent;

  constructor(private _logService: LogService,
              private _toastrService: ToastrService,
              private _dialog: MatDialog) {
  }

  ngOnInit() {
    this._logService.getLogLevels().subscribe((resp) => {
      this.logLevels = resp.logLevelList;
    });

    this.frm = new FormGroup({
      logLevelId: new FormControl(''),
      createdFrom: new FormControl(''),
      createdTo: new FormControl(''),
      message: new FormControl(''),
    });
    this.frm.valueChanges.subscribe((data) => {
      const dateFrom = data.createdFrom ? moment(data.createdFrom).format(AppConstant.format.moment.fullDateTime) : '';
      const dateTo = data.createdTo ? moment(data.createdTo).format(AppConstant.format.moment.fullDateTime) : '';
      if (this.listOptions.filterData.createdFrom !== dateFrom || this.listOptions.filterData.createdTo !== dateTo || this.listOptions.filterData.logLevelId !== data.logLevelId) {
        this.listOptions.filterData.createdFrom = dateFrom;
        this.listOptions.filterData.createdTo = dateTo;
        this.listOptions.filterData.logLevelId = data.logLevelId;
        this.genericList.forceDataChange.next(true);
      }
    });
    this.frm.get('message').valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((value) => {
        this.listOptions.filterData.message = value;
        this.genericList.forceDataChange.next(true);
      });

    this.listOptions = {
      getListUrl: '/logs',
      listName: 'logList',
      rowClickable: true,
      hideHistory: true,
      hideEdit: true,
      filterData: {createdFrom: '', createdTo: '', logLevelId: '', message: ''},
      columns: [
        {
          name: 'createdOnUtc',
          title: 'COMMON.TIME',
          type: 'datetime',
        },
        {
          name: 'shortMessage',
          title: 'COMMON.MESSAGE',
        },
        {
          name: 'logLevel',
          title: 'COMMON.LOGLEVEL',
        },
      ]
    };
  }

  rowClick(data) {
    this.dialogRef = this._dialog.open(LogDialogComponent, {
      autoFocus: false,
      disableClose: false,
      // width: '600px'
    });
    this.dialogRef.componentInstance.id = data.id;
    this.dialogRef.afterClosed().subscribe(result => {
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
        this._logService.delete(id).subscribe((resp) => {
          this._toastrService.success('Success');
          this.genericList.forceDataChange.next(true);
        });
      }
      this.confirmDialogRef = null;
    });
  }
}
