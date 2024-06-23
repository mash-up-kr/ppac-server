import request from 'supertest';

import app from '../../src/app';
import { MemeModel } from '../../src/model/meme';
import { createMockData } from '../util/meme.mock';

let testMemeId = '';
describe("[GET] '/api/meme/:memeId' ", () => {
  beforeAll(async () => {
    const mockDatas = createMockData(1, 0);
    await MemeModel.insertMany(mockDatas);
    const memeList = await MemeModel.find({});
    testMemeId = memeList[0]._id.toString();
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
  });

  it('should get a meme', async () => {
    const response = await request(app).get(`/api/meme/${testMemeId}`);
    expect(response.body._id).toBe(testMemeId);
    expect(response.body.keywords).toStrictEqual(['k1', 'k2', 'k3']);
    expect(response.body.isTodayMeme).toBeFalsy();
  });

  it('should not get a meme with nonexisting id', async () => {
    const response = await request(app).get(`/api/meme/nonexistingId`);
    expect(response.statusCode).toBe(400);
  });
});
