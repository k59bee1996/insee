import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ResourceModel } from '../language.model';
import { LanguageService } from '../language.service';
import { BaseComponent } from '@modules/base/base.component';

@Component({
  selector: 'resource-dialog',
  templateUrl: './resource-dialog.component.html',
  styleUrls: []
})
export class ResourceDialogComponent extends BaseComponent implements OnInit {
  public id: number;
  public localizationId: string;
  public data: ResourceModel = new ResourceModel();
  public saveOb: Observable<any>;
  public frm: FormGroup;
  public controlConfig = {
    resourceName: new FormControl('', [
      Validators.required
    ]),
    resourceValue: new FormControl('', [
      Validators.required
    ]),
  };
  public formErrors = {
    resourceName: '',
    resourceValue: ''
  };
  public validationMessages = {
    resourceName: {
      required: 'Resource name is required.',
    },
    resourceValue: {
      required: 'Resource value is required.',
    }
  };

  constructor(public dialogRef: MatDialogRef<ResourceDialogComponent>,
              private _languageService: LanguageService,
              private _toastrService: ToastrService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.id) {
      this._languageService.getResource(this.id).subscribe((resp) => {
        this.data = new ResourceModel(resp);
        this.frm.patchValue(this.data);
      }, (err) => {
        this.dialogRef.close(false);
      });
    }
  }

  save() {
    const data = Object.assign({}, this.data, this.frm.getRawValue());
    data.resourceName = data.resourceName.trim();
    data.resourceValue = data.resourceValue.trim();
    data.languageId = this.localizationId;
    if (this.id) {
      this.saveOb = this._languageService.updateResource(data).share();
    } else {
      this.saveOb = this._languageService.createResource(data).share();
    }
    this.saveOb.subscribe(() => {
      this._toastrService.success('Success');
      this.dialogRef.close(true);
    }, (err) => {
      this.dialogRef.close(false);
    });

  }

}
