import request from 'supertest';

import app from '../../src/app';
import { MemeModel } from '../../src/model/meme';
import { createMockData } from '../util/meme.mock';

let testMemeId = '';
let memeList = [];
describe("[DELETE] '/api/meme/:memeId' ", () => {
  beforeAll(async () => {
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
    expect(response.body.result).toBeTruthy();

    response = await request(app).get(`/api/meme/list`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
  });
});
