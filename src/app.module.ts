import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocialsearchModule } from './socialsearch/socialsearch.module';
import { DateTimeService } from './shared/service/date-time/date-time.service';
import { AuthKeyService } from './shared/service/auth-key/auth-key.service';
import { SearchGateway } from './gateway/search.gateway';
import { DomainsearchModule } from './domainsearch/domainsearch.module';
import { AjaxcallService } from './shared/service/ajaxcall/ajaxcall.service';
import { HelperModule } from './shared/service/helper/helper.module';

@Module({
  imports: [SocialsearchModule, DomainsearchModule, HelperModule],
  controllers: [AppController],
  providers: [AppService, DateTimeService, AuthKeyService, SearchGateway, AjaxcallService]
})
export class AppModule {}