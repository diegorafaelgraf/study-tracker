import { Test, TestingModule } from '@nestjs/testing';
import { TopicService } from './topic.service';
import { getModelToken } from '@nestjs/mongoose';
import { Topic } from './schemas/topic.schema';
import { YearTopic } from '../year-topic/schemas/year-topic.schema';
import { Year } from '../year/schemas/year.schema';

describe('TopicService', () => {
  let service: TopicService;
  let mockTopicModel: any;
  let mockYearTopicModel: any;
  let mockYearModel: any;

  beforeEach(async () => {
    mockTopicModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      exec: jest.fn(),
    };

    mockYearTopicModel = {
      find: jest.fn(),
      exec: jest.fn(),
    };

    mockYearModel = {
      findOne: jest.fn(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicService,
        {
          provide: getModelToken(Topic.name),
          useValue: mockTopicModel,
        },
        {
          provide: getModelToken(YearTopic.name),
          useValue: mockYearTopicModel,
        },
        {
          provide: getModelToken(Year.name),
          useValue: mockYearModel,
        },
      ],
    }).compile();

    service = module.get<TopicService>(TopicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a topic with normalized name', async () => {
      const input = { name: 'Test Topic' };
      const mockCreatedTopic = { _id: '1', name: 'Test Topic', nameNormalized: 'test topic', userId: 'user1' };
      mockTopicModel.create.mockResolvedValue(mockCreatedTopic);

      const result = await service.create(input, 'user1');

      expect(mockTopicModel.create).toHaveBeenCalledWith({
        name: 'Test Topic',
        nameNormalized: 'test topic',
        userId: 'user1',
      });
      expect(result).toEqual(mockCreatedTopic);
    });

    it('should normalize name by removing accents and converting to lowercase', async () => {
      const input = { name: 'Música Español' };
      mockTopicModel.create.mockResolvedValue({});

      await service.create(input, 'user1');

      const call = mockTopicModel.create.mock.calls[0][0];
      expect(call.nameNormalized).toBe('musica espanol');
    });

    it('should trim whitespace from normalized name', async () => {
      const input = { name: '  Test  ' };
      mockTopicModel.create.mockResolvedValue({});

      await service.create(input, 'user1');

      const call = mockTopicModel.create.mock.calls[0][0];
      expect(call.nameNormalized).toBe('test');
    });
  });

  describe('getTopics', () => {
    it('should return topics for a user', async () => {
      const mockTopics = [
        { _id: '1', name: 'Topic 1', userId: 'user1' },
        { _id: '2', name: 'Topic 2', userId: 'user1' },
      ];
      mockTopicModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockTopics) });

      const result = await service.getTopics('user1');

      expect(result).toEqual(mockTopics);
      expect(mockTopicModel.find).toHaveBeenCalledWith({ userId: 'user1' });
    });

    it('should return empty array when no topics exist', async () => {
      mockTopicModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });

      const result = await service.getTopics('user1');

      expect(result).toEqual([]);
    });
  });

  describe('getTopicByName', () => {
    it('should find topic by name and userId', async () => {
      const mockTopic = { _id: '1', name: 'Music', userId: 'user1' };
      mockTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockTopic) });

      const result = await service.getTopicByName('Music', 'user1');

      expect(result).toEqual(mockTopic);
      expect(mockTopicModel.findOne).toHaveBeenCalledWith({ name: 'Music', userId: 'user1' });
    });

    it('should return null when topic not found', async () => {
      mockTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      const result = await service.getTopicByName('NonExistent', 'user1');

      expect(result).toBeNull();
    });
  });

  describe('getTopicById', () => {
    it('should find topic by id and userId', async () => {
      const mockTopic = { _id: '1', name: 'Music', userId: 'user1' };
      mockTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockTopic) });

      const result = await service.getTopicById(1, 'user1');

      expect(result).toEqual(mockTopic);
      expect(mockTopicModel.findOne).toHaveBeenCalledWith({ _id: 1, userId: 'user1' });
    });
  });

  describe('getTopicsByYear', () => {
    it('should get topics for a specific year', async () => {
      const yearTopics = [{ yearId: 'year1', topicId: 'topic1', userId: 'user1' }];
      const mockTopics = [{ _id: 'topic1', name: 'Music', userId: 'user1' }];

      mockYearTopicModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(yearTopics) });
      mockTopicModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockTopics) });

      const result = await service.getTopicsByYear('year1', 'user1');

      expect(result).toEqual(mockTopics);
    });
  });

  describe('getTopicsCurrentYear', () => {
    it('should get topics for current open year', async () => {
      const currentYear = { _id: 'year1', closed: false, userId: 'user1' };
      const yearTopics = [{ yearId: 'year1', topicId: 'topic1', userId: 'user1' }];
      const mockTopics = [{ _id: 'topic1', name: 'Music', userId: 'user1' }];

      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(currentYear) });
      mockYearTopicModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(yearTopics) });
      mockTopicModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockTopics) });

      const result = await service.getTopicsCurrentYear('user1');

      expect(result).toEqual(mockTopics);
    });

    it('should throw error when no open year exists', async () => {
      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.getTopicsCurrentYear('user1')).rejects.toThrow(
        'No hay un año abierto para obtener los tópicos',
      );
    });
  });
});
