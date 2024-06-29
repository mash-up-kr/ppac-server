import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { MemeModel } from '../../src/model/meme';
import { createMockData as createKeywordMockData } from '../util/keyword.mock';
import { createMockData as createMemeMockData, keywordIdsMockData } from '../util/meme.mock';

let testMemeId = '';
const createdKeywordIds = [];
let memeList = [];
describe("[GET] '/api/meme/:memeId' ", () => {
  beforeAll(async () => {
    // const mockKeywordDatas = createKeywordMockData(5);
    // const createdKeywords = await KeywordModel.insertMany(mockKeywordDatas);

    // createdKeywordIds = createdKeywords.map((k) => k._id);

    const mockDatas = createMemeMockData(1, 0);
    await MemeModel.insertMany(mockDatas);

    memeList = await MemeModel.find({});
    console.log(memeList);

    testMemeId = memeList[0]._id.toString();
    console.log(testMemeId, 'hihhi');
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
  });

  it('should get a meme', async () => {
    const response = await request(app).get(`/api/meme/${testMemeId}`);
    expect(response.body._id).toBe(testMemeId);

    const keywordIdsMockDataString = keywordIdsMockData.map((k) => k.toString());
    expect(response.body.keywordIds).toStrictEqual(keywordIdsMockDataString);
    expect(response.body.isTodayMeme).toBeFalsy();
  });

  it('should not get a meme with nonexisting id', async () => {
    const response = await request(app).get(`/api/meme/nonexistingId`);
    expect(response.statusCode).toBe(400);
  });
});
