import { Types } from 'mongoose';

import { IMeme } from '../../src/model/meme';

const keywordIdsMockData = [new Types.ObjectId(), new Types.ObjectId(), new Types.ObjectId()];

const memeMockData = {
  title: 'emotion',
  keywordIds: keywordIdsMockData,
  image: 'example.com',
  source: 'youtube',
  isTodayMeme: false,
  reaction: 0,
  watch: 0,
};

const createMockData = (size: number, todayMemeCount: number): IMeme[] => {
  const result: IMeme[] = [];

  console.log(memeMockData);

  for (let i = 0; i < size; i++) {
    const mockData = { ...memeMockData };

    if (i < todayMemeCount) {
      mockData.isTodayMeme = true;
    } else {
      mockData.isTodayMeme = false;
    }

    mockData.reaction = Math.floor(Math.random() * 51);

    result.push(mockData);
  }

  return result;
};

export { createMockData, keywordIdsMockData };
