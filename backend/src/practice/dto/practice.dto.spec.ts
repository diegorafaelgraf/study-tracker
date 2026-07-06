import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePracticeDto } from './practice.dto';

describe('CreatePracticeDto', () => {
  it('validates a correct practice payload', async () => {
    const dto = plainToInstance(CreatePracticeDto, {
      date: '2026-01-01T12:00:00.000Z',
      durationMinutes: 45,
      yearTopicId: 'abc123',
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.date).toBe('2026-01-01T12:00:00.000Z');
  });

  it('fails validation on invalid date string', async () => {
    const dto = plainToInstance(CreatePracticeDto, {
      date: 'not-a-date',
      durationMinutes: 45,
      yearTopicId: 'abc123',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'date')).toBe(true);
  });

  it('fails validation on missing yearTopicId', async () => {
    const dto = plainToInstance(CreatePracticeDto, {
      date: '2026-01-01T12:00:00.000Z',
      durationMinutes: 45,
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'yearTopicId')).toBe(true);
  });
});
