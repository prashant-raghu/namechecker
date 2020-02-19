import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import XMLHttpRequest from 'xhr2';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable()
export class AjaxcallService {
    constructor(){

    }
    handler(Method, endPoint, Headers, Body): Observable<any> {
        let options = {};
        options['createXHR'] = function () {
            return new XMLHttpRequest();
        };
        options['method'] = Method;
        options['url']= endPoint;
        if(Headers){
            options['headers'] = Headers;
        }
        if(Body && Method != 'GET'){
            options['body'] = Body;
        }

        const api$ = ajax(options).pipe(
          //  map(response => console.log('response: ', response)),
            catchError(error => {
           //   console.log('error: ', error);
              return of(error);
            })
          );
        return api$;
    }
}

