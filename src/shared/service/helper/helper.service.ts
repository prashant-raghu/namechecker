import { Injectable, Logger } from '@nestjs/common';
import NodeCache from 'node-cache';

@Injectable()
export class HelperService {
    cacheinstance;

    constructor(){
        this.cacheinstance = new NodeCache({stdTTL: 600});
    }

    cache(){
        return this.cacheinstance;
    }

    cacheset(key, obj){
        this.cacheinstance.set(key, obj);
    }

    cacheget(key){
        return this.cacheinstance.get(key);
    }

    regexmatcher(username:string, reg:string): boolean{
        var regex = new RegExp(reg) 
        return regex.test(username);
    }
    responsebuilder(platform, event, type, code, detail, obj={}){
        Logger.log(obj);
        let result;
        if(Object.entries(obj).length === 0 && obj.constructor === Object)
        result = {
            platform,
            event,
            type,
            msg: {
                code: code,
                detail: detail
            }
        };
        else 
        result = {
            platform,
            event,
            type,
            msg: {
                code: code,
                detail: detail
            },
            icon: {
                mobile: obj['icon']['mobile'],
                web: obj['icon']['web'],
            },
            color: obj['color']
        };
        return result;
    }
}
