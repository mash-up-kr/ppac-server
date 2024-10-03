import request from 'supertest';

import app from '../../src/app';
import { KeywordModel } from '../../src/model/keyword';
import { IMemeCreatePayload, MemeModel } from '../../src/model/meme';
import { UserModel } from '../../src/model/user';
import { createMockData as createKeywordMockData } from '../util/keyword.mock';
import { mockUser } from '../util/user.mock';

let keywordIds = [];
let keywords = [];

jest.mock('../../src/util/image', () => ({
  upload: {
    single: jest.fn(() => (req, res, next) => {
      req.file = {
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('mocked file buffer'),
      };
      next();
    }),
  },
  compressAndUploadImageToS3: jest.fn((req, res, next) => {
    req.file.location = `https://bucket.s3.com`; // S3 URL
    next();
  }),
}));

describe("[POST] '/api/meme' ", () => {
  beforeAll(async () => {
    const keywordMockDatas = createKeywordMockData(5);
    const createdKeywords = await KeywordModel.insertMany(keywordMockDatas);
    keywordIds = createdKeywords.map((k) => k._id);
    keywords = createdKeywords.map((k) => k.name);

    await UserModel.insertMany(mockUser);

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await MemeModel.deleteMany({});
  });

  it('should create a meme', async () => {
    const createPayload: IMemeCreatePayload = {
      deviceId: 'deviceId',
      title: 'emotion',
      keywordIds: [keywordIds[0]],
      image: 'https://bucket.s3.com',
      source: 'youtube',
      watch: 0,
    };

    const response = await request(app)
      .post('/api/meme')
      .send(createPayload)
      .set('x-device-id', 'deviceId');

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('title');
    expect(response.body.data).toHaveProperty('keywordIds');
    expect(response.body.data).toHaveProperty('image');
    expect(response.body.data).toHaveProperty('source');
    expect(response.body.data).toHaveProperty('isTodayMeme');
  });

  it('should not create a meme if missing required fields - keywordIds', async () => {
    const missingPayload = {
      image: 'https://bucket.s3.com',
      source: 'youtube',
    };
    const response = await request(app)
      .post('/api/meme')
      .send(missingPayload)
      .set('x-device-id', 'deviceId');
    expect(response.statusCode).toBe(400);
  });

  it('should not create a meme if missing required fields - image', async () => {
    const missingPayload = {
      keywordIds: keywordIds,
      source: 'youtube',
    };
    const response = await request(app)
      .post('/api/meme')
      .send(missingPayload)
      .set('x-device-id', 'deviceId');
    expect(response.statusCode).toBe(400);
  });

  it('should not create a meme if missing required fields - source', async () => {
    const missingPayload = {
      keywordIds: keywordIds,
      image: 'https://bucket.s3.com',
    };
    const response = await request(app)
      .post('/api/meme')
      .send(missingPayload)
      .set('x-device-id', 'deviceId');
    expect(response.statusCode).toBe(400);
  });
});
