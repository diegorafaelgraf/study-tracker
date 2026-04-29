import { Test, TestingModule } from '@nestjs/testing';
import { YearTopicService } from './year-topic.service';
import { getModelToken } from '@nestjs/mongoose';
import { YearTopic } from './schemas/year-topic.schema';
import { Year } from '../year/schemas/year.schema';
import { Topic } from '../topic/schemas/topic.schema';
import { NotFoundException } from '@nestjs/common';

describe('YearTopicService', () => {
  let service: YearTopicService;
  let mockYearTopicModel: any;
  let mockYearModel: any;
  let mockTopicModel: any;

  beforeEach(async () => {
    mockYearTopicModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      exec: jest.fn(),
    };

    mockYearModel = {
      findOne: jest.fn(),
      exec: jest.fn(),
    };

    mockTopicModel = {
      findOne: jest.fn(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YearTopicService,
        {
          provide: getModelToken(YearTopic.name),
          useValue: mockYearTopicModel,
        },
        {
          provide: getModelToken(Year.name),
          useValue: mockYearModel,
        },
        {
          provide: getModelToken(Topic.name),
          useValue: mockTopicModel,
        },
      ],
    }).compile();

    service = module.get<YearTopicService>(YearTopicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create year-topic when year is open and topic exists', async () => {
      const input = { topicId: 'topic1', goalMinutes: 100 };
      const mockYear = { _id: 'year1', closed: false, userId: 'user1' };
      const mockTopic = { _id: 'topic1', name: 'Piano', userId: 'user1' };
      const mockCreatedYearTopic = { _id: '1', yearId: 'year1', ...input, userId: 'user1' };

      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYear) });
      mockTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockTopic) });
      mockYearTopicModel.create.mockResolvedValue(mockCreatedYearTopic);

      const result = await service.create(input, 'user1');

      expect(result).toEqual(mockCreatedYearTopic);
      expect(mockYearTopicModel.create).toHaveBeenCalledWith({
        topicId: 'topic1',
        goalMinutes: 100,
        yearId: 'year1',
        userId: 'user1',
      });
    });

    it('should throw NotFoundException when no open year exists', async () => {
      const input = { topicId: 'topic1', goalMinutes: 100 };

      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.create(input, 'user1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException with correct message when no open year', async () => {
      const input = { topicId: 'topic1', goalMinutes: 100 };

      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      try {
        await service.create(input, 'user1');
      } catch (error) {
        expect(error.message).toContain('No hay un año abierto');
      }
    });

    it('should throw NotFoundException when topic does not exist', async () => {
      const input = { topicId: 'invalid', goalMinutes: 100 };
      const mockYear = { _id: 'year1', closed: false, userId: 'user1' };

      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYear) });
      mockTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.create(input, 'user1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException with specific topicId when topic not found', async () => {
      const input = { topicId: 'topic-abc', goalMinutes: 100 };
      const mockYear = { _id: 'year1', closed: false, userId: 'user1' };

      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYear) });
      mockTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      try {
        await service.create(input, 'user1');
      } catch (error) {
        expect(error.message).toContain('topic-abc');
      }
    });

    it('should convert year id to string when creating year-topic', async () => {
      const input = { topicId: 'topic1', goalMinutes: 100 };
      const mockYear = { _id: { toString: jest.fn().mockReturnValue('year-123') }, closed: false, userId: 'user1' };
      const mockTopic = { _id: 'topic1', name: 'Piano', userId: 'user1' };

      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYear) });
      mockTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockTopic) });
      mockYearTopicModel.create.mockResolvedValue({});

      await service.create(input, 'user1');

      expect(mockYearTopicModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          yearId: 'year-123',
        }),
      );
    });
  });

  describe('getYearTopicById', () => {
    it('should find year-topic by id and userId', async () => {
      const mockYearTopic = { _id: '1', yearId: 'year1', topicId: 'topic1', userId: 'user1' };
      mockYearTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYearTopic) });

      const result = await service.getYearTopicById(1, 'user1');

      expect(result).toEqual(mockYearTopic);
      expect(mockYearTopicModel.findOne).toHaveBeenCalledWith({ _id: 1, userId: 'user1' });
    });

    it('should return null when year-topic not found', async () => {
      mockYearTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      const result = await service.getYearTopicById(999, 'user1');

      expect(result).toBeNull();
    });
  });
});
