import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AppConstant } from '@common/services';

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {
  public imageBinary: string;
  public imageUrl: string;
  public domain: string = AppConstant.domain + '/';

  constructor(public dialogRef: MatDialogRef<ImageDialogComponent>) {
  }

  ngOnInit() {

  }

}
