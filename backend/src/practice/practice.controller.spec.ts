import { Test, TestingModule } from '@nestjs/testing';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('PracticeController', () => {
  let controller: PracticeController;
  let practiceService: PracticeService;

  const mockPracticeService = {
    create: jest.fn(),
    getPracticesByYearTopic: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PracticeController],
      providers: [
        {
          provide: PracticeService,
          useValue: mockPracticeService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<PracticeController>(PracticeController);
    practiceService = module.get<PracticeService>(PracticeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addPractice', () => {
    it('should create a practice', async () => {
      const dto = { yearTopicId: 'yt1', date: new Date(), durationMinutes: 30 };
      const req = { user: { userId: 'user1' } };
      const mockPractice = { _id: '1', ...dto, userId: 'user1' };
      mockPracticeService.create.mockResolvedValue(mockPractice);

      const result = await controller.addPractice(dto, req);

      expect(practiceService.create).toHaveBeenCalledWith(
        {
          yearTopicId: dto.yearTopicId,
          date: dto.date,
          durationMinutes: dto.durationMinutes,
        },
        'user1',
      );
      expect(result).toEqual(mockPractice);
    });

    it('should pass correct duration and year-topic id', async () => {
      const dto = { yearTopicId: 'yt-abc', date: new Date('2024-01-01'), durationMinutes: 45 };
      const req = { user: { userId: 'user1' } };
      mockPracticeService.create.mockResolvedValue({});

      await controller.addPractice(dto, req);

      expect(practiceService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          yearTopicId: 'yt-abc',
          durationMinutes: 45,
        }),
        'user1',
      );
    });
  });

  describe('getPracticesByYearTopic', () => {
    it('should return practices for a year-topic', async () => {
      const req = { user: { userId: 'user1' } };
      const mockPractices = [
        { _id: '1', yearTopicId: 'yt1', durationMinutes: 30, userId: 'user1' },
        { _id: '2', yearTopicId: 'yt1', durationMinutes: 45, userId: 'user1' },
      ];
      mockPracticeService.getPracticesByYearTopic.mockResolvedValue(mockPractices);

      const result = await controller.getPracticesByYearTopic('yt1', req);

      expect(practiceService.getPracticesByYearTopic).toHaveBeenCalledWith('yt1', 'user1');
      expect(result).toEqual(mockPractices);
    });

    it('should return empty array when no practices found', async () => {
      const req = { user: { userId: 'user1' } };
      mockPracticeService.getPracticesByYearTopic.mockResolvedValue([]);

      const result = await controller.getPracticesByYearTopic('yt1', req);

      expect(result).toEqual([]);
    });
  });
});
