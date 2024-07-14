import _ from 'lodash';
import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { MemeModel } from '../../src/model/meme';
import { UserModel } from '../../src/model/user';
import { createMockData as createKeywordMockData } from '../util/keyword.mock';
import { createMockData as createMemeMockData } from '../util/meme.mock';
import { mockUser } from '../util/user.mock';

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

    await UserModel.insertMany(mockUser);
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  it('should get a meme', async () => {
    const response = await request(app)
      .get(`/api/meme/${testMemeId}`)
      .set('x-device-id', 'deviceId');
    expect(response.body.data._id).toBe(testMemeId);
    expect(response.body.data).toHaveProperty('keywords');
    expect(response.body.data.isTodayMeme).toBeFalsy();
  });

  it('should not get a meme with nonexisting id', async () => {
    const response = await request(app)
      .get(`/api/meme/nonexistingId`)
      .set('x-device-id', 'deviceId');
    expect(response.statusCode).toBe(400);
  });
});
