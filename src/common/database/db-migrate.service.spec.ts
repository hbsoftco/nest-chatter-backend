import { Test, TestingModule } from '@nestjs/testing';
import { DbMigrateService } from './db-migrate.service';

describe('DbMigrateService', () => {
  let service: DbMigrateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbMigrateService],
    }).compile();

    service = module.get<DbMigrateService>(DbMigrateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
