import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { MemeModel } from '../../src/model/meme';
import { UserModel } from '../../src/model/user';
import { createMockData as createKeywordMockData } from '../util/keyword.mock';
import { createMockData } from '../util/meme.mock';
import { mockUser } from '../util/user.mock';

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

    await UserModel.insertMany(mockUser);
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  it('should delete a meme', async () => {
    let response = await request(app).delete(`/api/meme/${testMemeId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeTruthy();

    response = await request(app).get(`/api/meme/list`).set('x-device-id', 'deviceId');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.memeList.length).toBe(1);
  });
});
