import { IMeme } from '../../src/model/meme';

const memeMockData: IMeme = {
  keywords: ['k1', 'k2', 'k3'],
  image: 'example.com',
  source: 'youtube',
  isTodayMeme: false,
  reaction: 0,
  watch: 0,
};

const createMockData = (size: number, todayMemeCount: number): IMeme[] => {
  const result: IMeme[] = [];

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

export { createMockData };
