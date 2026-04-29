import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with username and password', async () => {
      const body = { username: 'testuser', password: 'password123' };
      mockAuthService.login.mockResolvedValue({ access_token: 'jwt.token' });

      const result = await controller.login(body);

      expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
      expect(result).toEqual({ access_token: 'jwt.token' });
    });

    it('should return access token on successful login', async () => {
      const body = { username: 'admin', password: 'admin' };
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      mockAuthService.login.mockResolvedValue({ access_token: token });

      const result = await controller.login(body);

      expect(result.access_token).toBe(token);
    });

    it('should propagate errors from authService', async () => {
      const body = { username: 'testuser', password: 'wrongpassword' };
      const error = new Error('Credenciales inválidas');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(body)).rejects.toThrow(error);
    });

    it('should handle different usernames', async () => {
      const body1 = { username: 'user1', password: 'pass1' };
      const body2 = { username: 'user2', password: 'pass2' };
      mockAuthService.login.mockResolvedValue({ access_token: 'token' });

      await controller.login(body1);
      await controller.login(body2);

      expect(authService.login).toHaveBeenNthCalledWith(1, 'user1', 'pass1');
      expect(authService.login).toHaveBeenNthCalledWith(2, 'user2', 'pass2');
    });
  });
});
