import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { MemeModel } from '../../src/model/meme';
import { UserModel } from '../../src/model/user';
import { createMockData as createKeywordMockData } from '../util/keyword.mock';
import { createMockData } from '../util/meme.mock';
import { mockUser } from '../util/user.mock';

const totalCount = 10;
let keywordIds = [];

describe("[GET] '/api/meme/recommend-memes' ", () => {
  beforeEach(async () => {
    const keywordMockDatas = createKeywordMockData(5);
    const createdKeywords = await KeywordModel.insertMany(keywordMockDatas);
    keywordIds = createdKeywords.map((k) => k._id);
    await UserModel.insertMany(mockUser);
  });

  afterEach(async () => {
    await MemeModel.deleteMany({});
    await KeywordModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  it('should return list of recommend-memes - default size: 5', async () => {
    const mockDatas = createMockData(totalCount, 20, keywordIds);
    await MemeModel.insertMany(mockDatas);

    const response = await request(app)
      .get('/api/meme/recommend-memes')
      .set('x-device-id', 'deviceId');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(20);
  });

  it('should return list of recommend-memes - customize size', async () => {
    const customizedTodayMemeCount = 3;
    const mockDatas = createMockData(totalCount, customizedTodayMemeCount, keywordIds);
    await MemeModel.insertMany(mockDatas);

    const response = await request(app)
      .get(`/api/meme/recommend-memes?size=${customizedTodayMemeCount}`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(customizedTodayMemeCount);
  });

  it('should not return list of recommend-memes - customize size: bigger than limit(5)', async () => {
    const customizedTodayMemeCount = 10;
    const mockDatas = createMockData(totalCount, customizedTodayMemeCount, keywordIds);
    await MemeModel.insertMany(mockDatas);

    const response = await request(app)
      .get(`/api/meme/recommend-memes?size=${customizedTodayMemeCount}`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(400);
  });
});
