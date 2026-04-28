import { Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../../src/setup-app';
import { UserService } from '../../src/user/user.service';

export async function createTestingApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  setupApp(app);
  await app.init();

  const connection = app.get<Connection>(getConnectionToken());
  await connection.dropDatabase();

  const userService = app.get(UserService);
  await userService.createAdminIfNotExists();

  return app;
}

export async function loginAsAdmin(server: any): Promise<string> {
  const response = await request(server)
    .post('/auth/login')
    .send({ username: 'admin', password: 'admin' })
    .expect(201);

  return response.body.access_token;
}
