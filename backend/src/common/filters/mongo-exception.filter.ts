import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {

    if (exception.code === 11000) {

      const duplicatedField = Object.keys(
        exception.keyPattern || {},
      )[0];

      let message = 'Registro duplicado';

      switch (duplicatedField) {

        case 'year':
          message = 'Ese año ya existe';
          break;

        case 'closed':
          message = 'Ya existe un año abierto';
          break;
      }

      throw new ConflictException(message);
    }

    throw exception;
  }
}