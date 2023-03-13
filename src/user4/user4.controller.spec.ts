import { Test, TestingModule } from '@nestjs/testing';
import { User4Controller } from './user4.controller';
import { User4Service } from './user4.service';

describe('User4Controller', () => {
  let controller: User4Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [User4Controller],
      providers: [User4Service],
    }).compile();

    controller = module.get<User4Controller>(User4Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
