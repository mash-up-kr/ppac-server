import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { IMemeUpdatePayload, MemeModel } from '../../src/model/meme';
import { createMockData as createKeywordMockData } from '../util/keyword.mock';
import { createMockData } from '../util/meme.mock';

let memeList = [];
let keywordIds = [];
let keywords = [];

let testMemeId = '';
describe("[PATCH] '/api/meme/:memeId' ", () => {
  beforeAll(async () => {
    const keywordMockDatas = createKeywordMockData(5);
    const createdKeywords = await KeywordModel.insertMany(keywordMockDatas);
    keywordIds = createdKeywords.map((k) => k._id);
    keywords = createdKeywords.map((k) => k.name);

    const mockDatas = createMockData(1, 0);
    await MemeModel.insertMany(mockDatas);
    memeList = await MemeModel.find({});
    testMemeId = memeList[0]._id.toString();
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
  });

  it('should patch a meme', async () => {
    const patchPayload: Partial<IMemeUpdatePayload> = {
      keywordIds: [keywordIds[1]],
      isTodayMeme: true,
    };
    let response = await request(app).patch(`/api/meme/${testMemeId}`).send(patchPayload);
    expect(response.statusCode).toBe(200);
    expect(response.body.data._id).toBe(memeList[0]._id.toString());

    response = await request(app).get(`/api/meme/${testMemeId}`);
    expect(response.body.data._id).toBe(memeList[0]._id.toString());
    expect(response.body.data.keywords).toEqual([keywords[1]]);
    expect(response.body.data.isTodayMeme).toBeTruthy();
  });
});
