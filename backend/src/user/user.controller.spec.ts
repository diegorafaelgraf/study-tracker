import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    createUser: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create user when user is ADMIN', async () => {
      const body = { username: 'newuser', password: 'password', role: 'USER' };
      const req = { user: { role: 'ADMIN', userId: '1' } };
      mockUserService.createUser.mockResolvedValue({ username: 'newuser' });

      const result = await controller.createUser(body, req);

      expect(userService.createUser).toHaveBeenCalledWith(body);
      expect(result).toEqual({ username: 'newuser' });
    });

    it('should throw ForbiddenException when user is not ADMIN', async () => {
      const body = { username: 'newuser', password: 'password' };
      const req = { user: { role: 'USER', userId: '1' } };

      expect(() => controller.createUser(body, req)).toThrow(ForbiddenException);
    });

    it('should not call userService.createUser when not authorized', async () => {
      const body = { username: 'newuser', password: 'password' };
      const req = { user: { role: 'USER', userId: '1' } };

      try {
        controller.createUser(body, req);
      } catch (error) {
        // Expected error
      }

      expect(userService.createUser).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException with correct message', async () => {
      const body = { username: 'newuser', password: 'password' };
      const req = { user: { role: 'USER', userId: '1' } };

      try {
        controller.createUser(body, req);
      } catch (error) {
        expect(error.message).toBe('No autorizado');
      }
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const body = { oldPassword: 'oldpass', newPassword: 'newpass' };
      const req = { user: { userId: '123' } };
      mockUserService.changePassword.mockResolvedValue({ username: 'user' });

      const result = await controller.changePassword(body, req);

      expect(userService.changePassword).toHaveBeenCalledWith('123', 'oldpass', 'newpass');
      expect(result).toEqual({ username: 'user' });
    });

    it('should throw BadRequestException on error', async () => {
      const body = { oldPassword: 'wrongold', newPassword: 'newpass' };
      const req = { user: { userId: '123' } };
      mockUserService.changePassword.mockRejectedValue(new Error('Contraseña actual incorrecta'));

      await expect(controller.changePassword(body, req)).rejects.toThrow(BadRequestException);
    });

    it('should catch service errors and wrap in BadRequestException', async () => {
      const body = { oldPassword: 'oldpass', newPassword: 'newpass' };
      const req = { user: { userId: '123' } };
      const errorMessage = 'Usuario no encontrado';
      mockUserService.changePassword.mockRejectedValue(new Error(errorMessage));

      try {
        await controller.changePassword(body, req);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toContain(errorMessage);
      }
    });
  });
});
