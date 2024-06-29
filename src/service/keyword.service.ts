import { IKeywordCreatePayload, KeywordModel, IKeyword } from '../model/keyword';
import { logger } from '../util/logger';
import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';

async function createKeyword(info: IKeywordCreatePayload): Promise<IKeyword> {
  try {
    const newKeyword = new KeywordModel({
      ...info,
    });
    await newKeyword.save();
    logger.info(`Created new keyword: ${JSON.stringify(newKeyword)}`);
    return newKeyword.toObject();
  } catch (err) {
    logger.error(`Failed to create keyword ${info.name}: ${err.message}`);
    throw new CustomError('Failed to create keyword', HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function updateKeyword(keywordId: string, update: Partial<IKeyword>): Promise<IKeyword> {
  const updatedKeyword = await KeywordModel.findOneAndUpdate({ _id: keywordId }, update, {
    new: true,
  }).lean();
  if (!updatedKeyword) {
    throw new CustomError(`Keyword with ID ${keywordId} not found`, HttpCode.NOT_FOUND);
  }
  return updatedKeyword;
}

async function deleteKeyword(keywordId: string): Promise<boolean> {
  const deletedKeyword = await KeywordModel.findOneAndDelete({ _id: keywordId }).lean();
  if (!deletedKeyword) {
    throw new CustomError(`Keyword with ID ${keywordId} not found`, HttpCode.NOT_FOUND);
  }
  return true;
}

async function getTopKeywords(limit: number = 6): Promise<IKeyword[]> {
  try {
    const topKeywords = await KeywordModel.find().sort({ searchCount: -1 }).limit(limit).lean();
    return topKeywords;
  } catch (err) {
    logger.error(`Failed to get top keywords: ${err.message}`);
    throw new CustomError('Failed to get top keywords', HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function increaseSearchCount(keywordId: string): Promise<IKeyword> {
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

async function getKeywordByName(keywordName: string): Promise<IKeyword> {
  try {
    const keyword = await KeywordModel.findOne({ name: keywordName, isDeleted: false }).lean();
    return keyword;
  } catch (err) {
    logger.info(`Failed to get a Keyword Info By Name(${keywordName})`);
  }
}

async function getKeywordById(keywordId: string): Promise<IKeyword> {
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
