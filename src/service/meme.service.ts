import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IMemeCreatePayload, IMemeDocument, MemeModel } from '../model/meme';
import { logger } from '../util/logger';

async function getMeme(memeId: string): Promise<IMemeDocument | null> {
  try {
    const meme = await MemeModel.findOne({ _id: memeId, isDeleted: false });
    if (!meme) {
      logger.info(`Meme(${memeId}) not found.`);
      return null;
    }

    return meme.toObject() as IMemeDocument;
  } catch (err) {
    logger.error(`Failed to get a meme(${memeId}): ${err.message}`);
    throw new CustomError(`Failed to get a meme(${memeId})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function getTodayMemeList(limit: number = 5): Promise<IMemeDocument[]> {
  const todayMemeList = await MemeModel.find({ isTodayMeme: true, isDeleted: false })
    .limit(limit)
    .lean();

  const memeIds = todayMemeList.map((meme) => meme._id);
  logger.info(
    `Get all today meme list(${todayMemeList.length}) - memeIds(${memeIds}), limit(${limit})`,
  );
  return todayMemeList;
}

async function getAllMemeList(
  page: number,
  size: number,
): Promise<{ total: number; page: number; totalPages: number; data: IMemeDocument[] }> {
  const totalMemes = await MemeModel.countDocuments();

  const memeList = await MemeModel.find({ isDeleted: false })
    .skip((page - 1) * size)
    .limit(size)
    .sort({ createdAt: -1 });
  logger.info(`Get all meme list - page(${page}), size(${size}), total(${totalMemes})`);

  return {
    total: totalMemes,
    page,
    totalPages: Math.ceil(totalMemes / size),
    data: memeList,
  };
}

async function createMeme(info: IMemeCreatePayload): Promise<IMemeDocument> {
  const meme = await MemeModel.create({
    ...info,
  });

  await meme.save();
  logger.info(`Created meme - meme(${JSON.stringify(meme.toObject())}})`);
  return meme.toObject();
}

async function updateMeme(memeId: string, updateInfo: any): Promise<IMemeDocument> {
  const meme = await MemeModel.findOneAndUpdate(
    { _id: memeId, isDeleted: false },
    { $set: updateInfo },
    { new: true },
  ).lean();

  if (_.isNull(meme)) {
    throw new CustomError(`Failed to update a meme(${memeId})`, HttpCode.NOT_FOUND);
  }

  logger.info(`Update meme - meme(${memeId})`);
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

  logger.info(`Delete Meme - meme(${memeId})`);
  return true;
}

export { getMeme, createMeme, updateMeme, deleteMeme, getTodayMemeList, getAllMemeList };
