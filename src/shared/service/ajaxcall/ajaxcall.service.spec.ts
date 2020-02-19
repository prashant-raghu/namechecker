import { Test, TestingModule } from '@nestjs/testing';
import { AjaxcallService } from './ajaxcall.service';

describe('AjaxcallService', () => {
  let service: AjaxcallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AjaxcallService],
    }).compile();

    service = module.get<AjaxcallService>(AjaxcallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
