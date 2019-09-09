import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LanguageModel } from '../language.model';
import { LanguageService } from '../language.service';
import { BaseComponent } from '@modules/base/base.component';
import { ValidateNumber } from '@common/validators/number.validator';

@Component({
  selector: 'language-dialog',
  templateUrl: './language-dialog.component.html',
  styleUrls: []
})
export class LanguageDialogComponent extends BaseComponent implements OnInit {
  public id: string;
  public data: LanguageModel = new LanguageModel();
  public saveOb: Observable<any>;
  public frm: FormGroup;
  public controlConfig = {
    name: new FormControl('', [Validators.required]),
    languageCulture: new FormControl('', [Validators.required]),
    flagImageFileName: new FormControl(''),
    isActive: new FormControl(true),
    displayOrder: new FormControl(0, ValidateNumber(0)),
  };
  public formErrors = {
    name: '',
    languageCulture: '',
    displayOrder: ''
  };
  public validationMessages = {
    name: {
      required: 'Language name is required.',
    },
    languageCulture: {
      required: 'Code is required.',
    },
    displayOrder: {
      number: 'Must be positive number.',
      range: 'Must be positive number.',
    }
  };

  constructor(public dialogRef: MatDialogRef<LanguageDialogComponent>,
              private _languageService: LanguageService,
              private _toastrService: ToastrService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.id) {
      this._languageService.getDetail(this.id).subscribe((resp) => {
        this.data = new LanguageModel(resp);
        this.frm.patchValue(this.data);
      }, (err) => {
        this.dialogRef.close(false);
      });
    }
  }

  save() {
    const data = Object.assign({}, this.data, this.frm.getRawValue());
    data.name = data.name.trim();
    data.languageCulture = data.languageCulture.trim();
    data.displayOrder = data.displayOrder || 0;
    if (this.id) {
      this.saveOb = this._languageService.update(data).share();
    } else {
      this.saveOb = this._languageService.create(data).share();
    }
    this.saveOb.subscribe(() => {
      this._toastrService.success('Success');
      this.dialogRef.close(true);
    }, (err) => {
      this.dialogRef.close(false);
    });

  }

}
