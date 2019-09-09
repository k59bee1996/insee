import {
  Component,
  ViewEncapsulation,
  Input, OnInit, AfterViewInit, ElementRef, ViewChild, Output, EventEmitter, OnDestroy,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import Quagga from 'quagga';

@Component({
  selector: 'quagga-scanner',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'quagga-scanner.template.html',
  styleUrls: ['quagga-scanner.style.scss'],
  animations: fuseAnimations
})
export class QuaggaScannerComponent implements OnInit, OnDestroy, AfterViewInit {
  // Create the QuaggaJS config object for the live stream
  liveStreamConfig = {
    inputStream: {
      type: 'LiveStream',
      constraints: {
        width: { min: 320 },
        height: { min: 480 },
        aspectRatio: { min: 1, max: 100 },
        facingMode: 'environment' // or user
      }
    },
    locator: {
      patchSize: 'medium',
      halfSample: true
    },
    numOfWorkers: 2,
    frequency: 10,
    decoder: {
      readers: [{
        format: 'code_128_reader',
        config: {}
      }]
    },
    locate: true
  };
  // The fallback to the file API requires a different inputStream option.
  // The rest is the same
  fileConfig = Object.assign(
    {},
    this.liveStreamConfig,
    {
      inputStream: {
        size: 800
      }
    }
  );
  @Input() public debug: boolean = false;
  @Output() public onScan: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('viewport') viewport: ElementRef;

  constructor() {
    // empty
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.start();
  }

  ngOnDestroy() {
    this.stop();
  }

  init() {
    const inputStream = Object.assign(this.liveStreamConfig.inputStream, { target: this.viewport.nativeElement });
    this.liveStreamConfig.inputStream = inputStream;
    Quagga.init(
      this.liveStreamConfig,
      function (err) {
        if (err) {
          console.log('Quagga init error: ' + err);
          Quagga.stop();
          return;
        }
        // const track = Quagga.CameraAccess.getActiveTrack();
        // Quagga.CameraAccess.enumerateVideoDevices().then(function(devices) {
        //   alert(JSON.stringify(devices));
        // });
        // alert(JSON.stringify(track.getCapabilities()));
        Quagga.start();
      }
    );
  }

  start() {
    setTimeout(() => {
      this.init();
      // Make sure, QuaggaJS draws frames an lines around possible
      // barcodes on the live stream
      Quagga.onProcessed(function (result) {
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;
        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10), parseInt(drawingCanvas.getAttribute('height'), 10));
            result.boxes.filter(function (box) {
              return box !== result.box;
            }).forEach(function (box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
            });
          }
          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
          }
          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
          }
        } else {
          drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10), parseInt(drawingCanvas.getAttribute('height'), 10));
        }
      });

      // Once a barcode had been read successfully, stop quagga and
      // close the modal after a second to let the user notice where
      // the barcode had actually been found.
      Quagga.onDetected((result) => {
        if (result.codeResult.code) {
          // console.log('RESULT: ', result.codeResult.code);
          this.onScan.emit(result.codeResult.code);
          this.stop();
        }
      });
    });
  }

  stop() {
    if (Quagga) {
      const drawingCtx = Quagga.canvas.ctx.overlay;
      const drawingCanvas = Quagga.canvas.dom.overlay;
      drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10), parseInt(drawingCanvas.getAttribute('height'), 10));
      Quagga.stop();
    }
  }

  decodeSingle(e) {
    if (e.target.files && e.target.files.length) {
      Quagga.decodeSingle(Object.assign({}, this.fileConfig, { src: URL.createObjectURL(e.target.files[0]) }), function (result) {
        alert(result.codeResult.code);
      });
    }
  }

}
