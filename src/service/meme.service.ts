import _ from 'lodash';
import { Types } from 'mongoose';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IKeywordDocument } from '../model/keyword';
import { IMemeCreatePayload, IMemeDocument, MemeModel, IMemeWithKeywords } from '../model/meme';
import { InteractionType, MemeInteractionModel } from '../model/memeInteraction';
import { IUserDocument } from '../model/user';
import { logger } from '../util/logger';

async function getMeme(memeId: string): Promise<IMemeDocument | null> {
  try {
    const meme = await MemeModel.findById(memeId)
      .and([{ isDeleted: false }])
      .lean();

    if (!meme) {
      logger.info(`Meme(${memeId}) not found.`);
      return null;
    }

    return meme;
  } catch (err) {
    logger.error(`Failed to get a meme(${memeId}): ${err.message}`);
    throw new CustomError(`Failed to get a meme(${memeId})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function getMemeWithKeywords(memeId: string): Promise<IMemeWithKeywords | null> {
  try {
    const meme = await MemeModel.aggregate([
      { $match: { _id: new Types.ObjectId(memeId), isDeleted: false } },
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
      { $project: { keywordIds: 0 } },
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
    { $project: { keywordIds: 0 } },
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

async function deleteKeywordOfMeme(deleteKeywordId: Types.ObjectId) {
  await MemeModel.updateMany(
    { keywordIds: deleteKeywordId },
    { $pull: { keywordIds: deleteKeywordId } },
  );
}

async function searchMemeByKeyword(
  page: number,
  size: number,
  keyword: IKeywordDocument,
): Promise<{ total: number; page: number; totalPages: number; data: IMemeDocument[] }> {
  try {
    const totalMemes = await MemeModel.countDocuments({
      keywordIds: { $in: keyword._id },
      isDeleted: false,
    });

    const memeList = await MemeModel.find(
      { keywordIds: { $in: keyword._id } },
      { createdAt: 0, updatedAt: 0 },
    )
      .skip((page - 1) * size)
      .limit(size)
      .sort({ reaction: -1 })
      .populate('keywordIds', 'name')
      .lean();

    logger.info(
      `Get all meme list with keyword(${keyword.name}) - page(${page}), size(${size}), total(${totalMemes})`,
    );

    return {
      total: totalMemes,
      page,
      totalPages: Math.ceil(totalMemes / size),
      data: memeList,
    };
  } catch (err) {
    logger.error(`Failed to search meme list with keyword(${keyword})`, err.message);
    throw new CustomError(
      `Failed to search meme list with keyword(${keyword})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function createMemeInteraction(
  user: IUserDocument,
  meme: IMemeDocument,
  interactionType: InteractionType,
): Promise<boolean> {
  try {
    const memeInteraction = await MemeInteractionModel.findOne({
      memeId: meme._id,
      deviceId: user.deviceId,
      interactionType,
      isDeleted: false,
    });

    // 밈당 interaction은 1회
    if (!_.isNull(memeInteraction)) {
      logger.info(
        `Already ${interactionType} meme - deviceId(${user.deviceId}), memeId(${meme._id}`,
      );
    } else {
      const newMemeInteraction = await MemeInteractionModel.create({
        memeId: meme._id,
        deviceId: user.deviceId,
        interactionType,
      });
      await newMemeInteraction.save();
    }

    // 'reaction'인 경우에만 Meme의 reaction 수를 업데이트한다.
    if (interactionType === InteractionType.REACTION) {
      await MemeModel.findOneAndUpdate(
        { memeId: meme._id },
        { $inc: { reaction: 1 } },
        {
          projection: { _id: 0, createdAt: 0, updatedAt: 0 },
          returnDocument: 'after',
        },
      ).lean();
    }

    return true;
  } catch (err) {
    logger.error(`Failed to create memeInteraction`, err.message);
    throw new CustomError(
      `Failed to create memeInteraction(${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function deleteMemeSave(user: IUserDocument, meme: IMemeDocument): Promise<boolean> {
  try {
    const meemSaveInteraction = await MemeInteractionModel.findOne({
      memeId: meme._id,
      deviceId: user.deviceId,
      interactionType: InteractionType.SAVE,
      isDeleted: false,
    });

    if (_.isNull(meemSaveInteraction)) {
      logger.info(`Already delete memeSave - deviceId(${user.deviceId}), memeId(${meme._id}`);
      return false;
    }

    await MemeInteractionModel.findOneAndUpdate(
      { deviceId: user.deviceId, memeId: meme._id, interactionType: InteractionType.SAVE },
      {
        isDeleted: true,
      },
    ).lean();

    return true;
  } catch (err) {
    logger.error(`Failed delete memeSave`, err.message);
    throw new CustomError(`Failed delete memeSave(${err.message})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}
async function getTopReactionImage(keyword: IKeywordDocument): Promise<string> {
  try {
    const topReactionMeme: IMemeDocument = await MemeModel.findOne({
      keywordIds: { $in: [keyword._id] },
    }).sort({
      reaction: -1,
    });

    logger.info(`Get top reaction meme - keyword(${keyword.name}), meme(${topReactionMeme._id})`);
    return topReactionMeme.image;
  } catch (err) {
    logger.error(`Failed get top reaction meme`, err.message);
    throw new CustomError(
      `Failed get top reaction meme(${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

export {
  getMeme,
  createMeme,
  createMemeInteraction,
  updateMeme,
  deleteMeme,
  deleteMemeSave,
  getTodayMemeList,
  getAllMemeList,
  deleteKeywordOfMeme,
  getMemeWithKeywords,
  searchMemeByKeyword,
  getTopReactionImage,
};
