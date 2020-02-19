import { Module } from '@nestjs/common';
import { DomainsearchService } from './domainsearch.service';
import { DnsService } from './dns/dns.service';
import { ApiService } from './api/api.service';
import { AjaxcallService } from '../shared/service/ajaxcall/ajaxcall.service';
import { HelperService } from '../shared/service/helper/helper.service';
import { HelperModule } from '../shared/service/helper/helper.module';

@Module({
  imports: [HelperModule],
  providers: [DomainsearchService, DnsService, ApiService, AjaxcallService],
  exports: [DomainsearchService]
})
export class DomainsearchModule {}