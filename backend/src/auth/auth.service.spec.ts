import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        password: 'hashedpassword',
        role: 'USER',
      };

      mockUserService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password');

      expect(result).toEqual(mockUser);
      expect(mockUserService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      await expect(service.validateUser('testuser', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserService.findByUsername).toHaveBeenCalledWith('testuser');
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        password: 'hashedpassword',
        role: 'USER',
      };

      mockUserService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('testuser', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException with custom message', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      try {
        await service.validateUser('testuser', 'password');
      } catch (error) {
        expect(error.message).toBe('Credenciales inválidas');
      }
    });
  });

  describe('login', () => {
    it('should return access_token on successful login', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        password: 'hashedpassword',
        role: 'ADMIN',
      };

      mockUserService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt.token.here');

      const result = await service.login('testuser', 'password');

      expect(result).toEqual({ access_token: 'jwt.token.here' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: '123',
        username: 'testuser',
        role: 'ADMIN',
      });
    });

    it('should include user id, username and role in JWT payload', async () => {
      const mockUser = {
        _id: 'user-456',
        username: 'admin',
        password: 'hashedpassword',
        role: 'ADMIN',
      };

      mockUserService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('token');

      await service.login('admin', 'password');

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 'user-456',
        username: 'admin',
        role: 'ADMIN',
      });
    });

    it('should throw UnauthorizedException on failed credentials', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      await expect(service.login('testuser', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
