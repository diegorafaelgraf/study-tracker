import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp, loginAsAdmin } from './helpers/TestHelpers';

describe('User change password (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  const username = `user-${Date.now()}`;
  const initialPassword = 'Initial123!';
  const newPassword = 'Updated123!';

  beforeAll(async () => {
    app = await createTestingApp();
    adminToken = await loginAsAdmin(app.getHttpServer());

    await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username, password: initialPassword, role: 'USER' })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password: initialPassword })
      .expect(201);

    userToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/users/change-password changes a user password', async () => {
    await request(app.getHttpServer())
      .post('/api/users/change-password')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ oldPassword: initialPassword, newPassword })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password: newPassword })
      .expect(201);
  });
});
