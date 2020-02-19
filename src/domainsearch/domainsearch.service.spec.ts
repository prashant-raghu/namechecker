import { Test, TestingModule } from '@nestjs/testing';
import { DomainsearchService } from './domainsearch.service';

describe('DomainsearchService', () => {
  let service: DomainsearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomainsearchService],
    }).compile();

    service = module.get<DomainsearchService>(DomainsearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
