import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp, loginAsAdmin } from './helpers/TestHelpers';

describe('Year close (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let year: any;

  beforeAll(async () => {
    app = await createTestingApp();
    token = await loginAsAdmin(app.getHttpServer());

    const yearResponse = await request(app.getHttpServer())
      .post('/api/years')
      .set('Authorization', `Bearer ${token}`)
      .send({ year: `year-${Date.now()}`, totalDays: 365 })
      .expect(201);
    year = yearResponse.body;
  });

  afterAll(async () => {
    await app.close();
  });

  it('PATCH /api/years/:id/close should close the year', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/years/${year._id}/close`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({
      _id: year._id,
      year: year.year,
      closed: true,
    });
  });
});