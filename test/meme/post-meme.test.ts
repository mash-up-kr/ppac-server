import request from 'supertest';

import app from '../../src/app';
import { IMemeCreatePayload, MemeModel } from '../../src/model/meme';
import { keywordIdsMockData } from '../util/meme.mock';

describe("[POST] '/api/meme' ", () => {
  afterAll(async () => {
    await MemeModel.deleteMany({});
  });

  it('should create a meme', async () => {
    const createPayload: IMemeCreatePayload = {
      title: 'emotion',
      keywordIds: [keywordIdsMockData[0]],
      image: 'example.com',
      source: 'youtube',
    };
    const response = await request(app).post('/api/meme').send(createPayload);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('title');
    expect(response.body.data).toHaveProperty('keywordIds');
    expect(response.body.data).toHaveProperty('image');
    expect(response.body.data).toHaveProperty('source');
    expect(response.body.data).toHaveProperty('isTodayMeme');
  });

  it('should not create a meme if missing required fields - keywordIds', async () => {
    const missingPayload = {
      image: 'example.com',
      source: 'youtube',
    };
    const response = await request(app).post('/api/meme').send(missingPayload);
    expect(response.statusCode).toBe(400);
  });

  it('should not create a meme if missing required fields - image', async () => {
    const missingPayload = {
      keywordIds: keywordIdsMockData,
      source: 'youtube',
    };
    const response = await request(app).post('/api/meme').send(missingPayload);
    expect(response.statusCode).toBe(400);
  });

  it('should not create a meme if missing required fields - source', async () => {
    const missingPayload = {
      keywordIds: keywordIdsMockData,
      image: 'example.com',
    };
    const response = await request(app).post('/api/meme').send(missingPayload);
    expect(response.statusCode).toBe(400);
  });
});
