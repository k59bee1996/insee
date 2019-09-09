import {
  Component,
  OnInit
} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Backup } from '../database.model';
import { DatabaseService } from '../database.service';
import { BaseComponent } from '@modules/base/base.component';

@Component({
  selector: 'database-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: []
})
export class DatabaseDialogComponent extends BaseComponent implements OnInit {
  public data: Backup = new Backup();
  public saveOb: Observable<any>;
  public frm: FormGroup;
  public controlConfig = {
    name: new FormControl('', [Validators.required]),
  };
  public formErrors = {
    name: '',
  };
  public validationMessages = {
    name: {
      required: 'Backup name is required.',
    },
  };

  constructor(public dialogRef: MatDialogRef<DatabaseDialogComponent>,
              private _databaseService: DatabaseService,
              private _toastrService: ToastrService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  save() {
    const data = Object.assign({}, this.data, this.frm.getRawValue());
    data.name = data.name.trim();
    this.saveOb = this._databaseService.backup(data).share();
    this.saveOb.subscribe(() => {
      this._toastrService.success('Success');
      this.dialogRef.close(true);
    }, (err) => {
      this.dialogRef.close(false);
    });
  }

}
