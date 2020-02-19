import { Injectable } from '@nestjs/common';
import { Observable, concat } from 'rxjs';
import { DnsService } from './dns/dns.service';
import { ApiService } from './api/api.service';
import { HelperService } from '../shared/service/helper/helper.service';

@Injectable()
export class DomainsearchService {
   domains = ['org', 'com', 'io', 'me', 'net', 'co'];
   constructor(private dns: DnsService, private apidomain: ApiService,private help: HelperService ){}
    //domain search handler function return observable
   handler$(username:string, extension: any[]):Observable<any> {
       if(extension[0] != 'all')this.domains = extension;
       return this.dns.handler$(username, this.domains);
    }
    //redundant cacher function not being used in v1
    cacher(username: string, data: Observable<any>){
        try{
            let domainarr = [];
            data.subscribe((obj)=>{
                obj = obj['data'];
                var cache = this.help.cacheget(username) || {username:{},domain:{}};
                if(obj['msg']['code'] == 'username-available'){
                   domainarr.push(obj.platform);
                   cache['domain']['isAvailableOn'] = domainarr;
                   cache['domain']['checkedFor'] = 'all';
                   this.help.cacheset(username,cache);
               }
            });
        }
        catch(e){
            console.log(e);
        }
    }
}