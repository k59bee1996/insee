import {
  Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation
} from '@angular/core';
import * as QRCode from 'qrcode';
// import printJS from 'print-js/src/index';

@Component({
  selector: 'qr-code',
  templateUrl: 'qr-code.component.html',
  styleUrls: ['qr-code.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QrCodeComponent implements OnInit, OnChanges {
  public canvasSize: number = 250;
  @Input() public qRcode: string;
  @Input() public name: string;
  @ViewChild('qrcanvas') canvas: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['qRcode']) {
      const value = changes['qRcode'].currentValue;
      if (value) {
        QRCode.toCanvas(this.canvas.nativeElement, value, {
          width: this.canvasSize,
          height: this.canvasSize,
          margin: 1,
          color: {
            dark: '#222', // dots
            light: '#eee' // background
          }
        }, (error) => {
          this.canvas.nativeElement.hidden = false;
          if (error) {
            console.error(error);
            this.canvas.nativeElement.hidden = true;
          }
        });
      } else {
        this.canvas.nativeElement.hidden = true;
      }
    }
  }

  printQrCode() {
    // console.log(this.canvas);
    // printJS({
    //   printable: this.canvas.nativeElement.toDataURL(),
    //   type: 'image',
    //   header: this.name || '',
    //   headerStyle: 'text-align: center',
    //   imageStyle: 'width:50%;margin-left:auto;margin-right:auto'
    // });
  }
}
