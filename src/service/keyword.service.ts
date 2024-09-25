import _ from 'lodash';
import { Types } from 'mongoose';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import {
  IKeywordCreatePayload,
  KeywordModel,
  IKeywordDocument,
  IKeywordGetResponse,
} from '../model/keyword';
import { KeywordCategoryModel } from '../model/keywordCategory';
import { logger } from '../util/logger';

async function createKeyword(info: IKeywordCreatePayload): Promise<IKeywordDocument> {
  try {
    const newKeyword = await KeywordModel.create({
      ...info,
    });

    await newKeyword.save();

    const newKeywordObj = newKeyword.toObject();
    logger.info(`Created new keyword: ${JSON.stringify(newKeywordObj)}`);

    return newKeywordObj;
  } catch (err) {
    throw new CustomError(
      `Failed to create keyword ${info.name}: ${err.message}`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function updateKeyword(
  keywordId: Types.ObjectId,
  updateInfo: any,
): Promise<IKeywordDocument> {
  const updatedKeyword = await KeywordModel.findOneAndUpdate(
    { _id: keywordId, isDeleted: false },
    { $set: updateInfo },
    { new: true },
  ).lean();

  if (_.isNull(updatedKeyword)) {
    throw new CustomError(`Keyword(${keywordId}) not found`, HttpCode.NOT_FOUND);
  }

  logger.info(`Update keyword - Keyword(${keywordId})`);
  return updatedKeyword;
}

async function deleteKeyword(keywordId: Types.ObjectId): Promise<boolean> {
  const deletedKeyword = await KeywordModel.findOneAndDelete({ _id: keywordId }).lean();
  if (_.isNull(deletedKeyword)) {
    throw new CustomError(`Keyword(${keywordId}) not found`, HttpCode.NOT_FOUND);
  }
  return true;
}

async function getTopKeywords(limit: number = 6): Promise<IKeywordDocument[]> {
  try {
    const topKeywords = await KeywordModel.find({}, { isDeleted: 0 })
      .sort({ searchCount: -1 })
      .limit(limit)
      .lean();
    return topKeywords;
  } catch (err) {
    throw new CustomError(
      `Failed to get top keywords: ${err.message}`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function increaseSearchCount(keywordId: Types.ObjectId): Promise<IKeywordDocument> {
  try {
    const updatedKeyword = await KeywordModel.findOneAndUpdate(
      { _id: keywordId },
      { $inc: { searchCount: 1 } },
      { new: true, projection: { isDeleted: 0 } },
    ).lean();
    if (_.isNull(updatedKeyword)) {
      throw new CustomError(`KeywordId(${keywordId}) not found`, HttpCode.NOT_FOUND);
    }
    return updatedKeyword;
  } catch (err) {
    throw new CustomError(
      `Failed to increase searchCount for keywordId ${keywordId}: ${err.message}`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getKeywordByName(keywordName: string): Promise<IKeywordDocument | null> {
  try {
    const keyword = await KeywordModel.findOne({ name: keywordName, isDeleted: false }).lean();
    return keyword || null;
  } catch (err) {
    throw new CustomError(
      `Failed to get a Keyword Info By Name(${keywordName}): ${err.message}`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getKeywordById(keywordId: Types.ObjectId): Promise<IKeywordDocument | null> {
  try {
    const keyword = await KeywordModel.findOne({ _id: keywordId, isDeleted: false }).lean();
    return keyword || null;
  } catch (err) {
    throw new CustomError(
      `Failed to get a Keyword Info By id(${keywordId}): ${err.message}`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getKeywordInfoByKeywordIds(
  keywordIds: Types.ObjectId[],
): Promise<IKeywordGetResponse[]> {
  try {
    const keyword = await KeywordModel.find(
      { _id: { $in: keywordIds }, isDeleted: false },
      {
        _id: 1,
        name: 1,
      },
    ).lean();
    return keyword;
  } catch (err) {
    throw new CustomError(
      `Failed to get a Keyword Info By keywordIds(${JSON.stringify(keywordIds)}): ${err.message}`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getRecommendedKeywords(): Promise<
  { title: string; keywords: IKeywordGetResponse[] }[]
> {
  try {
    const result = await KeywordCategoryModel.aggregate([
      {
        $match: {
          isRecommend: true,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'keyword', // The name of the keywords collection
          localField: 'name',
          foreignField: 'category',
          as: 'keywords',
        },
      },
      {
        $project: {
          _id: 0,
          category: '$name',
          keywords: {
            $map: {
              input: '$keywords',
              as: 'keyword',
              in: {
                name: '$$keyword.name',
                _id: '$$keyword._id',
              },
            },
          },
        },
      },
    ]);

    logger.info('Successfully retrieved recommended keywords');
    return result;
  } catch (err) {
    throw new CustomError(
      `Failed to get recommended keywords: ${err.message}`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getSearchedKeywords(term: string): Promise<Types.ObjectId[]> {
  try {
    const searchedKeywords = await KeywordModel.find({
      name: { $regex: term, $options: 'i' },
    });

    const keywordIds: Types.ObjectId[] = searchedKeywords.map((keyword) => keyword._id);
    logger.info(`Successfully searched keywords with term ${term}`);
    return keywordIds;
  } catch (err) {
    logger.error(`Failed to search keywords with term '${term}' - ${err.message}`);
    throw new CustomError(
      `Failed to search keywords with term '${term}'`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

export {
  createKeyword,
  updateKeyword,
  deleteKeyword,
  getTopKeywords,
  increaseSearchCount,
  getKeywordByName,
  getKeywordById,
  getRecommendedKeywords,
  getKeywordInfoByKeywordIds,
  getSearchedKeywords,
};
