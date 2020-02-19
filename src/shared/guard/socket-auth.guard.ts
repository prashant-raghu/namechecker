import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DateTimeService } from '../service/date-time/date-time.service';
import { AuthKeyService } from '../service/auth-key/auth-key.service';
import {
  WsException,
} from '@nestjs/websockets';

@Injectable()
export class SocketAuthGuard implements CanActivate {

    constructor(private date: DateTimeService, private auth: AuthKeyService){}

    async canActivate(context: ExecutionContext) {
        const client = context.switchToWs().getClient();
        const clientauth = client.request._query.masterkey || 'failedclientauth';
        const serverauth = this.auth.getAuthKey(process.env.masterkey) || 'failedserverauth';
        console.log(serverauth);
        if(serverauth != clientauth)
        throw new WsException('Invalid credentials');
        return serverauth == clientauth;
    }

}
