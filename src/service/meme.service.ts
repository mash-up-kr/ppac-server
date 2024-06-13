import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IMeme, IMemeCreatePayload, MemeModel } from '../model/meme';
import { logger } from '../util/logger';

async function getMeme(memeId: string): Promise<IMeme> {
  try {
    const meme = await MemeModel.findOne({ _id: memeId, isDeleted: false });
    return meme.toObject();
  } catch (err) {
    logger.debug(`Failed to get a meme(${memeId})`);
  }
}

async function getTodayMemeList(limit: number = 5): Promise<IMeme[]> {
  const todayMemeList = await MemeModel.find({ isTodayMeme: true, isDeleted: false })
    .limit(limit)
    .lean();

  logger.debug(`Get all today meme list(${todayMemeList}), limit(${limit})`);
  return todayMemeList;
}

async function createMeme(info: IMemeCreatePayload): Promise<IMeme> {
  const meme = await MemeModel.create({
    ...info,
  });

  await meme.save();
  logger.debug(`Created meme - meme(${JSON.stringify(meme.toObject())}})`);
  return meme.toObject();
}

async function updateMeme(memeId: string, updateInfo: any): Promise<IMeme> {
  const meme = await MemeModel.findOneAndUpdate(
    { _id: memeId, isDeleted: false },
    { $set: updateInfo },
    { new: true },
  ).lean();

  if (_.isNull(meme)) {
    throw new CustomError(`Failed to update a meme(${memeId})`, HttpCode.NOT_FOUND);
  }

  logger.debug(`Update meme - meme(${memeId})`);
  return meme;
}

async function deleteMeme(memeId: string): Promise<boolean> {
  const Meme = await MemeModel.findOneAndDelete(
    { _id: memeId },
    { $set: { isDeleted: true } },
  ).lean();

  if (_.isNull(Meme)) {
    throw new CustomError(`Failed to delete a meme(${memeId})`, HttpCode.NOT_FOUND);
  }

  logger.debug(`Delete Meme - meme(${memeId})`);
  return true;
}

export { getMeme, createMeme, updateMeme, deleteMeme, getTodayMemeList };
