import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp, loginAsAdmin } from './helpers/TestHelpers';

describe('Health endpoint (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await createTestingApp();
    token = await loginAsAdmin(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health returns ok', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/health')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({ status: 'ok' });
  });
});
