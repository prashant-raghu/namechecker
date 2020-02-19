import { Injectable } from '@nestjs/common';
import dns from 'dns';
import { Observable, Subject, of } from 'rxjs';
import {take, mergeAll} from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { HelperService } from '../../shared/service/helper/helper.service';
@Injectable()
export class DnsService {
    constructor(private apidomain: ApiService, private help: HelperService) { }
    // handler returning observable for dns resolving
    handler$(username: string, domains: any[]): Observable<any> {
        let len = domains.length;
        let doublecheck = [];
        const subject = new Subject<any>();
        var j = 0;
        for (let i = 0; i < domains.length; i++) {
            dns.lookup(`${username}.${domains[i]}`, (err, address, family) => {
                j++;
                if (!address) {
                    doublecheck.push(domains[i]);
                }
                else {
                    let result = this.help.responsebuilder(`${domains[i]}`, "domain", "success","username-unavailable", "Username is unavailable as domain", {});
                    subject.next(of(result));
                }
                if(j == domains.length){
                    if(doublecheck.length != 0)
                    subject.next(this.apidomain.handler$(username,doublecheck));
                    subject.complete();
                }
            });
        }
        return subject.asObservable().pipe((take(len+1)), mergeAll());
    }
}