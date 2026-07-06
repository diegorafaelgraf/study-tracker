import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateYearTopicDto } from './year-topic.dto';

describe('CreateYearTopicDto', () => {
  it('validates a correct year-topic payload', async () => {
    const dto = plainToInstance(CreateYearTopicDto, {
      topicId: 'topic123',
      goalMinutes: 120,
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('fails validation when topicId is empty', async () => {
    const dto = plainToInstance(CreateYearTopicDto, {
      topicId: '',
      goalMinutes: 120,
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'topicId')).toBe(true);
  });

  it('fails validation when goalMinutes is not a number', async () => {
    const dto = plainToInstance(CreateYearTopicDto, {
      topicId: 'topic123',
      goalMinutes: 'not-a-number',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'goalMinutes')).toBe(true);
  });
});
