import { ValidationPipe } from '@nestjs/common';
import { setupApp } from './setup-app';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';

describe('setupApp', () => {
  it('configures cors, validation pipe and exception filter', () => {
    const app: any = {
      enableCors: jest.fn(),
      useGlobalPipes: jest.fn(),
      useGlobalFilters: jest.fn(),
    };

    setupApp(app);

    expect(app.enableCors).toHaveBeenCalledWith({ origin: true });
    expect(app.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
    expect(app.useGlobalFilters).toHaveBeenCalledWith(expect.any(MongoExceptionFilter));
  });
});
