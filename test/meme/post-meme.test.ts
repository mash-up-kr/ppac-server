import request from 'supertest';

import app from '../../src/app';
import { IMemeCreatePayload, MemeModel } from '../../src/model/meme';

describe("[POST] '/api/meme' ", () => {
  afterAll(async () => {
    await MemeModel.deleteMany({});
  });

  it('should create a meme', async () => {
    const createPayload: IMemeCreatePayload = {
      keywords: ['k1'],
      image: 'example.com',
      source: 'youtube',
      isTodayMeme: false,
    };
    const response = await request(app).post('/api/meme').send(createPayload);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('keywords');
    expect(response.body).toHaveProperty('image');
    expect(response.body).toHaveProperty('source');
    expect(response.body).toHaveProperty('isTodayMeme');
  });

  it('should not create a meme if missing required fields - keywords', async () => {
    const missingPayload = {
      image: 'example.com',
      source: 'youtube',
    };
    const response = await request(app).post('/api/meme').send(missingPayload);
    expect(response.statusCode).toBe(400);
  });

  it('should not create a meme if missing required fields - image', async () => {
    const missingPayload = {
      keywords: ['k1'],
      source: 'youtube',
    };
    const response = await request(app).post('/api/meme').send(missingPayload);
    expect(response.statusCode).toBe(400);
  });

  it('should not create a meme if missing required fields - source', async () => {
    const missingPayload = {
      keywords: ['k1'],
      image: 'example.com',
    };
    const response = await request(app).post('/api/meme').send(missingPayload);
    expect(response.statusCode).toBe(400);
  });
});
