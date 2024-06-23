import request from 'supertest';

import app from '../../src/app';
import { MemeModel } from '../../src/model/meme';
import { createMockData } from '../util/meme.mock';

const totalCount = 10;

describe("[GET] '/api/meme/todayMeme' ", () => {
  afterEach(async () => {
    await MemeModel.deleteMany({});
  });

  it('should return list of todayMeme - default size: 5', async () => {
    const mockDatas = createMockData(totalCount, 5);
    await MemeModel.insertMany(mockDatas);

    const response = await request(app).get('/api/meme/todayMeme');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(5);
  });

  it('should return list of todayMeme - customize size', async () => {
    const customizedTodayMemeCount = 3;
    const mockDatas = createMockData(totalCount, customizedTodayMemeCount);
    await MemeModel.insertMany(mockDatas);

    const response = await request(app).get(`/api/meme/todayMeme?size=${customizedTodayMemeCount}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(customizedTodayMemeCount);
  });

  it('should not return list of todayMeme - customize size: bigger than limit(5)', async () => {
    const customizedTodayMemeCount = 10;
    const mockDatas = createMockData(totalCount, customizedTodayMemeCount);
    await MemeModel.insertMany(mockDatas);

    const response = await request(app).get(`/api/meme/todayMeme?size=${customizedTodayMemeCount}`);

    expect(response.statusCode).toBe(400);
  });
});
