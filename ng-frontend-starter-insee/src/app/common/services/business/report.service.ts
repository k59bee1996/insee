import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { CustomHttpClient } from '@services/http';

@Injectable()
export class ReportService {

  constructor(private _http: CustomHttpClient) {
  }

  public fetchExportData(params) {
    const queryParams = new HttpParams({fromObject: params});
    return this._http.Get('/reports/Export', {
      params: queryParams
    });
  }

  public fetchChartInfo(date?) {
    if (date) {
      return this._http.Get(`/dashboards?date=${date}`);
    }
    return this._http.Get('/dashboards');
  }

  public getTotalPrice(data) {
    if (data.length === 0) {
      return 0;
    }
    return data.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price;
    }, 0);
  }

  public convertPrice(price) {
    // convert string to array
    const myArray = price.toString().split('');
    const sub = Math.floor(myArray.length / 3);

    for (let i = 1; i <= sub; i++) {
      myArray.splice(-3 * i + (1 - i), 0, '.');
    }

    if (myArray[0] === '.') {
      myArray.splice(0, 1);
    }
    return myArray.join('');
  }
}
