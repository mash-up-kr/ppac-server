import request from 'supertest';

import app from '../../src/app';
import { IMemeCreatePayload, MemeModel } from '../../src/model/meme';
import { createMockData } from '../util/meme.mock';

let testMemeId = '';
describe("[PATCH] '/api/meme/:memeId' ", () => {
  beforeAll(async () => {
    const mockDatas = createMockData(1, 0);
    await MemeModel.insertMany(mockDatas);
    const memeList = await MemeModel.find({});
    testMemeId = memeList[0]._id.toString();
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
  });

  it('should patch a meme', async () => {
    const patchPayload: Partial<IMemeCreatePayload> = {
      keywords: ['k2'],
      isTodayMeme: true,
    };
    let response = await request(app).patch(`/api/meme/${testMemeId}`).send(patchPayload);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(testMemeId);

    response = await request(app).get(`/api/meme/${testMemeId}`);
    expect(response.body._id).toBe(testMemeId);
    expect(response.body.keywords).toStrictEqual(['k2']);
    expect(response.body.isTodayMeme).toBeTruthy();
  });
});
