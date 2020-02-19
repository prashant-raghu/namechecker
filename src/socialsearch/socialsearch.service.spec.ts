import { Test, TestingModule } from '@nestjs/testing';
import { SocialsearchService } from './socialsearch.service';

describe('SocialsearchService', () => {
  let service: SocialsearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialsearchService],
    }).compile();

    service = module.get<SocialsearchService>(SocialsearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
