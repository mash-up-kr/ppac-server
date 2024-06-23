import { IKeywordCreatePayload, KeywordModel, IKeyword } from '../model/keyword';
import { logger } from '../util/logger';
import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';

async function createKeyword(payload: IKeywordCreatePayload): Promise<IKeyword> {
  try {
    const newKeyword = new KeywordModel({
      ...payload,
    });
    await newKeyword.save();
    logger.info(`Created new keyword: ${JSON.stringify(newKeyword)}`);
    return newKeyword;
  } catch (err) {
    logger.error(`Failed to create keyword ${payload.name}: ${err.message}`);
    throw new CustomError('Failed to create keyword', HttpCode.INTERNAL_SERVER_ERROR);
  }
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

async function deleteKeyword(keywordId: string): Promise<boolean> {
  const deletedKeyword = await KeywordModel.findOneAndDelete({ _id: keywordId }).lean();
  if (!deletedKeyword) {
    throw new CustomError(`Keyword with ID ${keywordId} not found`, HttpCode.NOT_FOUND);
  }
  return true;
}

export { createKeyword, getTopKeywords, deleteKeyword };
