import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../../core/enums/roles';

describe('UserService', () => {
  let service: UserService;
  
  const mockUserRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllAdmins', () => {
    it('should return users with ADMIN role', async () => {
      const admins = [{ id: '1', role: Role.ADMIN }];
      mockUserRepository.find.mockResolvedValue(admins);

      const result = await service.findAllAdmins();
      expect(result).toEqual(admins);
      expect(mockUserRepository.find).toHaveBeenCalledWith({ where: { role: Role.ADMIN } });
    });
  });
});
