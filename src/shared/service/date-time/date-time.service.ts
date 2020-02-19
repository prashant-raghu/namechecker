import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';

@Injectable()
export class DateTimeService {

    getDate(f: string = ''){
        var ret = moment().utc().format(f);
        Logger.log(ret);
        return ret;
    }
}