import { ConflictException } from '@nestjs/common';
import { MongoExceptionFilter } from './mongo-exception.filter';
import { MongoServerError } from 'mongodb';

describe('MongoExceptionFilter', () => {
  const filter = new MongoExceptionFilter();

  it('converts duplicate year errors into ConflictException with a message', () => {
    const exception = new MongoServerError({
      message: 'duplicate key error',
      code: 11000,
      keyPattern: { year: 1 },
    } as any);

    expect(() => filter.catch(exception, {} as any)).toThrow(ConflictException);
    expect(() => filter.catch(exception, {} as any)).toThrow('Ese año ya existe');
  });

  it('converts duplicate open year errors into ConflictException with a specific message', () => {
    const exception = new MongoServerError({
      message: 'duplicate key error',
      code: 11000,
      keyPattern: { closed: 1 },
    } as any);

    expect(() => filter.catch(exception, {} as any)).toThrow(ConflictException);
    expect(() => filter.catch(exception, {} as any)).toThrow('Ya existe un año abierto');
  });

  it('rethrows unknown mongodb errors', () => {
    const exception = new MongoServerError({
      message: 'some other error',
      code: 12345,
    } as any);

    expect(() => filter.catch(exception, {} as any)).toThrow(exception);
  });
});
