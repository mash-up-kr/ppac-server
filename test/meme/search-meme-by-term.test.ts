import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { MemeModel } from '../../src/model/meme';
import { UserModel } from '../../src/model/user';
import { createMockData as createKeywordMockData } from '../util/keyword.mock';
import { createMemeSearchMockData } from '../util/meme.search.mock';
import { mockUser } from '../util/user.mock';

let keywordIds = [];
let keywords = [];

// 검색 - 검색어
describe("[GET] '/api/meme/search?q={term}' ", () => {
  beforeAll(async () => {
    // 현재 keyword를 검색에 직접적으로 사용하지 않으므로 mock data 만들기 용으로만 사용한다.
    const keywordMockDatas = createKeywordMockData(5);
    const createdKeywords = await KeywordModel.insertMany(keywordMockDatas);
    keywordIds = createdKeywords.map((k) => k._id);
    keywords = createdKeywords.map((k) => k.name);

    const memeMockDatas = createMemeSearchMockData(keywordIds);
    await MemeModel.insertMany(memeMockDatas);
    await UserModel.insertMany(mockUser);
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  it(`should return searched meme list - 야근`, async () => {
    const response = await request(app)
      .get(`/api/meme/search?q=야근`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.pagination.total).toBe(2);
    expect(response.body.data.pagination.page).toBe(1);
    expect(response.body.data.pagination.totalPages).toBe(1);
    expect(response.body.data.memeList.length).toBe(2);

    const memeList = response.body.data.memeList;
    expect(memeList[0]).toHaveProperty('keywordIds');
    expect(memeList[0]).toHaveProperty('image');
    expect(memeList[0]).toHaveProperty('source');
    expect(memeList[0]).toHaveProperty('isTodayMeme');
    expect(memeList[0]).toHaveProperty('reaction');
    expect(memeList[1].reaction).toBeLessThanOrEqual(memeList[0].reaction); // reaction 내림차순 정렬 확인
  });

  it(`should return searched meme list - 학교`, async () => {
    const response = await request(app)
      .get(`/api/meme/search?q=학교`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.pagination.total).toBe(3);
    expect(response.body.data.pagination.page).toBe(1);
    expect(response.body.data.pagination.totalPages).toBe(1);
    expect(response.body.data.memeList.length).toBe(3);

    const memeList = response.body.data.memeList;
    expect(memeList[0]).toHaveProperty('keywordIds');
    expect(memeList[0]).toHaveProperty('image');
    expect(memeList[0]).toHaveProperty('source');
    expect(memeList[0]).toHaveProperty('isTodayMeme');
    expect(memeList[0]).toHaveProperty('reaction');
    expect(memeList[1].reaction).toBeLessThanOrEqual(memeList[0].reaction); // reaction 내림차순 정렬 확인
  });

  it('should return paginated list of memes for specific page and size', async () => {
    const size = 2;
    const page = 1;
    const response = await request(app)
      .get(`/api/meme/search?q=학교&page=${page}&size=${size}`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.pagination.total).toBe(3);
    expect(response.body.data.pagination.page).toBe(page);
    expect(response.body.data.pagination.totalPages).toBe(2);
    expect(response.body.data.memeList.length).toBe(size);
  });

  it('should return an error for invalid page', async () => {
    const size = 5;
    const page = -1;
    const response = await request(app)
      .get(`/api/meme/search?q=무한&page=${page}&size=${size}`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(400);
  });

  it('should return an error for invalid size', async () => {
    const size = -1;
    const page = 3;
    const response = await request(app)
      .get(`/api/meme/search?q=무한&page=${page}&size=${size}`)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(400);
  });
});
