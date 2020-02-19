import { Injectable } from '@nestjs/common';

import { of, Observable } from 'rxjs';
@Injectable()
export class FacebookService {
    constructor(){
       // console.log(config);
    }
    fb = {
        regex: '',
        endpoint: function(username) {
          return `http://graph.facebook.com/v3.3/${username}`;
        },
      };
    handler():Observable<string>{
        return of('1','2','3','4','5');
    }
}
