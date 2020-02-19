import { Injectable } from '@nestjs/common';
import moment from 'moment';
import crypto from 'crypto';
import { DateTimeService } from '../date-time/date-time.service';
@Injectable()
export class AuthKeyService {
    constructor(private date: DateTimeService){}
    getAuthKey(masterkey: string){
        let d = this.date.getDate('DMMYY');
        console.log(d);
        var key = `${masterkey}-${d}`;
        let hash = crypto.createHash('sha256').update(key).digest('hex');
        return hash;
    }
}
