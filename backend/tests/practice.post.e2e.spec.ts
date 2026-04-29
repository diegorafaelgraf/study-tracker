import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp, loginAsAdmin } from './helpers/TestHelpers';

describe('Practice creation (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let yearTopicId: string;

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

    const yearTopicResponse = await request(app.getHttpServer())
      .post('/api/year-topic')
      .set('Authorization', `Bearer ${token}`)
      .send({ topicId: topicResponse.body._id, goalMinutes: 60 })
      .expect(201);

    yearTopicId = yearTopicResponse.body._id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/practice creates a new practice', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/practice')
      .set('Authorization', `Bearer ${token}`)
      .send({ yearTopicId, date: new Date().toISOString(), durationMinutes: 45 })
      .expect(201);

    expect(response.body).toMatchObject({ yearTopicId, durationMinutes: 45 });
  });
});
