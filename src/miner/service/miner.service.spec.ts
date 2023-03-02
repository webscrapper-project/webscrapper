import { Test, TestingModule } from '@nestjs/testing';
import { MinerService } from './miner.service';

describe('MinerService', () => {
  let service: MinerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinerService],
    }).compile();

    service = module.get<MinerService>(MinerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
