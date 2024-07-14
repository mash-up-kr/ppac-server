import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { MemeModel } from '../../src/model/meme';
import { UserModel } from '../../src/model/user';
import { createMockData as createKeywordMockData } from '../util/keyword.mock';
import { createMockData } from '../util/meme.mock';
import { mockUser } from '../util/user.mock';

const totalCount = 15;
let keywordIds = [];
let keywords = [];

describe("[GET] '/api/meme/list' ", () => {
  beforeAll(async () => {
    const keywordMockDatas = createKeywordMockData(5);
    const createdKeywords = await KeywordModel.insertMany(keywordMockDatas);
    keywordIds = createdKeywords.map((k) => k._id);
    keywords = createdKeywords.map((k) => k.name);

    const memeMockDatas = createMockData(totalCount, 1, keywordIds);
    await MemeModel.insertMany(memeMockDatas);

    await UserModel.insertMany(mockUser);
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  it('should return the default paginated list of memes', async () => {
    const response = await request(app).get('/api/meme/list').set('x-device-id', 'deviceId');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.pagination.total).toBe(totalCount);
    expect(response.body.data.pagination.page).toBe(1);
    expect(response.body.data.pagination.totalPages).toBe(2);
    expect(response.body.data.memeList.length).toBe(10);
    expect(response.body.data.memeList[0]).toHaveProperty('keywordIds');
    expect(response.body.data.memeList[0]).toHaveProperty('image');
    expect(response.body.data.memeList[0]).toHaveProperty('source');
    expect(response.body.data.memeList[0]).toHaveProperty('isTodayMeme');
    expect(response.body.data.memeList[0]).toHaveProperty('reaction');
  });

  it('should return paginated list of memes for specific page and size', async () => {
    const size = 5;
    const page = 1;
    const response = await request(app)
      .get(`/api/meme/list?page=${page}&size=${size}`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.pagination.total).toBe(totalCount);
    expect(response.body.data.pagination.page).toBe(page);
    expect(response.body.data.pagination.totalPages).toBe(3);
    expect(response.body.data.memeList.length).toBe(size);
  });

  it('should return an error for invalid page', async () => {
    const size = 5;
    const page = -1;
    const response = await request(app)
      .get(`/api/meme/list?page=${page}&size=${size}`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(400);
  });

  it('should return an error for invalid size', async () => {
    const size = -1;
    const page = 3;
    const response = await request(app)
      .get(`/api/meme/list?page=${page}&size=${size}`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(400);
  });
});
