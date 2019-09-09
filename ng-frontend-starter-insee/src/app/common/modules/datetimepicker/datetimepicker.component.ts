import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
import { TimeModel } from './datetimepicker.model';
import { MAT_DATE_FORMATS } from '@angular/material';
import { DATETIME_FORMATS } from '@fuse/material.module';

// creates an ngModel accessor to be used in components providers
const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatetimepickerComponent),
  multi: true
};

@Component({
  selector: 'datetime-picker',
  styleUrls: ['./datetimepicker.component.scss'],
  templateUrl: './datetimepicker.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    {provide: MAT_DATE_FORMATS, useValue: DATETIME_FORMATS},
  ],
})

export class DatetimepickerComponent implements ControlValueAccessor, OnInit {

  @Input() public options: any;
  @Input() public placeholder: string = 'Select date';

  private _value: any = '';
  private _time: TimeModel;
  private _defaultOptions: any = {
    color: 'primary',
  };

  constructor() {
  }

  ngOnInit() {
    this.options = Object.assign({}, this._defaultOptions, this.options);
    this.time = this.value ? this.getTimeByDate(this.value) : new TimeModel();
  }

  clearDate() {
    this.value = '';
    this.time = new TimeModel();
  }

  timeChange(event: TimeModel) {
    if (this.value) {
      this.value = this.convertDateTime(this.value, event);
    }
  }

  dateChange(event) {
    // if (event.value) {
    //   this._value = this.convertDateTime(event.value, this.time);
    // }
  }

  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v ? this.convertDateTime(v, this.time) : '';
      this.onChange(this._value);
    }
  }

  get time(): TimeModel {
    return this._time;
  }

  set time(v: TimeModel) {
    this._time = v;
  }

  writeValue(value: any) {
    this._value = value;
    this.time = this._value ? this.getTimeByDate(this._value) : new TimeModel();
    this.onChange(value);
  }

  onChange = (_) => {
  }

  onTouched = () => {
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  convertDateTime(date, time: TimeModel) {
    date = moment(date).startOf('d');
    time = new TimeModel(time);
    date.add(time.getHourByFormat(), 'h').add(time.minute, 'm');
    return date;
  }

  getTimeByDate(date): TimeModel {
    date = moment(date);
    const meriden = date.format('A');
    let hour = date.get('h');
    // for 12h format
    if (meriden === 'AM' && hour === 0) {
      hour = 12;
    } else if (meriden === 'PM' && hour > 12) {
      hour = hour - 12;
    }
    return new TimeModel({
      hour,
      minute: date.get('m'),
      meriden,
      format: 12,
    });
  }
}
