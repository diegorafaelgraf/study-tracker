import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user object with userId, username and role', async () => {
      const payload = {
        sub: '123',
        username: 'testuser',
        role: 'USER',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: '123',
        username: 'testuser',
        role: 'USER',
      });
    });

    it('should map sub to userId', async () => {
      const payload = {
        sub: 'user-id-456',
        username: 'admin',
        role: 'ADMIN',
      };

      const result = await strategy.validate(payload);

      expect(result.userId).toBe('user-id-456');
    });

    it('should preserve username from payload', async () => {
      const payload = {
        sub: '123',
        username: 'myusername',
        role: 'USER',
      };

      const result = await strategy.validate(payload);

      expect(result.username).toBe('myusername');
    });

    it('should preserve role from payload', async () => {
      const payload = {
        sub: '123',
        username: 'testuser',
        role: 'ADMIN',
      };

      const result = await strategy.validate(payload);

      expect(result.role).toBe('ADMIN');
    });

    it('should not include sub in result, only userId', async () => {
      const payload = {
        sub: '123',
        username: 'testuser',
        role: 'USER',
      };

      const result = await strategy.validate(payload);

      expect(result.sub).toBeUndefined();
      expect(result.userId).toBe('123');
    });
  });
});
