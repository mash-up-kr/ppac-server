import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { MemeModel } from '../../src/model/meme';
import { createMockData as createKeywordMockData } from '../util/keyword.mock';
import { createMockData } from '../util/meme.mock';

const totalCount = 10;
let keywordIds = [];
let keywords = [];

describe("[GET] '/api/meme/recommend-meme' ", () => {
  beforeEach(async () => {
    const keywordMockDatas = createKeywordMockData(5);
    const createdKeywords = await KeywordModel.insertMany(keywordMockDatas);
    keywordIds = createdKeywords.map((k) => k._id);
    keywords = createdKeywords.map((k) => k.name);
  });

  afterEach(async () => {
    await MemeModel.deleteMany({});
    await KeywordModel.deleteMany({});
  });

  it('should return list of recommend-meme - default size: 5', async () => {
    const mockDatas = createMockData(totalCount, 5, keywordIds);
    await MemeModel.insertMany(mockDatas);

    const response = await request(app).get('/api/meme/recommend-meme');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(5);
  });

  it('should return list of recommend-meme - customize size', async () => {
    const customizedTodayMemeCount = 3;
    const mockDatas = createMockData(totalCount, customizedTodayMemeCount, keywordIds);
    await MemeModel.insertMany(mockDatas);

    const response = await request(app).get(
      `/api/meme/recommend-meme?size=${customizedTodayMemeCount}`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(customizedTodayMemeCount);
  });

  it('should not return list of recommend-meme - customize size: bigger than limit(5)', async () => {
    const customizedTodayMemeCount = 10;
    const mockDatas = createMockData(totalCount, customizedTodayMemeCount, keywordIds);
    await MemeModel.insertMany(mockDatas);

    const response = await request(app).get(
      `/api/meme/recommend-meme?size=${customizedTodayMemeCount}`,
    );

    expect(response.statusCode).toBe(400);
  });
});
