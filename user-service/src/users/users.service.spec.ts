import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ClientProxy } from '@nestjs/microservices';
import {
  UserNotFoundException,
  DuplicateEmailException,
} from '../common/exceptions/user.exception';

describe('UsersService', () => {
  let service: UsersService;
  let clientProxyMock: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    // Create a mock for ClientProxy
    clientProxyMock = {
      emit: jest.fn().mockReturnValue({ toPromise: () => Promise.resolve() }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'NOTIFICATION_SERVICE',
          useValue: clientProxyMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and emit event', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const user = await service.create(createUserDto);

      expect(user).toMatchObject(createUserDto);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(clientProxyMock.emit).toHaveBeenCalledWith('user_created', user);
    });

    it('should throw DuplicateEmailException for duplicate email', async () => {
      const createUserDto = {
        email: 'duplicate@example.com',
        name: 'Test User',
      };

      await service.create(createUserDto);

      await expect(service.create(createUserDto)).rejects.toThrow(
        DuplicateEmailException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user if it exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const createdUser = await service.create(createUserDto);
      const foundUser = service.findOne(createdUser.id);

      expect(foundUser).toMatchObject(createUserDto);
    });

    it('should throw UserNotFoundException if user does not exist', () => {
      expect(() => service.findOne('nonexistent-id')).toThrow(
        UserNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user if it exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const createdUser = await service.create(createUserDto);
      const updateUserDto = { name: 'Updated Name' };

      const updatedUser = service.update(createdUser.id, updateUserDto);

      expect(updatedUser.name).toBe(updateUserDto.name);
      expect(updatedUser.email).toBe(createUserDto.email);
    });

    it('should throw UserNotFoundException if user does not exist', () => {
      expect(() =>
        service.update('nonexistent-id', { name: 'Updated Name' }),
      ).toThrow(UserNotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user if it exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const createdUser = await service.create(createUserDto);
      service.remove(createdUser.id);

      expect(() => service.findOne(createdUser.id)).toThrow(
        UserNotFoundException,
      );
    });

    it('should throw UserNotFoundException if user does not exist', () => {
      expect(() => service.remove('nonexistent-id')).toThrow(
        UserNotFoundException,
      );
    });
  });
});
