import _ from 'lodash';
import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { MemeModel } from '../../src/model/meme';
import { createMockData as createKeywordMockData } from '../util/keyword.mock';
import { createMockData as createMemeMockData } from '../util/meme.mock';

let testMemeId = '';
let keywordIds = [];
let memeList = [];

describe("[GET] '/api/meme/:memeId' ", () => {
  beforeAll(async () => {
    const keywordMockDatas = createKeywordMockData(5);
    const createdKeywords = await KeywordModel.insertMany(keywordMockDatas);

    keywordIds = createdKeywords.map((k) => k._id);

    const mockDatas = createMemeMockData(1, 0, keywordIds);
    await MemeModel.insertMany(mockDatas);

    memeList = await MemeModel.find({});
    testMemeId = memeList[0]._id.toString();
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
  });

  it('should get a meme', async () => {
    const response = await request(app).get(`/api/meme/${testMemeId}`);
    expect(response.body.data._id).toBe(testMemeId);
    expect(response.body.data).toHaveProperty('keywords');
    expect(response.body.data.isTodayMeme).toBeFalsy();
  });

  it('should not get a meme with nonexisting id', async () => {
    const response = await request(app).get(`/api/meme/nonexistingId`);
    expect(response.statusCode).toBe(400);
  });
});
