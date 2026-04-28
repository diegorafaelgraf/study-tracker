import { Test, TestingModule } from '@nestjs/testing';
import { YearController } from './year.controller';
import { YearService } from './year.service';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('YearController', () => {
  let controller: YearController;
  let yearService: YearService;

  const mockYearService = {
    create: jest.fn(),
    getYears: jest.fn(),
    getYearByYear: jest.fn(),
    getYearById: jest.fn(),
    getOpenedYear: jest.fn(),
    getYearsByTopic: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [YearController],
      providers: [
        {
          provide: YearService,
          useValue: mockYearService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<YearController>(YearController);
    yearService = module.get<YearService>(YearService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getYears', () => {
    it('should return all years for user', async () => {
      const req = { user: { userId: 'user1' } };
      const mockYears = [
        { _id: '1', year: '2023', closed: true },
        { _id: '2', year: '2024', closed: false },
      ];
      mockYearService.getYears.mockResolvedValue(mockYears);

      const result = await controller.getYears(req);

      expect(yearService.getYears).toHaveBeenCalledWith('user1');
      expect(result).toEqual(mockYears);
    });
  });

  describe('addYear', () => {
    it('should create a new year', async () => {
      const dto = { year: '2024', totalDays: 365 };
      const req = { user: { userId: 'user1' } };
      const mockYear = { _id: '1', ...dto, closed: false, userId: 'user1' };
      mockYearService.create.mockResolvedValue(mockYear);

      const result = await controller.addYear(dto, req);

      expect(yearService.create).toHaveBeenCalledWith({ year: '2024', totalDays: 365 }, 'user1');
      expect(result).toEqual(mockYear);
    });
  });

  describe('getYearByYear', () => {
    it('should return year by year string', async () => {
      const req = { user: { userId: 'user1' } };
      const mockYear = { _id: '1', year: '2024', closed: false };
      mockYearService.getYearByYear.mockResolvedValue(mockYear);

      const result = await controller.getYearByYear('2024', req);

      expect(yearService.getYearByYear).toHaveBeenCalledWith('2024', 'user1');
      expect(result).toEqual(mockYear);
    });

    it('should throw NotFoundException when year not found', async () => {
      const req = { user: { userId: 'user1' } };
      mockYearService.getYearByYear.mockResolvedValue(null);

      await expect(controller.getYearByYear('2025', req)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException with correct message', async () => {
      const req = { user: { userId: 'user1' } };
      mockYearService.getYearByYear.mockResolvedValue(null);

      try {
        await controller.getYearByYear('2025', req);
      } catch (error) {
        expect((error as Error).message).toContain('2025');
      }
    });
  });

  describe('getYearById', () => {
    it('should return year by id', async () => {
      const req = { user: { userId: 'user1' } };
      const mockYear = { _id: '1', year: '2024', closed: false };
      mockYearService.getYearById.mockResolvedValue(mockYear);

      const result = await controller.getYearById('1', req);

      expect(yearService.getYearById).toHaveBeenCalledWith('1', 'user1');
      expect(result).toEqual(mockYear);
    });
  });

  describe('getClosedYears', () => {
    it('should return only closed years', async () => {
      const req = { user: { userId: 'user1' } };
      const allYears = [
        { _id: '1', year: '2023', closed: true },
        { _id: '2', year: '2024', closed: false },
        { _id: '3', year: '2022', closed: true },
      ];
      mockYearService.getYears.mockResolvedValue(allYears);

      const result = await controller.getClosedYears(req);

      expect(result).toEqual([
        { _id: '1', year: '2023', closed: true },
        { _id: '3', year: '2022', closed: true },
      ]);
    });

    it('should return empty array when no closed years exist', async () => {
      const req = { user: { userId: 'user1' } };
      mockYearService.getYears.mockResolvedValue([
        { _id: '1', year: '2024', closed: false },
      ]);

      const result = await controller.getClosedYears(req);

      expect(result).toEqual([]);
    });
  });

  describe('getOpenedYear', () => {
    it('should return the opened year', async () => {
      const req = { user: { userId: 'user1' } };
      const mockYear = { _id: '1', year: '2024', closed: false };
      mockYearService.getOpenedYear.mockResolvedValue(mockYear);

      const result = await controller.getOpenedYear(req);

      expect(yearService.getOpenedYear).toHaveBeenCalledWith('user1');
      expect(result).toEqual(mockYear);
    });

    it('should return null when no opened year exists', async () => {
      const req = { user: { userId: 'user1' } };
      mockYearService.getOpenedYear.mockResolvedValue(null);

      const result = await controller.getOpenedYear(req);

      expect(result).toBeNull();
    });
  });

  describe('getYearsByTopic', () => {
    it('should return years associated with a topic', async () => {
      const req = { user: { userId: 'user1' } };
      const mockYears = [
        { _id: '1', year: '2023' },
        { _id: '2', year: '2024' },
      ];
      mockYearService.getYearsByTopic.mockResolvedValue(mockYears);

      const result = await controller.getYearsByTopic('topic1', req);

      expect(yearService.getYearsByTopic).toHaveBeenCalledWith('topic1', 'user1');
      expect(result).toEqual(mockYears);
    });
  });
});
