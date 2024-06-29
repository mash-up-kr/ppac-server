import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { MemeModel } from '../../src/model/meme';
import { createMockData as createKeywordMockData } from '../util/keyword.mock';
import { createMockData } from '../util/meme.mock';

let testMemeId = '';
let keywordIds = [];

let memeList = [];
describe("[DELETE] '/api/meme/:memeId' ", () => {
  beforeAll(async () => {
    const keywordMockDatas = createKeywordMockData(5);
    const createdKeywords = await KeywordModel.insertMany(keywordMockDatas);
    keywordIds = createdKeywords.map((k) => k._id);

    const mockDatas = createMockData(2, 0);
    await MemeModel.insertMany(mockDatas);
    memeList = await MemeModel.find({});
    testMemeId = memeList[0]._id.toString();
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
  });

  it('should delete a meme', async () => {
    let response = await request(app).delete(`/api/meme/${testMemeId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeTruthy();

    response = await request(app).get(`/api/meme/list`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.memeList.length).toBe(1);
  });
});
