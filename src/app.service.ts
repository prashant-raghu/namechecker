import { Injectable } from '@nestjs/common';
import { AjaxcallService } from './shared/service/ajaxcall/ajaxcall.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(private api: AjaxcallService) {}
  getHello(reqObj): Observable<any> {
    let browser = reqObj.headers['user-agent'];
    let IPAddress = reqObj.ip;
    return this.api
      .handler('GET', `http://ip-api.com/json/${IPAddress}`, {}, {})
      .pipe(map(data =>{
        return `
        Access Denied. 
        Caution: Please, do not proceed. System will track your info if you choose to proceed.
        
        Your Info:
        Browser : ${browser},
        IP Address: ${IPAddress},
        Location: ${data.response.city},${data.response.country}
        
        `;
      }))
  }
}
