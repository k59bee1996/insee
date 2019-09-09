import {
  Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation
} from '@angular/core';
import * as QRCode from 'qrcode';
// import printJS from 'print-js/src/index';
import { Subscription } from 'rxjs/Subscription';
import { TypeBarcode } from '@common/models/CommonConstant';


@Component({
  selector: 'print-qr-code',
  templateUrl: 'print-qr-code.component.html',
  styleUrls: ['print-qr-code.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PrintQrCodeComponent implements OnInit, OnChanges, OnDestroy {
  public dataSubscription: Subscription;
  public barcodeInfo = [];
  public barcodeWidth: number;
  public barcodeType: number;
  @Input() public data: { name: string, barcode: string }[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      const value = changes['data'].currentValue;
      // check value
    }
  }

  async print(qrCodes, width?, type?) {
    this.barcodeWidth = width || 300;
    this.barcodeType = type;
    if (qrCodes) {
      this.data = [...qrCodes];
    }
    if (!this.data || !this.data.length) {
      return;
    }
    this.barcodeInfo = [];
    const start = async () => {
      await Promise.all(this.data.map(async code => {
        const url = await QRCode.toDataURL(code.barcode + '');
        this.barcodeInfo.push({
          url,
          name: code.name,
          barcode: type === TypeBarcode.Pallet ? 'Pallet ' + code.barcode : code.barcode
        });
      }));
    };
    await start();
  }

  onDomChange(event, isLast) {
    if (isLast && this.barcodeInfo.length > 0) {
      setTimeout(() => {
        // printJS({
        //   printable: 'printJS-qrcode',
        //   type: 'html',
        //   style:
        //   '.barcodeWrapper {margin-bottom: 30px} ' +
        //   '.text-center-printed { text-align: center; margin-top: -20px; font-size: ' +
        //   (this.barcodeType === TypeBarcode.Location ? '48' : '26') + 'px}'
        // });
      }, 1000);
    }
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

}
