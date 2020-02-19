import { Injectable } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { HelperService } from '../../../shared/service/helper/helper.service';
import { AjaxcallService } from '../../../shared/service/ajaxcall/ajaxcall.service';
@Injectable()
export class YoutubeService {
    constructor(private help: HelperService, private api: AjaxcallService){}
    platformname = 'youtube';
    youtube = {
        regex: `^[a-zA-Z0-9_]{1,15}$`,
        endpoint: function(username) {
          return `https://www.youtube.com/channel/${username}`;
        },
        color: '#b2071d',
        icon: {
          web: 'youtube',
          mobile: 'youtube'
        }
      };

    // handler returning observable for making request to Youtube api and check availability
    checkYoutube$(username: string):Observable<any>{
      if(!this.help.regexmatcher(username,this.youtube.regex)){
        let result = 
        this.help.responsebuilder(`${this.platformname}`, `social`, `warning`,`username-invalid`, `Username is invalid as ${this.platformname} regex did not match`, this.youtube);
        return of(result);
      }
      return this.api.handler('GET',this.youtube.endpoint(username),{},{})
      .pipe(
        mergeMap(res => {
          if(res.status == 200){
            let result = 
            this.help.responsebuilder(`${this.platformname}`, `social`, `success`,`username-unavailable`, `Username is unavailable as ${this.platformname}.com returned 200`, this.youtube);
            return of(result);
          }
          else if (res.status == 404) {
            let result = 
            this.help.responsebuilder(`${this.platformname}`, `social`, `success`,`username-available`, `Username is available as ${this.platformname} returned 404`, this.youtube);
            return of(result);
          }
          else {
            let result = 
            this.help.responsebuilder(`${this.platformname}`, `social`, `failed`,`username-unavailable`, `Username is unavailable as ${this.platformname} returned an http exception`, this.youtube);
            return of(result);
          }
        }),
        catchError(error => {
            let result = 
            this.help.responsebuilder(`${this.platformname}`, `social`, `failed`,`username-unavailable`, `Username is unavailable as ${this.platformname} returned an http exception`, this.youtube);
            return of(result);
        })
      );
    }
}