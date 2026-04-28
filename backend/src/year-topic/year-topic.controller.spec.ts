import { Test, TestingModule } from '@nestjs/testing';
import { YearTopicController } from './year-topic.controller';
import { YearTopicService } from './year-topic.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('YearTopicController', () => {
  let controller: YearTopicController;
  let yearTopicService: YearTopicService;

  const mockYearTopicService = {
    create: jest.fn(),
    getYearTopicById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [YearTopicController],
      providers: [
        {
          provide: YearTopicService,
          useValue: mockYearTopicService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<YearTopicController>(YearTopicController);
    yearTopicService = module.get<YearTopicService>(YearTopicService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addYearTopic', () => {
    it('should create a year-topic', async () => {
      const dto = { topicId: 'topic1', goalMinutes: 100 };
      const req = { user: { userId: 'user1' } };
      const mockYearTopic = { _id: '1', yearId: 'year1', ...dto, userId: 'user1' };
      mockYearTopicService.create.mockResolvedValue(mockYearTopic);

      const result = await controller.addYearTopic(dto, req);

      expect(yearTopicService.create).toHaveBeenCalledWith(
        { topicId: 'topic1', goalMinutes: 100 },
        'user1',
      );
      expect(result).toEqual(mockYearTopic);
    });

    it('should pass correct topic and goal data', async () => {
      const dto = { topicId: 'topic-abc', goalMinutes: 200 };
      const req = { user: { userId: 'user1' } };
      mockYearTopicService.create.mockResolvedValue({});

      await controller.addYearTopic(dto, req);

      expect(yearTopicService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          topicId: 'topic-abc',
          goalMinutes: 200,
        }),
        'user1',
      );
    });
  });

  describe('getYearTopicById', () => {
    it('should return year-topic by id', async () => {
      const req = { user: { userId: 'user1' } };
      const mockYearTopic = { _id: '1', yearId: 'year1', topicId: 'topic1', userId: 'user1' };
      mockYearTopicService.getYearTopicById.mockResolvedValue(mockYearTopic);

      const result = await controller.getYearTopicById(1, req);

      expect(yearTopicService.getYearTopicById).toHaveBeenCalledWith(1, 'user1');
      expect(result).toEqual(mockYearTopic);
    });

    it('should return null when year-topic not found', async () => {
      const req = { user: { userId: 'user1' } };
      mockYearTopicService.getYearTopicById.mockResolvedValue(null);

      const result = await controller.getYearTopicById(999, req);

      expect(result).toBeNull();
    });
  });
});
