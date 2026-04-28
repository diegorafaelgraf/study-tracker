import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp, loginAsAdmin } from './helpers/TestHelpers';

describe('User creation (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await createTestingApp();
    token = await loginAsAdmin(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/users creates a new user with ADMIN token', async () => {
    const username = `user-${Date.now()}`;
    const response = await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ username, password: 'P4ssword!', role: 'USER' })
      .expect(201);

    expect(response.body).toMatchObject({ username, role: 'USER' });
    expect(response.body).toHaveProperty('_id');
  });
});
