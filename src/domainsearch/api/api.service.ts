import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, flatMap,  } from 'rxjs/operators';
import { getPublicSuffix } from 'tldjs';
import { HelperService } from '../../shared/service/helper/helper.service';
import { AjaxcallService } from '../../shared/service/ajaxcall/ajaxcall.service';

@Injectable()
export class ApiService {
    endpoint = 'https://api.godaddy.com/v1/domains/available';
    header = {
        "Content-Type": "application/json",
        "Authorization":  `sso-key ${process.env.godaddykey}:${process.env.godaddysecret}`
    };

    constructor(private api: AjaxcallService, private help: HelperService) { }
    // handler returning observable for making request to godaddy api
    handler$(username: string, domains: any[]): Observable<any> {
        let body = domains.map(function (x) {
            return `${username}.${x}`;
        });
        return this.api.handler('POST', this.endpoint, this.header, body).pipe(flatMap(x => x.response.domains),map(x => {
            let tld = getPublicSuffix (x['domain']);
            if(!tld){
                let result =
                this.help.responsebuilder(`${tld}`, "domain", "failed","username-unavailable", "domain has no tld specified", {});
                return result;
            }
            
            else if(x['available'] == true){
                let result =
                this.help.responsebuilder(`${tld}`, "domain", "success","username-available", "Username is available as domain", {});
                return result;
            }
            
            let result =
            this.help.responsebuilder(`${tld}`, "domain", "success","username-unavailable", "Username is unavailable as domain", {});
            return result;
        }));
    }
}
