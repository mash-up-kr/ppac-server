import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { IMemeCreatePayload, MemeModel } from '../../src/model/meme';
import { createMockData as createKeywordMockData } from '../util/keyword.mock';

let keywordIds = [];
let keywords = [];

describe("[POST] '/api/meme' ", () => {
  beforeAll(async () => {
    const keywordMockDatas = createKeywordMockData(5);
    const createdKeywords = await KeywordModel.insertMany(keywordMockDatas);
    keywordIds = createdKeywords.map((k) => k._id);
    keywords = createdKeywords.map((k) => k.name);
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
  });

  it('should create a meme', async () => {
    const createPayload: IMemeCreatePayload = {
      title: 'emotion',
      keywordIds: [keywordIds[0]],
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
      keywordIds: keywordIds,
      source: 'youtube',
    };
    const response = await request(app).post('/api/meme').send(missingPayload);
    expect(response.statusCode).toBe(400);
  });

  it('should not create a meme if missing required fields - source', async () => {
    const missingPayload = {
      keywordIds: keywordIds,
      image: 'example.com',
    };
    const response = await request(app).post('/api/meme').send(missingPayload);
    expect(response.statusCode).toBe(400);
  });
});
