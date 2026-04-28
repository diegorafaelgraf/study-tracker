import { Test, TestingModule } from '@nestjs/testing';
import { PracticeService } from './practice.service';
import { getModelToken } from '@nestjs/mongoose';
import { YearTopic } from '../year-topic/schemas/year-topic.schema';
import { Year } from '../year/schemas/year.schema';
import { Practice } from './schemas/practice.schema';
import { NotFoundException } from '@nestjs/common';

describe('PracticeService', () => {
  let service: PracticeService;
  let mockYearTopicModel: any;
  let mockYearModel: any;
  let mockPracticeModel: any;

  beforeEach(async () => {
    mockYearTopicModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      exec: jest.fn(),
    };

    mockYearModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      exec: jest.fn(),
    };

    mockPracticeModel = {
      create: jest.fn(),
      find: jest.fn(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PracticeService,
        {
          provide: getModelToken(YearTopic.name),
          useValue: mockYearTopicModel,
        },
        {
          provide: getModelToken(Year.name),
          useValue: mockYearModel,
        },
        {
          provide: getModelToken(Practice.name),
          useValue: mockPracticeModel,
        },
      ],
    }).compile();

    service = module.get<PracticeService>(PracticeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create practice when year is open and year-topic exists', async () => {
      const input = { yearTopicId: 'yt1', date: new Date(), durationMinutes: 30 };
      const mockYearTopic = { _id: 'yt1', yearId: 'year1', userId: 'user1' };
      const mockYear = { _id: 'year1', closed: false, userId: 'user1' };
      const mockCreatedPractice = { ...input, _id: '1', userId: 'user1' };

      mockYearTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYearTopic) });
      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYear) });
      mockPracticeModel.create.mockResolvedValue(mockCreatedPractice);

      const result = await service.create(input, 'user1');

      expect(result).toEqual(mockCreatedPractice);
      expect(mockPracticeModel.create).toHaveBeenCalledWith({ ...input, userId: 'user1' });
    });

    it('should throw NotFoundException when year-topic does not exist', async () => {
      const input = { yearTopicId: 'invalid', date: new Date(), durationMinutes: 30 };

      mockYearTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.create(input, 'user1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when year is closed', async () => {
      const input = { yearTopicId: 'yt1', date: new Date(), durationMinutes: 30 };
      const mockYearTopic = { _id: 'yt1', yearId: 'year1', userId: 'user1' };

      mockYearTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYearTopic) });
      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.create(input, 'user1')).rejects.toThrow(
        'No hay un año abierto para cargar una práctica',
      );
    });

    it('should throw NotFoundException with specific message for invalid year-topic', async () => {
      const input = { yearTopicId: 'invalid123', date: new Date(), durationMinutes: 30 };

      mockYearTopicModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      try {
        await service.create(input, 'user1');
      } catch (error) {
        expect(error.message).toContain('invalid123');
      }
    });
  });

  describe('getPracticesByYearTopic', () => {
    it('should return practices for a year-topic', async () => {
      const mockPractices = [
        { _id: '1', yearTopicId: 'yt1', durationMinutes: 30, userId: 'user1' },
        { _id: '2', yearTopicId: 'yt1', durationMinutes: 45, userId: 'user1' },
      ];

      mockPracticeModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockPractices) });

      const result = await service.getPracticesByYearTopic('yt1', 'user1');

      expect(result).toEqual(mockPractices);
      expect(mockPracticeModel.find).toHaveBeenCalledWith({ yearTopicId: 'yt1', userId: 'user1' });
    });

    it('should return empty array when no practices exist', async () => {
      mockPracticeModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });

      const result = await service.getPracticesByYearTopic('yt1', 'user1');

      expect(result).toEqual([]);
    });
  });
});
