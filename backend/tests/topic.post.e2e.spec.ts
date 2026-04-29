import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestingApp, loginAsAdmin } from './helpers/TestHelpers';

describe('Topic creation (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await createTestingApp();
    token = await loginAsAdmin(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/topics creates a new topic', async () => {
    const topicName = `topic-${Date.now()}`;
    const response = await request(app.getHttpServer())
      .post('/api/topics')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: topicName })
      .expect(201);

    expect(response.body).toMatchObject({
      name: topicName,
    });
    expect(response.body).toHaveProperty('_id');
  });
});
