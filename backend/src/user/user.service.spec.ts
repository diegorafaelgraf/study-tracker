import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserRole } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let mockUserModel: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockUserModel = {
      findOne: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAdminIfNotExists', () => {
    it('should create admin user if not exists', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      mockUserModel.create.mockResolvedValue({ username: 'admin', password: 'hashedpassword' });

      await service.createAdminIfNotExists();

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: 'admin' });
      expect(bcrypt.hash).toHaveBeenCalledWith('admin', 10);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        username: 'admin',
        password: 'hashedpassword',
        role: UserRole.ADMIN,
      });
    });

    it('should not create admin user if already exists', async () => {
      const existingAdmin = { username: 'admin', password: 'hashedpassword' };
      mockUserModel.findOne.mockResolvedValue(existingAdmin);

      await service.createAdminIfNotExists();

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: 'admin' });
      expect(mockUserModel.create).not.toHaveBeenCalled();
    });
  });

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      const mockUser = { username: 'testuser', password: 'hashed', role: 'USER' };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    });

    it('should return null when user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.findByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create user with hashed password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({ username: 'newuser', password: 'hashedpassword', role: 'USER' });

      const result = await service.createUser({
        username: 'newuser',
        password: 'mypassword',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('mypassword', 10);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'hashedpassword',
        role: 'USER',
      });
      expect(result).toBeDefined();
    });

    it('should create user with ADMIN role', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({ username: 'admin', password: 'hashed', role: 'ADMIN' });

      await service.createUser({
        username: 'admin',
        password: 'password',
        role: 'ADMIN',
      });

      expect(mockUserModel.create).toHaveBeenCalledWith({
        username: 'admin',
        password: 'hashedpassword',
        role: 'ADMIN',
      });
    });

    it('should throw error if user already exists', async () => {
      mockUserModel.findOne.mockResolvedValue({ username: 'existing' });

      await expect(
        service.createUser({ username: 'existing', password: 'password' }),
      ).rejects.toThrow('Usuario ya existe');
    });

    it('should default to USER role if not specified', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({});

      await service.createUser({
        username: 'newuser',
        password: 'password',
      });

      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'USER',
        }),
      );
    });
  });

  describe('changePassword', () => {
    it('should change password when old password is correct', async () => {
      const mockUser = {
        _id: '123',
        password: 'oldhashed',
        save: jest.fn().mockResolvedValue({ password: 'newhashed' }),
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');

      const result = await service.changePassword('123', 'oldpassword', 'newpassword');

      expect(bcrypt.compare).toHaveBeenCalledWith('oldpassword', 'oldhashed');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(mockUser.password).toBe('newhashed');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(
        service.changePassword('123', 'oldpassword', 'newpassword'),
      ).rejects.toThrow('Usuario no encontrado');
    });

    it('should throw error if old password is incorrect', async () => {
      const mockUser = {
        _id: '123',
        password: 'oldhashed',
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('123', 'wrongpassword', 'newpassword'),
      ).rejects.toThrow('Contraseña actual incorrecta');
    });
  });
});
