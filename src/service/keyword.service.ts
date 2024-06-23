import { IKeywordCreatePayload, KeywordModel, IKeyword } from '../model/keyword';
import { logger } from '../util/logger';
import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import mongoose from 'mongoose';

async function createKeyword(payload: IKeywordCreatePayload): Promise<IKeyword> {
  try {
    const newKeyword = new KeywordModel({
      name: payload.name,
      memeIDs: [],
      searchCount: 0,
      isDeleted: false,
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

async function incrementSearchCount(keywordId: string): Promise<IKeyword> {
  try {
    const updatedKeyword = await KeywordModel.findByIdAndUpdate(
      keywordId,
      { $inc: { searchCount: 1 } },
      { new: true },
    );
    if (!updatedKeyword) {
      throw new CustomError('Keyword not found', HttpCode.NOT_FOUND);
    }
    logger.info(`Incremented searchCount for keyword: ${JSON.stringify(updatedKeyword)}`);
    return updatedKeyword;
  } catch (err) {
    logger.error(`Failed to increment searchCount for keyword ${keywordId}: ${err.message}`);
    throw new CustomError('Failed to increment searchCount', HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function addMemeToKeyword(
  keywordId: string,
  memeId: mongoose.Types.ObjectId,
): Promise<IKeyword> {
  try {
    const updatedKeyword = await KeywordModel.findByIdAndUpdate(
      keywordId,
      { $addToSet: { memeIDs: memeId } }, // $addToSet를 사용하여 중복 추가 방지
      { new: true },
    );
    if (!updatedKeyword) {
      throw new CustomError('Keyword not found', HttpCode.NOT_FOUND);
    }
    logger.info(`Added meme ${memeId} to keyword ${keywordId}`);
    return updatedKeyword;
  } catch (err) {
    logger.error(`Failed to add meme ${memeId} to keyword ${keywordId}: ${err.message}`);
    throw new CustomError('Failed to add meme to keyword', HttpCode.INTERNAL_SERVER_ERROR);
  }
}

export { createKeyword, getTopKeywords, incrementSearchCount, addMemeToKeyword };
