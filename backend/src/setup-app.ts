import { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { MongoExceptionFilter } from "./common/filters/mongo-exception.filter";

export function setupApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new MongoExceptionFilter());
}