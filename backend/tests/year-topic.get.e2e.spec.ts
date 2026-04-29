import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp, loginAsAdmin } from './helpers/TestHelpers';

describe('YearTopic read endpoint (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let yearTopic: any;

  beforeAll(async () => {
    app = await createTestingApp();
    token = await loginAsAdmin(app.getHttpServer());

    await request(app.getHttpServer())
      .post('/api/years')
      .set('Authorization', `Bearer ${token}`)
      .send({ year: `year-${Date.now()}`, totalDays: 365 })
      .expect(201);

    const topicResponse = await request(app.getHttpServer())
      .post('/api/topics')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `topic-${Date.now()}` })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/year-topic')
      .set('Authorization', `Bearer ${token}`)
      .send({ topicId: topicResponse.body._id, goalMinutes: 90 })
      .expect(201)
      .then(resp => {
        yearTopic = resp.body;
      });
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/year-topic/:id returns the year-topic', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/year-topic/${yearTopic._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({ _id: yearTopic._id, goalMinutes: 90 });
  });
});
