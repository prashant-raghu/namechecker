import { Injectable } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { HelperService } from '../../../shared/service/helper/helper.service';
import { AjaxcallService } from '../../../shared/service/ajaxcall/ajaxcall.service';

@Injectable()
export class InstagramService {
    constructor(private help: HelperService, private api: AjaxcallService){}
    platformname = 'instagram';
    instagram = {
        regex: `^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$`,
        endpoint: function(username) {
          return `https://www.instagram.com/${username}`;
        },
        color: '#3f729b',
        icon: {
          web: 'instagram',
          mobile: 'instagram'
        }
      };

    // handler returning observable for making request to instagram api and check availability
    checkInstagram$(username: string):Observable<any>{
      if(!this.help.regexmatcher(username,this.instagram.regex)){
        let result =
        this.help.responsebuilder(`${this.platformname}`, "social", "warning","username-invalid", `Username is invalid as ${this.platformname} regex did not match`, this.instagram);
        return of(result);
      }
      return this.api.handler('GET',this.instagram.endpoint(username),{},{})
      .pipe(
        mergeMap(res => {
          if(res.status == 200){
            let result =
            this.help.responsebuilder(`${this.platformname}`, "social", "success","username-unavailable", `Username is unavailable as ${this.platformname} returned 200`, this.instagram);
            return of(result);
          }
          else if (res.status == 404) {
            let result = 
            this.help.responsebuilder(`${this.platformname}`, `social`, `success`,`username-available`, `Username is available as ${this.platformname} returned 404`, this.instagram);
            return of(result);
          }
          else {
            let result = 
            this.help.responsebuilder(`${this.platformname}`, `social`, `failed`,`username-unavailable`, `Username is unavailable as ${this.platformname} returned an http exception`, this.instagram);
            return of(result);
          }
        }),
        catchError(error => {
            let result = 
            this.help.responsebuilder(`${this.platformname}`, "social", "failed","username-unavailable", `Username is unavailable as ${this.platformname} returned an http exception`, this.instagram);
            return of(result);
        })
      );
    }
}
