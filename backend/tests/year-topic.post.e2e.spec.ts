import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp, loginAsAdmin } from './helpers/TestHelpers';

describe('YearTopic creation (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let topic: any;

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
    topic = topicResponse.body;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/year-topic creates a new year-topic association', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/year-topic')
      .set('Authorization', `Bearer ${token}`)
      .send({ topicId: topic._id, goalMinutes: 90 })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body).toMatchObject({ topicId: topic._id.toString(), goalMinutes: 90 });
  });
});
