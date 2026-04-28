import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp, loginAsAdmin } from './helpers/TestHelpers';

describe('Year creation (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await createTestingApp();
    token = await loginAsAdmin(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/years creates a new year', async () => {
    const yearName = `year-${Date.now()}`;
    const response = await request(app.getHttpServer())
      .post('/api/years')
      .set('Authorization', `Bearer ${token}`)
      .send({ year: yearName, totalDays: 365 })
      .expect(201);

    expect(response.body).toMatchObject({
      year: yearName.toUpperCase(),
      totalDays: 365,
      closed: false,
    });
    expect(response.body).toHaveProperty('_id');
  });
});
