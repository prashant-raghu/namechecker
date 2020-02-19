import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';
  import { UseGuards, Logger, CacheKey, CacheInterceptor, UseInterceptors} from '@nestjs/common';
  import { from, Observable, merge, of, Subject } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { Client, Server } from 'socket.io';
  import { exec } from 'child_process';
  import { SocialsearchService } from '../socialsearch/socialsearch.service';
  import { DomainsearchService } from '../domainsearch/domainsearch.service';
  import { DateTimeService } from '../shared/service/date-time/date-time.service';
  import { SocketAuthGuard} from '../shared/guard/socket-auth.guard';
  import { HelperService } from '../shared/service/helper/helper.service';
  @UseGuards(SocketAuthGuard)
  @WebSocketGateway()
  export class SearchGateway {
    constructor(private social:SocialsearchService, private date: DateTimeService, private domain: DomainsearchService,
      private help: HelperService ){}
    @WebSocketServer()
    server: Server;
    client: Client;
    users:number = 0;
    
    async handleConnection(client: any, ...args: any[]){
      this.users++;
    }
  
    async handleDisconnect(client: any, ...args: any[]){
      this.users--;
    }
  
    @SubscribeMessage('search-social')
    handleSocial(client: Client, data: any): Observable<WsResponse<any>> {
      const event = 'search-social';
      Logger.log(data);
      try {
      return merge(this.social.handler(data.username))
      .pipe(map(data => ({ event, data })));
      }
      catch(r) {
        console.log(r);
        let result = of({
          platform: ``,
          event: "social",
          type: "failed",
          msg: {
          code: "server error",
          detail: "something went wrong"
          }
        });
      return of(result).pipe(map(data => ({ event, data })));
        };
    }
    
    @SubscribeMessage('search-domain')
    handleDomain(client: Client, data: any): Observable<WsResponse<any>>{
      var cached = this.help.cacheget(data.username) || {};
  
      const event = 'search-domain';
      Logger.log(cached);
      if(cached['domain']) {
        const subject = new Subject<any>();
        if(data['extension'][0] == 'all')data['extension'] = this.domain.domains;
        if(cached['domain']['checkedFor'] == 'all'  && cached['domain']['isAvailableOn']){
          let res = [];
          console.log(data);
           for(let domain of data['extension']){
            if(cached['domain']['isAvailableOn'].indexOf(domain) != -1)
              {
                console.log(domain);
                let result = 
                {
                  platform: `${domain}`,
                  event: "domain",
                  type: "success",
                  fromCache: "yes",
                  msg: {
                      code: "username-available",
                      detail: "Username is available as domain"
                  }
              };
              res.push(result);
              }
            else{
              let result = {
                platform: `${domain}`,
                event: "domain",
                type: "success",
                fromCache: "yes",
                msg: {
                    code: "username-unavailable",
                    detail: "Username is unavailable as domain"
                }
              };
              res.push(result);
              }
           }
           var len = data['extension'].length || 0;
           Logger.log('done using cache');
           subject.complete();
           return from(res).pipe(map(data => ({ event, data })));
        }
      }
      try{
      let res = merge(this.domain.handler(data.username, data.extension))
      .pipe(map(data => ({ event, data })));
      if(data.extension[0] == 'all')
        this.domain.cacher(data.username, res);
      Logger.log('done without using cache');
      return res;
      }
      catch(r){
        let result = of({
          platform: ``,
          event: "domain",
          type: "failed",
          msg: {
          code: "server error",
          detail: "something went wrong"
          }
        });
      return of(result).pipe(map(data => ({ event, data })))
        };
    }
  }