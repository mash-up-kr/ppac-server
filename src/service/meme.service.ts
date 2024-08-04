import _ from 'lodash';
import { Types } from 'mongoose';

import * as KeywordService from './keyword.service';
import * as MemeInteractionService from './memeInteraction.service';
import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IKeywordDocument } from '../model/keyword';
import { IMemeCreatePayload, IMemeDocument, MemeModel, IMemeGetResponse } from '../model/meme';
import { InteractionType } from '../model/memeInteraction';
import { IUserDocument } from '../model/user';
import { logger } from '../util/logger';

async function getMeme(memeId: string): Promise<IMemeDocument | null> {
  try {
    const meme = await MemeModel.findById(memeId)
      .and([{ isDeleted: false }])
      .lean();

    return meme || null;
  } catch (err) {
    logger.error(`Failed to get a meme(${memeId}): ${err.message}`);
    throw new CustomError(`Failed to get a meme(${memeId})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function getMemeWithKeywords(
  user: IUserDocument,
  meme: IMemeDocument,
): Promise<IMemeGetResponse> {
  try {
    const keywords = await KeywordService.getKeywordInfoByKeywordIds(meme.keywordIds);
    const isSaved = await MemeInteractionService.getMemeInteractionInfo(
      user,
      meme,
      InteractionType.SAVE,
      true, // {isDeleted: false} 조건으로 save 상태인지 확인
    );

    return {
      ..._.omit(meme, 'keywordIds'),
      keywords,
      isSaved: !_.isNil(isSaved),
    };
  } catch (err) {
    logger.error(`Failed to get a meme(${meme._id}) with keywords: ${err.message}`);
    throw new CustomError(
      `Failed to get a meme(${meme._id}) with keywords`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getTodayMemeList(
  limit: number = 5,
  user: IUserDocument,
): Promise<IMemeGetResponse[]> {
  try {
    const todayMemeList = await MemeModel.find(
      { isDeleted: false, isTodayMeme: true },
      { isDeleted: 0 },
    ).lean();

    const memeList = await getMemeListWithKeywordsAndisSavedAndisReaction(user, todayMemeList);

    const memeIds = todayMemeList.map((meme) => meme._id);
    logger.info(
      `Get all today meme list(${todayMemeList.length}) - memeIds(${memeIds}), limit(${limit})`,
    );

    return memeList;
  } catch (err) {
    logger.error(`Failed to get today meme list: ${err.message}`);
    throw new CustomError(
      `Failed to get today meme list ${err.message}`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getAllMemeList(
  page: number,
  size: number,
  user: IUserDocument,
): Promise<{ total: number; page: number; totalPages: number; data: IMemeGetResponse[] }> {
  const totalMemes = await MemeModel.countDocuments();

  const memeList = await MemeModel.find({ isDeleted: false }, { isDeleted: 0 })
    .skip((page - 1) * size)
    .limit(size)
    .sort({ createdAt: -1 })
    .lean();

  const allMemeList = await getMemeListWithKeywordsAndisSavedAndisReaction(user, memeList);

  logger.info(`Get all meme list - page(${page}), size(${size}), total(${totalMemes})`);

  return {
    total: totalMemes,
    page,
    totalPages: Math.ceil(totalMemes / size),
    data: allMemeList,
  };
}

// MemeList에서 keywords와 isSaved 정보를 확인하여 추가 반환
async function getMemeListWithKeywordsAndisSavedAndisReaction(
  user: IUserDocument,
  memeList: IMemeDocument[],
): Promise<IMemeGetResponse[]> {
  try {
    return await Promise.all(
      memeList.map(async (meme: IMemeDocument) => {
        const keywords = await KeywordService.getKeywordInfoByKeywordIds(meme.keywordIds);
        const isSaved = await MemeInteractionService.getMemeInteractionInfo(
          user,
          meme,
          InteractionType.SAVE,
          true, // {isDeleted: false} 조건으로 save 상태인지 확인
        );
        const isReaction = await MemeInteractionService.getMemeInteractionInfo(
          user,
          meme,
          InteractionType.REACTION,
          true,
        );
        return {
          ..._.omit(meme, 'keywordIds'),
          keywords,
          isSaved: !_.isNil(isSaved),
          isReaction: !_.isNil(isReaction),
        } as IMemeGetResponse;
      }),
    );
  } catch (err) {
    logger.error('Failed to get keywords and isSaved info from meme list', err.message);
    throw new CustomError(
      `Failed to get keywords and isSaved info from meme list ${err.message}`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
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
    { _id: memeId, isDeleted: false },
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
  user: IUserDocument,
): Promise<{ total: number; page: number; totalPages: number; data: IMemeGetResponse[] }> {
  try {
    const totalMemes = await MemeModel.countDocuments({
      keywordIds: { $in: keyword._id },
      isDeleted: false,
    });

    const searchedMemeList = await MemeModel.find(
      { isDeleted: false, keywordIds: { $in: keyword._id } },
      { isDeleted: 0 },
    )
      .skip((page - 1) * size)
      .limit(size)
      .sort({ reaction: -1 })
      .lean();

    const memeList = await getMemeListWithKeywordsAndisSavedAndisReaction(user, searchedMemeList);

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
    // 'save' interaction은 isDeleted 조건 검색 필요없음
    const isDeletedFilter = interactionType === InteractionType.SAVE ? false : true;

    // interaction 조회
    const memeInteraction = await MemeInteractionService.getMemeInteractionInfo(
      user,
      meme,
      interactionType,
      isDeletedFilter,
    );

    if (_.isNull(memeInteraction)) {
      // 신규 생성
      await MemeInteractionService.createMemeInteraction(user, meme, interactionType);
    } else {
      logger.info(
        `Already ${interactionType} meme - deviceId(${user.deviceId}), memeId(${meme._id})`,
      );

      // interactionType에 따른 동작 처리 (MemeInteracionService에서 진행)
      await MemeInteractionService.updateMemeInteraction(user, meme, interactionType);
    }
    return true;
  } catch (err) {
    logger.error(`Failed to create memeInteraction(${interactionType})`, err.message);

    throw new CustomError(
      `Failed to create memeInteraction(${interactionType}) (${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function deleteMemeSave(user: IUserDocument, meme: IMemeDocument): Promise<boolean> {
  try {
    await MemeInteractionService.deleteMemeInteraction(user, meme, InteractionType.SAVE);
    return true;
  } catch (err) {
    logger.error(`Failed to delete meme save`, err.message);
    throw new CustomError(
      `Failed to delete meme save(${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getTopReactionImage(keyword: IKeywordDocument): Promise<string> {
  try {
    const topReactionMeme: IMemeDocument = await MemeModel.findOne({
      isDeleted: false,
      keywordIds: { $in: [keyword._id] },
    }).sort({
      reaction: -1,
    });

    if (_.isNull(topReactionMeme)) {
      throw new CustomError(`Failed get top reaction meme image`, HttpCode.NOT_FOUND);
    }

    logger.info(`Get top reaction meme - keyword(${keyword.name}), meme(${topReactionMeme._id})`);
    return topReactionMeme.image;
  } catch (err) {
    logger.error(`Failed get top reaction meme image`, err.message);
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
  getMemeListWithKeywordsAndisSavedAndisReaction,
  deleteKeywordOfMeme,
  getMemeWithKeywords,
  searchMemeByKeyword,
  getTopReactionImage,
};
