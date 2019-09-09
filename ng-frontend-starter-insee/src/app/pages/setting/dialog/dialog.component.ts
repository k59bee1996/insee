import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Setting } from '../setting.model';
import { SettingService} from '../setting.service';
import { BaseComponent } from '@modules/base/base.component';

@Component({
  selector: 'setting-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: []
})
export class SettingDialogComponent extends BaseComponent implements OnInit {
  public id: string;
  public data: Setting = new Setting();
  public saveOb: Observable<any>;
  public frm: FormGroup;
  public controlConfig = {
    name: new FormControl('', [      Validators.required    ]),
    value: new FormControl('', [      Validators.required    ]),
  };
  public formErrors = {
    name: '',
    value: ''
  };
  public validationMessages = {
    name: {
      required: 'Setting name is required.',
    },
    value: {
      required: 'Setting value is required.',
    }
  };

  constructor(public dialogRef: MatDialogRef<SettingDialogComponent>,
              private _settingService: SettingService,
              private _toastrService: ToastrService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.id) {
      this._settingService.getDetail(this.id).subscribe((resp) => {
        this.data = new Setting(resp);
        this.frm.patchValue(this.data);
      }, (err) => {
        this.dialogRef.close(false);
      });
    }
  }

  save() {
    const data = Object.assign({}, this.data, this.frm.getRawValue());
    data.name = data.name.trim();
    data.value = data.value.trim();
    if (this.id) {
      this.saveOb = this._settingService.update(data).share();
    } else {
      this.saveOb = this._settingService.create(data).share();
    }
    this.saveOb.subscribe(() => {
      this._toastrService.success('Success');
      this.dialogRef.close(data);
    }, (err) => {
      this.dialogRef.close(false);
    });

  }

}
