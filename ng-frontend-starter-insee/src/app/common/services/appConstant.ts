import {
  Injectable
} from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class AppConstant {
  public static domain = environment.domain;
  public static clientId = 'a868cec2-5c40-4a90-b473-672f097e1695';
  public static clientSecret = '58ba131b-009e-4e77-98a1-9f570bd1dd89';
  public static pattern = {
    email: '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
    whiteSpace: '^\\S+(?: \\S+)*$',
    pin: '[0-9][0-9][0-9][0-9]',
    alphabet: '^[a-z A-Z]*$',
    ipAddress: '^(([01]?[0-9]?[0-9]|2[0-5][0-5])\\.){3}([01]?[0-9]?[0-9]|2[0-5][0-5])$',
    biggerZero: '^[1-9][0-9]*$'
  };
  public static format = {
    pipe: {
      fullDate: 'dd/MM/yyyy',
      fullDateTime: 'dd/MM/yyyy HH:mm:ss'
    },
    moment: {
      fullDate: 'YYYY-MM-DD',
      fullDateTime: 'YYYY-MM-DDTHH:mm:ss', // this format use to save db
      pipe: 'DD/MMM/YYYY HH:mm:ss',
    }
  };
}
