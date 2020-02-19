import { Module } from '@nestjs/common';
import { SocialsearchService } from './socialsearch.service';
import { TwitterService } from './platforms/twitter/twitter.service';
import { FacebookService } from './platforms/facebook/facebook.service';
import { DateTimeService } from '../shared/service/date-time/date-time.service';
import { AuthKeyService } from '../shared/service/auth-key/auth-key.service';
import { HelperService } from '../shared/service/helper/helper.service';
import { InstagramService } from './platforms/instagram/instagram.service';
import { YoutubeService } from './platforms/youtube/youtube.service';
import { AjaxcallService } from '../shared/service/ajaxcall/ajaxcall.service'
@Module({
  providers: [ TwitterService, FacebookService,AjaxcallService, YoutubeService,
     DateTimeService, AuthKeyService, SocialsearchService, HelperService, InstagramService],
  exports: [SocialsearchService]
})
export class SocialsearchModule {}
