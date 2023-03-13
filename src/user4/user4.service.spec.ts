import { Test, TestingModule } from '@nestjs/testing';
import { User4Service } from './user4.service';

describe('User4Service', () => {
  let service: User4Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [User4Service],
    }).compile();

    service = module.get<User4Service>(User4Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
