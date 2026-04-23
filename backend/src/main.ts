import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupApp(app);

  // seed admin user
  const userService = app.get(UserService);
  await userService.createAdminIfNotExists();

  await app.listen(4000, '0.0.0.0');
}
bootstrap();