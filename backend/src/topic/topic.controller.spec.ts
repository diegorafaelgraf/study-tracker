import { Test, TestingModule } from '@nestjs/testing';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('TopicController', () => {
  let controller: TopicController;
  let topicService: TopicService;

  const mockTopicService = {
    create: jest.fn(),
    getTopics: jest.fn(),
    getTopicByName: jest.fn(),
    getTopicById: jest.fn(),
    getTopicsByYear: jest.fn(),
    getTopicsCurrentYear: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [
        {
          provide: TopicService,
          useValue: mockTopicService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<TopicController>(TopicController);
    topicService = module.get<TopicService>(TopicService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addTopic', () => {
    it('should create a topic', async () => {
      const dto = { name: 'Piano' };
      const req = { user: { userId: 'user1' } };
      const mockTopic = { _id: '1', name: 'Piano', userId: 'user1' };
      mockTopicService.create.mockResolvedValue(mockTopic);

      const result = await controller.addTopic(dto, req);

      expect(topicService.create).toHaveBeenCalledWith({ name: 'Piano' }, 'user1');
      expect(result).toEqual(mockTopic);
    });
  });

  describe('getTopics', () => {
    it('should return all topics for user', async () => {
      const req = { user: { userId: 'user1' } };
      const mockTopics = [
        { _id: '1', name: 'Piano', userId: 'user1' },
        { _id: '2', name: 'Guitar', userId: 'user1' },
      ];
      mockTopicService.getTopics.mockResolvedValue(mockTopics);

      const result = await controller.getTopics(req);

      expect(topicService.getTopics).toHaveBeenCalledWith('user1');
      expect(result).toEqual(mockTopics);
    });
  });

  describe('getTopicByName', () => {
    it('should return topic by name', async () => {
      const req = { user: { userId: 'user1' } };
      const mockTopic = { _id: '1', name: 'Piano', userId: 'user1' };
      mockTopicService.getTopicByName.mockResolvedValue(mockTopic);

      const result = await controller.getTopicByName('Piano', req);

      expect(topicService.getTopicByName).toHaveBeenCalledWith('Piano', 'user1');
      expect(result).toEqual(mockTopic);
    });

    it('should throw NotFoundException when topic not found', async () => {
      const req = { user: { userId: 'user1' } };
      mockTopicService.getTopicByName.mockResolvedValue(null);

      await expect(controller.getTopicByName('NonExistent', req)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException with correct message', async () => {
      const req = { user: { userId: 'user1' } };
      mockTopicService.getTopicByName.mockResolvedValue(null);

      try {
        await controller.getTopicByName('TestTopic', req);
      } catch (error) {
        expect(error.message).toContain('TestTopic');
      }
    });
  });

  describe('getTopicById', () => {
    it('should return topic by id', async () => {
      const req = { user: { userId: 'user1' } };
      const mockTopic = { _id: '1', name: 'Piano', userId: 'user1' };
      mockTopicService.getTopicById.mockResolvedValue(mockTopic);

      const result = await controller.getTopicById(1, req);

      expect(topicService.getTopicById).toHaveBeenCalledWith(1, 'user1');
      expect(result).toEqual(mockTopic);
    });
  });

  describe('getTopicsByYear', () => {
    it('should return topics for a year', async () => {
      const req = { user: { userId: 'user1' } };
      const mockTopics = [{ _id: '1', name: 'Piano', userId: 'user1' }];
      mockTopicService.getTopicsByYear.mockResolvedValue(mockTopics);

      const result = await controller.getTopicsByYear('year1', req);

      expect(topicService.getTopicsByYear).toHaveBeenCalledWith('year1', 'user1');
      expect(result).toEqual(mockTopics);
    });
  });

  describe('getTopicsCurrentYear', () => {
    it('should return topics for current year', async () => {
      const req = { user: { userId: 'user1' } };
      const mockTopics = [{ _id: '1', name: 'Piano', userId: 'user1' }];
      mockTopicService.getTopicsCurrentYear.mockResolvedValue(mockTopics);

      const result = await controller.getTopicsCurrentYear(req);

      expect(topicService.getTopicsCurrentYear).toHaveBeenCalledWith('user1');
      expect(result).toEqual(mockTopics);
    });
  });
});
