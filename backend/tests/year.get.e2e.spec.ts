import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { createTestingApp, loginAsAdmin } from './helpers/TestHelpers';

describe('Year read endpoints (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let server: any;
  let year: any;
  let topic: any;

  beforeAll(async () => {
    app = await createTestingApp();
    token = await loginAsAdmin(app.getHttpServer());
    server = app.getHttpServer();

    const yearName = `year-${Date.now()}`;
    const yearResponse = await request(server)
      .post('/api/years')
      .set('Authorization', `Bearer ${token}`)
      .send({ year: yearName, totalDays: 365 })
      .expect(201);
    year = yearResponse.body;

    const topicResponse = await request(server)
      .post('/api/topics')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `topic-${Date.now()}` })
      .expect(201);
    topic = topicResponse.body;

    await request(server)
      .post('/api/year-topic')
      .set('Authorization', `Bearer ${token}`)
      .send({ topicId: topic._id, goalMinutes: 120 })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/years returns a list of years', async () => {
    const response = await request(server)
      .get('/api/years')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ _id: year._id, year: year.year }),
    ]));
  });

  it('GET /api/years/by-year/:year returns the year', async () => {
    const response = await request(server)
      .get(`/api/years/by-year/${year.year}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({ _id: year._id, year: year.year });
  });

  it('GET /api/years/by-id/:id returns the year', async () => {
    const response = await request(server)
      .get(`/api/years/by-id/${year._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({ _id: year._id, year: year.year });
  });

  it('GET /api/years/opened returns the current open year', async () => {
    const response = await request(server)
      .get('/api/years/opened')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({ _id: year._id, year: year.year, closed: false });
  });

  it('GET /api/years/closed returns closed years after update', async () => {
    const connection = app.get<Connection>(getConnectionToken());
    const yearModel = connection.model('Year');
    await yearModel.findByIdAndUpdate(year._id, { closed: true }).exec();

    const response = await request(server)
      .get('/api/years/closed')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ _id: year._id, year: year.year, closed: true }),
    ]));
  });

  it('GET /api/years/by-topic/:topicId returns the year related to the topic', async () => {
    const response = await request(server)
      .get(`/api/years/by-topic/${topic._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ _id: year._id, year: year.year }),
    ]));
  });
});
