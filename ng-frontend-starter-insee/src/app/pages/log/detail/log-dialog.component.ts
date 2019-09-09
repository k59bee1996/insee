import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { BaseComponent } from '@modules/base/base.component';
import { ValidateNumber } from '@common/validators/number.validator';
import { AppConstant } from '@common/services';
import { LogModel } from '../log.model';
import { LogService } from '../log.service';

@Component({
  selector: 'log-dialog',
  templateUrl: './log-dialog.component.html',
  styleUrls: []
})
export class LogDialogComponent implements OnInit {
  public id: number;
  public data: LogModel = new LogModel();
  public pipe = AppConstant.format.pipe;

  constructor(public dialogRef: MatDialogRef<LogDialogComponent>,
              private _logService: LogService) {
  }

  ngOnInit() {
    if (this.id) {
      this._logService.getDetail(this.id).subscribe((resp) => {
        this.data = new LogModel(resp);
      }, (err) => {
        this.dialogRef.close(false);
      });
    }
  }

}
