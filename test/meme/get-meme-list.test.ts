import request from 'supertest';

import app from '../../src/app';
import { MemeModel } from '../../src/model/meme';
import { createMockData } from '../util/meme.mock';

const totalCount = 15;

describe("[GET] '/api/meme/list' ", () => {
  beforeAll(async () => {
    const mockDatas = createMockData(totalCount, 1);
    await MemeModel.insertMany(mockDatas);
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
  });

  it('should return the default paginated list of memes', async () => {
    const response = await request(app).get('/api/meme/list');
    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(totalCount);
    expect(response.body.page).toBe(1);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.data.length).toBe(10);
    expect(response.body.data[0]).toHaveProperty('keywords');
    expect(response.body.data[0]).toHaveProperty('image');
    expect(response.body.data[0]).toHaveProperty('source');
    expect(response.body.data[0]).toHaveProperty('isTodayMeme');
    expect(response.body.data[0]).toHaveProperty('reaction');
  });

  it('should return paginated list of memes for specific page and size', async () => {
    const size = 5;
    const page = 1;
    const response = await request(app).get(`/api/meme/list?page=${page}&size=${size}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(totalCount);
    expect(response.body.page).toBe(page);
    expect(response.body.totalPages).toBe(3);
    expect(response.body.data.length).toBe(size);
  });

  it('should return an error for invalid page', async () => {
    const size = 5;
    const page = -1;
    const response = await request(app).get(`/api/meme/list?page=${page}&size=${size}`);

    expect(response.statusCode).toBe(400);
  });

  it('should return an error for invalid size', async () => {
    const size = -1;
    const page = 3;
    const response = await request(app).get(`/api/meme/list?page=${page}&size=${size}`);

    expect(response.statusCode).toBe(400);
  });
});
