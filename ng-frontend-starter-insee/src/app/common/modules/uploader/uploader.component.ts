import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { AppConstant } from '../../services';
import { AuthService } from '@services/auth';
import { Util } from '@services/util';
import { Broadcaster, BroadcastKey } from '@modules/share';

@Component({
  selector: 'uploader',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'uploader.template.html',
  styleUrls: [
    'uploader.style.scss'
  ]
})
export class UploaderComponent implements OnInit {
  public files: UploadFile[];
  public uploadInput: EventEmitter<UploadInput>;
  public humanizeBytes: Function;
  public dragOver: boolean;

  @Input() public options: UploaderOptions = {
    concurrency: 1
  };
  @Input() public url: string = '';
  @Input() public buttonText: string = 'COMMON.IMPORT';
  @Input() public buttonClass: string = 'mat-accent';
  @Input() public showIcon: boolean = false;
  @Input() public accept: string = '.csv';
  @Input() public multiple: boolean = false;

  @Output() public onUploaded: EventEmitter<any> = new EventEmitter<any>();

  // private _defaultOptions = {};

  constructor(private _authService: AuthService,
              private _util: Util,
              private _broadcaster: Broadcaster) {

  }

  public ngOnInit(): void {
    // this.options = Object.assign(this._defaultOptions, this.options);
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      this.startUpload();
      this._broadcaster.fire(BroadcastKey.PROGRESSING, true);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // add file to array when added
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    } else if (output.type === 'done' || output.type === 'cancelled') {
      this._broadcaster.fire(BroadcastKey.PROGRESSING, false);
      // todo: filter response
      if (output.file.responseStatus === 400) {
        this.onUploaded.emit(output.file.response);
      } else if (output.file.responseStatus === 200) {
        this.onUploaded.emit(output.file.response);
      } else {
        this.onUploaded.emit(output.file.response);
      }
    }
    this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
  }

  startUpload(): void {
    let url = '';
    if (this.url && this.url.indexOf('/') === 0) {
      url = AppConstant.domain + this.url;
    } else {
      url = AppConstant.domain + '/' + this.url;
    }
    const event: UploadInput = {
      type: 'uploadAll',
      url: url,
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + this._util.getToken().accessToken},  // <----  set headers
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({type: 'cancel', id: id});
  }

  removeFile(id: string): void {
    this.uploadInput.emit({type: 'remove', id: id});
  }

  removeAllFiles(): void {
    this.uploadInput.emit({type: 'removeAll'});
  }

}
