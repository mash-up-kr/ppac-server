import _ from 'lodash';
import { Types } from 'mongoose';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IKeywordCreatePayload, KeywordModel, IKeywordDocument } from '../model/keyword';
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
    logger.error(`Failed to create keyword ${info.name}: ${err.message}`);
    throw new CustomError('Failed to create keyword', HttpCode.INTERNAL_SERVER_ERROR);
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
    throw new CustomError(`Keyword with ID ${keywordId} not found`, HttpCode.NOT_FOUND);
  }

  logger.info(`Update keyword - keyword(${keywordId})`);
  return updatedKeyword;
}
async function deleteKeyword(keywordId: Types.ObjectId): Promise<boolean> {
  const deletedKeyword = await KeywordModel.findOneAndDelete({ _id: keywordId }).lean();
  if (!deletedKeyword) {
    throw new CustomError(`Keyword with ID ${keywordId} not found`, HttpCode.NOT_FOUND);
  }
  return true;
}

async function getTopKeywords(limit: number = 6): Promise<IKeywordDocument[]> {
  try {
    const topKeywords = await KeywordModel.find().sort({ searchCount: -1 }).limit(limit).lean();
    return topKeywords;
  } catch (err) {
    logger.error(`Failed to get top keywords: ${err.message}`);
    throw new CustomError('Failed to get top keywords', HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function increaseSearchCount(keywordId: Types.ObjectId): Promise<IKeywordDocument> {
  try {
    const updatedKeyword = await KeywordModel.findOneAndUpdate(
      { _id: keywordId },
      { $inc: { searchCount: 1 } },
      { new: true },
    );
    if (!updatedKeyword) {
      throw new CustomError(`KeywordId ${keywordId} not found`, HttpCode.NOT_FOUND);
    }
    return updatedKeyword;
  } catch (err) {
    logger.error(`Failed to increase searchCount for keywordId ${keywordId}: ${err.message}`);
    throw new CustomError('Failed to increase searchCount', HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function getKeywordByName(keywordName: string): Promise<IKeywordDocument> {
  try {
    const keyword = await KeywordModel.findOne({ name: keywordName, isDeleted: false }).lean();
    return keyword;
  } catch (err) {
    logger.info(`Failed to get a Keyword Info By Name(${keywordName})`);
  }
}

async function getKeywordById(keywordId: Types.ObjectId): Promise<IKeywordDocument> {
  try {
    const keyword = await KeywordModel.findOne({ _id: keywordId, isDeleted: false }).lean();
    return keyword;
  } catch (err) {
    logger.info(`Failed to get a Keyword Info By id (${keywordId})`);
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
};
