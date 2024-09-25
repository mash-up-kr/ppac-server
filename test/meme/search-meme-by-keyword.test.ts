import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { MemeModel } from '../../src/model/meme';
import { UserModel } from '../../src/model/user';
import { keywordMockData } from '../util/keyword.search.mock';
import { createMockData as createMemeMockData } from '../util/meme.mock';
import { mockUser } from '../util/user.mock';

// 검색 - 키워드
describe("[GET] '/api/meme/search/:name' ", () => {
  beforeAll(async () => {
    const createdKeywords = await KeywordModel.insertMany(keywordMockData);

    let keywordIds = [];
    keywordIds = createdKeywords.map((k) => k._id);
    // 각 키워드마다 밈을 5개씩 생성

    keywordIds.map(async (k) => {
      await MemeModel.insertMany(createMemeMockData(5, 0, [k]));
    });

    await UserModel.insertMany(mockUser);
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  it(`should return searched meme list by keyword - 분노`, async () => {
    const response = await request(app).get(`/api/meme/search/분노`).set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.pagination.total).toBe(5);
    expect(response.body.data.pagination.page).toBe(1);
    expect(response.body.data.pagination.totalPages).toBe(1);
    expect(response.body.data.memeList.length).toBe(5);

    const memeList = response.body.data.memeList;
    expect(memeList[0].keywords).toContainEqual({ _id: expect.any(String), name: '분노' }); // 해당 keyword를 가지고 있는지 검증
    expect(memeList[0]).toHaveProperty('image');
    expect(memeList[0]).toHaveProperty('source');
    expect(memeList[0]).toHaveProperty('isTodayMeme');
    expect(memeList[0]).toHaveProperty('reaction');
    expect(memeList[1].reaction).toBeLessThanOrEqual(memeList[0].reaction); // reaction 내림차순 정렬 검증
  });

  it(`should return searched meme list by keyword - 고민`, async () => {
    const response = await request(app).get(`/api/meme/search/고민`).set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.pagination.total).toBe(5);
    expect(response.body.data.pagination.page).toBe(1);
    expect(response.body.data.pagination.totalPages).toBe(1);
    expect(response.body.data.memeList.length).toBe(5);

    const memeList = response.body.data.memeList;
    expect(memeList[0].keywords).toContainEqual({ _id: expect.any(String), name: '고민' }); // 해당 keyword를 가지고 있는지 검증
    expect(memeList[0]).toHaveProperty('image');
    expect(memeList[0]).toHaveProperty('source');
    expect(memeList[0]).toHaveProperty('isTodayMeme');
    expect(memeList[0]).toHaveProperty('reaction');
    expect(memeList[1].reaction).toBeLessThanOrEqual(memeList[0].reaction); // reaction 내림차순 정렬 검증
  });

  it(`should return paginated list of memes for specific page and size`, async () => {
    const size = 2;
    const page = 1;
    const response = await request(app)
      .get(`/api/meme/search/고민?page=${page}&size=${size}`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.pagination.total).toBe(5);
    expect(response.body.data.pagination.page).toBe(1);
    expect(response.body.data.pagination.totalPages).toBe(3);
    expect(response.body.data.memeList.length).toBe(size);

    const memeList = response.body.data.memeList;
    expect(memeList[0].keywords).toContainEqual({ _id: expect.any(String), name: '고민' }); // 해당 keyword를 가지고 있는지 검증
    expect(memeList[0]).toHaveProperty('image');
    expect(memeList[0]).toHaveProperty('source');
    expect(memeList[0]).toHaveProperty('isTodayMeme');
    expect(memeList[0]).toHaveProperty('reaction');
    expect(memeList[1].reaction).toBeLessThanOrEqual(memeList[0].reaction); // reaction 내림차순 정렬 검증
  });

  it(`should return an error for invalid keyword - 존재하지않는키워드`, async () => {
    const response = await request(app)
      .get(`/api/meme/search/존재하지않는키워드`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(404);
  });

  it('should return an error for invalid page', async () => {
    const size = 5;
    const page = -1;
    const response = await request(app)
      .get(`/api/meme/search/다이어트?page=${page}&size=${size}`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(400);
  });

  it('should return an error for invalid size', async () => {
    const size = -1;
    const page = 3;
    const response = await request(app)
      .get(`/api/meme/search/다이어트?page=${page}&size=${size}`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(400);
  });
});
