import { Test, TestingModule } from '@nestjs/testing';
import { YearService } from './year.service';
import { getModelToken } from '@nestjs/mongoose';
import { Year } from './schemas/year.schema';
import { YearTopic } from '../year-topic/schemas/year-topic.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('YearService', () => {
  let service: YearService;
  let mockYearModel: any;
  let mockYearTopicModel: any;

  beforeEach(async () => {
    mockYearModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      exec: jest.fn(),
    };

    mockYearTopicModel = {
      find: jest.fn(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YearService,
        {
          provide: getModelToken(Year.name),
          useValue: mockYearModel,
        },
        {
          provide: getModelToken(YearTopic.name),
          useValue: mockYearTopicModel,
        },
      ],
    }).compile();

    service = module.get<YearService>(YearService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new year when no open year exists', async () => {
      const input = { year: '2024', totalDays: 365 };
      mockYearModel.findOne.mockResolvedValue(null);
      mockYearModel.create.mockResolvedValue({ _id: '1', ...input, closed: false, userId: 'user1' });

      const result = await service.create(input, 'user1');

      expect(mockYearModel.create).toHaveBeenCalledWith({
        year: '2024',
        totalDays: 365,
        closed: false,
        userId: 'user1',
      });
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException when open year already exists', async () => {
      const input = { year: '2024', totalDays: 365 };
      mockYearModel.findOne.mockResolvedValue({ _id: '1', closed: false });

      await expect(service.create(input, 'user1')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException with correct message', async () => {
      const input = { year: '2024', totalDays: 365 };
      mockYearModel.findOne.mockResolvedValue({ _id: '1', closed: false });

      try {
        await service.create(input, 'user1');
      } catch (error) {
        expect(error.message).toContain('Ya existe un año abierto');
      }
    });
  });

  describe('getYears', () => {
    it('should return all years for a user', async () => {
      const mockYears = [
        { _id: '1', year: '2023', closed: true, userId: 'user1' },
        { _id: '2', year: '2024', closed: false, userId: 'user1' },
      ];
      mockYearModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYears) });

      const result = await service.getYears('user1');

      expect(result).toEqual(mockYears);
      expect(mockYearModel.find).toHaveBeenCalledWith({ userId: 'user1' });
    });
  });

  describe('getYearByYear', () => {
    it('should find year by year string and userId', async () => {
      const mockYear = { _id: '1', year: '2024', closed: false, userId: 'user1' };
      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYear) });

      const result = await service.getYearByYear('2024', 'user1');

      expect(result).toEqual(mockYear);
      expect(mockYearModel.findOne).toHaveBeenCalledWith({ year: '2024', userId: 'user1' });
    });

    it('should return null when year not found', async () => {
      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      const result = await service.getYearByYear('2025', 'user1');

      expect(result).toBeNull();
    });
  });

  describe('getOpenedYear', () => {
    it('should return the open year for a user', async () => {
      const mockYear = { _id: '1', year: '2024', closed: false, userId: 'user1' };
      mockYearModel.findOne.mockResolvedValue(mockYear);

      const result = await service.getOpenedYear('user1');

      expect(result).toEqual(mockYear);
      expect(mockYearModel.findOne).toHaveBeenCalledWith({ closed: false, userId: 'user1' });
    });

    it('should return null when no open year exists', async () => {
      mockYearModel.findOne.mockResolvedValue(null);

      const result = await service.getOpenedYear('user1');

      expect(result).toBeNull();
    });
  });

  describe('getYearById', () => {
    it('should find year by id and userId', async () => {
      const mockYear = { _id: '1', year: '2024', closed: false, userId: 'user1' };
      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYear) });

      const result = await service.getYearById(1, 'user1');

      expect(result).toEqual(mockYear);
      expect(mockYearModel.findOne).toHaveBeenCalledWith({ _id: 1, userId: 'user1' });
    });
  });

  describe('getYearsByTopic', () => {
    it('should return years associated with a topic', async () => {
      const yearTopics = [
        { yearId: 'year1', topicId: 'topic1', userId: 'user1' },
        { yearId: 'year2', topicId: 'topic1', userId: 'user1' },
      ];
      const mockYears = [
        { _id: 'year1', year: '2023', userId: 'user1' },
        { _id: 'year2', year: '2024', userId: 'user1' },
      ];

      mockYearTopicModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(yearTopics) });
      mockYearModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYears) });

      const result = await service.getYearsByTopic('topic1', 'user1');

      expect(result).toEqual(mockYears);
    });
  });

  describe('closeYear', () => {
    it('should close an open year', async () => {
      const mockYear = { _id: '1', year: '2024', closed: false, userId: 'user1', save: jest.fn() };
      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYear) });
      mockYear.save.mockResolvedValue({ ...mockYear, closed: true });

      const result = await service.closeYear('1', 'user1');

      expect(mockYear.closed).toBe(true);
      expect(mockYear.save).toHaveBeenCalled();
      expect(result.closed).toBe(true);
    });

    it('should throw NotFoundException when year not found', async () => {
      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.closeYear('1', 'user1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when year is already closed', async () => {
      const mockYear = { _id: '1', year: '2024', closed: true, userId: 'user1' };
      mockYearModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockYear) });

      await expect(service.closeYear('1', 'user1')).rejects.toThrow(BadRequestException);
    });
  });
});
