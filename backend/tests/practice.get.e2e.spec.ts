import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp, loginAsAdmin } from './helpers/TestHelpers';

describe('Practice read endpoint (e2e)', () => {
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

    const yearTopicResponse = await request(app.getHttpServer())
      .post('/api/year-topic')
      .set('Authorization', `Bearer ${token}`)
      .send({ topicId: topicResponse.body._id, goalMinutes: 60 })
      .expect(201);

    yearTopic = yearTopicResponse.body;

    await request(app.getHttpServer())
      .post('/api/practice')
      .set('Authorization', `Bearer ${token}`)
      .send({ yearTopicId: yearTopic._id, date: new Date().toISOString(), durationMinutes: 30 })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/practice/by-year-topic/:yearTopicId returns practices for the year-topic', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/practice/by-year-topic/${yearTopic._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ yearTopicId: yearTopic._id }),
    ]));
  });
});
