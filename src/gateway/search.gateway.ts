import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { UseGuards, Logger } from '@nestjs/common';
import { Observable, of } from 'rxjs';
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
    Logger.log('user joined');
  }

  async handleDisconnect(client: any, ...args: any[]){
    this.users--;
    Logger.log('user left');
  }

  @SubscribeMessage('search-social')
  handleSocial(client: Client, data: any): Observable<WsResponse<any>> {
    const event = 'search-social';
    Logger.log(data);
    try {
    return this.social.handler$(data.username)
    .pipe(map(data => ({ event, data })));
    }
    catch(r) {
      console.log(r);
      let result = this.help.responsebuilder(``, "social", "failed","server error", "something went wrong", {});
      return of(result).pipe(map(data => ({ event, data })));
      };
  }
  
  @SubscribeMessage('search-domain')
  handleDomain(client: Client, data: any): Observable<WsResponse<any>>{
    const event = 'search-domain';
    try{
    let res = this.domain.handler$(data.username, data.extension)
    .pipe(map(data => ({ event, data })));
    return res;
    }
    catch(r){
      let result = this.help.responsebuilder(``, "domain", "failed","server error", "something went wrong", {});
      return of(result).pipe(map(data => ({ event, data })))
      };
  }
}