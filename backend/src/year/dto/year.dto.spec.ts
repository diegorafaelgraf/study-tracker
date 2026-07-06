import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateYearDto } from './year.dto';

describe('CreateYearDto', () => {
  it('trims and uppercases the year field', async () => {
    const dto = plainToInstance(CreateYearDto, {
      year: '  2024 ',
      totalDays: 365,
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.year).toBe('2024');
  });

  it('fails validation when year is empty', async () => {
    const dto = plainToInstance(CreateYearDto, {
      year: '   ',
      totalDays: 365,
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'year')).toBe(true);
  });

  it('fails validation when totalDays is not a number', async () => {
    const dto = plainToInstance(CreateYearDto, {
      year: '2024',
      totalDays: 'not-a-number',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'totalDays')).toBe(true);
  });
});
