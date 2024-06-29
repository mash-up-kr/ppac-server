import { IKeyword } from '../../src/model/keyword';

const createMockData = (size: number): IKeyword[] => {
  const result: IKeyword[] = [];

  for (let i = 0; i < size; i++) {
    const mockData: IKeyword = { name: `sad${i}`, searchCount: 0, category: 'emotion' };

    result.push(mockData);
  }

  return result;
};

export { createMockData };
