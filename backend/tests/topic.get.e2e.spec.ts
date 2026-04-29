import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp, loginAsAdmin } from './helpers/TestHelpers';

describe('Topic read endpoints (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let topic: any;
  let year: any;

  beforeAll(async () => {
    app = await createTestingApp();
    token = await loginAsAdmin(app.getHttpServer());

    const yearName = `year-${Date.now()}`;
    const yearResponse = await request(app.getHttpServer())
      .post('/api/years')
      .set('Authorization', `Bearer ${token}`)
      .send({ year: yearName, totalDays: 365 })
      .expect(201);
    year = yearResponse.body;

    const topicName = `topic-${Date.now()}`;
    const topicResponse = await request(app.getHttpServer())
      .post('/api/topics')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: topicName })
      .expect(201);
    topic = topicResponse.body;

    await request(app.getHttpServer())
      .post('/api/year-topic')
      .set('Authorization', `Bearer ${token}`)
      .send({ topicId: topic._id, goalMinutes: 120 })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/topics returns the created topic', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/topics')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ _id: topic._id, name: topic.name }),
    ]));
  });

  it('GET /api/topics/by-name/:name returns the topic', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/topics/by-name/${topic.name}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({ _id: topic._id, name: topic.name });
  });

  it('GET /api/topics/by-id/:id returns the topic', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/topics/by-id/${topic._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({ _id: topic._id, name: topic.name });
  });

  it('GET /api/topics/by-year/:yearId returns the created topic', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/topics/by-year/${year._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ _id: topic._id, name: topic.name }),
    ]));
  });

  it('GET /api/topics/by-current-year returns the created topic', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/topics/by-current-year')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ _id: topic._id, name: topic.name }),
    ]));
  });
});
