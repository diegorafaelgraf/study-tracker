import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateTopicDto } from './topic.dto';

describe('CreateTopicDto', () => {
  it('trims the topic name', async () => {
    const dto = plainToInstance(CreateTopicDto, {
      name: '  Piano  ',
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.name).toBe('Piano');
  });

  it('allows icon to be optional', async () => {
    const dto = plainToInstance(CreateTopicDto, {
      name: 'Guitar',
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.icon).toBeUndefined();
  });

  it('fails validation when name is empty', async () => {
    const dto = plainToInstance(CreateTopicDto, {
      name: '   ',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'name')).toBe(true);
  });
});
