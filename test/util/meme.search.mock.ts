import { Types } from 'mongoose';

import { IMeme } from '../../src/model/meme';

// 검색 기능 테스트 전용 mock
// !TODO: 필요시 마음대로 추가해도 됨
// '야근', '학교' 로 검색했을 때 결과가 나올 수 있게 세팅한 mock
const memeMockData = [
  {
    deviceId: 'sample_deviceId',
    title: '오늘도 또 야근입니까?',
    source: '무한도전',
    keywordIds: [],
    image: 'example.com',
    isTodayMeme: false,
    reaction: 0,
  },
  {
    deviceId: 'sample_deviceId',
    title: '저 오늘부로 그냥 퇴사하겠습니다.',
    source: '야근에 미쳐버린 직장인',
    keywordIds: [],
    image: 'example.com',
    isTodayMeme: false,
    reaction: 10,
  },
  {
    deviceId: 'sample_deviceId',
    title: '학교안가',
    source: '작자미상',
    keywordIds: [],
    image: 'example.com',
    isTodayMeme: false,
    reaction: 0,
  },
  {
    deviceId: 'sample_deviceId',
    title: '절레절레',
    source: '열혈초등학교',
    keywordIds: [],
    image: 'example.com',
    isTodayMeme: false,
    reaction: 22,
  },
  {
    deviceId: 'sample_deviceId',
    title: '이제 그만 다니고 싶다. 학교...',
    source: '대학일기',
    keywordIds: [],
    image: 'example.com',
    isTodayMeme: false,
    reaction: 22,
  },
];

const createMemeSearchMockData = (keywordIds: Types.ObjectId[] = []): IMeme[] =>
  memeMockData.map((meme) => ({
    ...meme,
    keywordIds,
  }));

export { createMemeSearchMockData };
