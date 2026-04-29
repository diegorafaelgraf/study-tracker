import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: 'JwtAuthGuard',
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status ok', () => {
      const result = controller.getHealth();

      expect(result).toEqual({ status: 'ok' });
    });

    it('should return an object with status property', () => {
      const result = controller.getHealth();

      expect(result).toHaveProperty('status');
      expect(result.status).toBe('ok');
    });

    it('should always return the same status', () => {
      const result1 = controller.getHealth();
      const result2 = controller.getHealth();

      expect(result1).toEqual(result2);
    });
  });
});
