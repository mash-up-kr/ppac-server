import { Types } from 'mongoose';

import { IMeme } from '../../src/model/meme';

const memeMockData = {
  deviceId: 'deviceId',
  title: 'emotion',
  keywordIds: [],
  image: 'example.com',
  source: 'youtube',
  isTodayMeme: false,
  reaction: 0,
  watch: 0,
};

const createMockData = (
  size: number,
  todayMemeCount: number,
  keywordIds: Types.ObjectId[] = [],
): IMeme[] => {
  const result: IMeme[] = [];

  for (let i = 0; i < size; i++) {
    const mockData = { ...memeMockData };

    mockData.keywordIds = keywordIds;

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

export { createMockData };
