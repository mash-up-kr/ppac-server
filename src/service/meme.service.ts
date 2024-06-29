import _ from 'lodash';
import { Types } from 'mongoose';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IMemeCreatePayload, IMemeDocument, MemeModel, IMemeWithKeywords } from '../model/meme';
import { logger } from '../util/logger';

async function getMeme(memeId: string): Promise<IMemeWithKeywords | null> {
  try {
    const meme = await MemeModel.aggregate([
      { $match: { _id: memeId, isDeleted: false } },
      {
        $lookup: {
          from: 'keyword',
          localField: 'keywordIds',
          foreignField: '_id',
          as: 'keywords',
        },
      },
      {
        $addFields: {
          keywords: '$keywords.name',
        },
      },
      {
        $unset: 'keywordIds',
      },
    ]);

    if (!meme) {
      logger.info(`Meme(${memeId}) not found.`);
      return null;
    }

    return meme[0] || null;
  } catch (err) {
    logger.error(`Failed to get a meme(${memeId}): ${err.message}`);
    throw new CustomError(`Failed to get a meme(${memeId})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function getTodayMemeList(limit: number = 5): Promise<IMemeWithKeywords[]> {
  const todayMemeList = await MemeModel.aggregate([
    { $match: { isTodayMeme: true, isDeleted: false } },
    { $limit: limit },
    {
      $lookup: {
        from: 'keyword',
        localField: 'keywordIds',
        foreignField: '_id',
        as: 'keywords',
      },
    },
    {
      $addFields: {
        keywords: '$keywords.name',
      },
    },
    {
      $unset: 'keywordIds',
    },
  ]);

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

  const memeObj = meme.toObject();
  logger.info(`Created meme - meme(${JSON.stringify(memeObj)}})`);
  return memeObj;
}

async function updateMeme(memeId: Types.ObjectId, updateInfo: any): Promise<IMemeDocument> {
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

async function deleteMeme(memeId: Types.ObjectId): Promise<boolean> {
  const deletedMeme = await MemeModel.findOneAndDelete(
    { _id: memeId },
    { $set: { isDeleted: true } },
  ).lean();

  if (_.isNull(deletedMeme)) {
    throw new CustomError(`Failed to delete a meme(${memeId})`, HttpCode.NOT_FOUND);
  }

  logger.info(`Delete Meme - meme(${memeId})`);
  return true;
}

export { getMeme, createMeme, updateMeme, deleteMeme, getTodayMemeList, getAllMemeList };
