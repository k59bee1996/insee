import { ITime, TimeFormat } from '../material-time-control/time-control';

export class TimeModel implements ITime {
  hour: number;
  minute: number;
  meriden: 'PM' | 'AM';
  format: TimeFormat;

  constructor(time?) {
    time = time || {};
    this.hour = time.hour || 12;
    this.minute = time.minute || 0;
    this.meriden = time.meriden || 'AM';
    this.format = time.format || 12;
  }

  getHourByFormat(): number {
    let h = this.hour;
    if (this.format === 12) {
      if (this.meriden === 'PM') {
        if (this.hour < 12) {
          h = this.hour + 12;
        }
      } else {
        if (this.hour === 12) {
          h = 0;
        }
      }
    } else {
      // TODO: test if time format = 24
    }
    return h;
  }
}
