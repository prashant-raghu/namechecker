import { Injectable } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { HelperService } from '../../../shared/service/helper/helper.service';
import { AjaxcallService } from '../../../shared/service/ajaxcall/ajaxcall.service';
@Injectable()
export class TwitterService {
    constructor(private help: HelperService, private api: AjaxcallService){}
    platformname = 'twitter';
    twitter = {
        regex: `^[a-zA-Z0-9_]{1,15}$`,
        endpoint: function(username) {
          return `https://twitter.com/${username}`;
        },
        color: '#00acee',
        icon: {
          web: 'twitter',
          mobile: 'twitter'
        }
      };

    // handler returning observable for making request to twitter api and check availability
    checkTwitter$(username: string):Observable<any>{
      if(!this.help.regexmatcher(username,this.twitter.regex)){
        console.log('regex issue');
        let result = 
        this.help.responsebuilder(`${this.platformname}`, `social`, `warning`,`username-invalid`, `Username is invalid as ${this.platformname} regex did not match`, this.twitter);
        return of(result);
      }
      return this.api.handler('GET',this.twitter.endpoint(username),{},{})
      .pipe(
        mergeMap(res => {
          if(res.status == 200){
            let result = 
            this.help.responsebuilder(`${this.platformname}`, `social`, `success`,`username-unavailable`, `Username is unavailable as ${this.platformname}.com returned 200`, this.twitter);
            return of(result);
          }
          else if (res.status == 404) {
            let result = 
            this.help.responsebuilder(`${this.platformname}`, `social`, `success`,`username-available`, `Username is available as ${this.platformname} returned 404`, this.twitter);
            return of(result);
          }
          else {
            let result = 
            this.help.responsebuilder(`${this.platformname}`, `social`, `failed`,`username-unavailable`, `Username is unavailable as ${this.platformname} returned an http exception`, this.twitter);
            return of(result);
          }
        }),
        catchError(error => {
            let result = 
            this.help.responsebuilder(`${this.platformname}`, `social`, `failed`,`username-unavailable`, `Username is unavailable as ${this.platformname} returned an http exception`, this.twitter);
            return of(result);
        })
      );
    }
}