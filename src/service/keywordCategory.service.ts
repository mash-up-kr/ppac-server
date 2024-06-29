import {
  KeywordCategoryModel,
  IKeywordCategoryCreatePayload,
  IKeywordCategory,
} from '../model/keywordCategory';
import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { logger } from '../util/logger';

async function createKeywordCategory(
  info: IKeywordCategoryCreatePayload,
): Promise<IKeywordCategory> {
  try {
    const newCategory = new KeywordCategoryModel({
      ...info,
    });
    await newCategory.save();
    logger.info(`Created new keyword category: ${JSON.stringify(newCategory)}`);
    return newCategory.toObject();
  } catch (err) {
    logger.error(`Failed to create category ${info.name}: ${err.message}`);
    throw new CustomError('Failed to create category', HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function updateKeywordCategory(
  categoryId: string,
  update: Partial<IKeywordCategory>,
): Promise<IKeywordCategory> {
  const updatedCategory = await KeywordCategoryModel.findOneAndUpdate({ _id: categoryId }, update, {
    new: true,
  }).lean();
  if (!updatedCategory) {
    throw new CustomError(`Category with ID ${updatedCategory} not found`, HttpCode.NOT_FOUND);
  }
  return updatedCategory;
}

async function deleteKeywordCategory(categoryId: string): Promise<boolean> {
  const deletedCategory = await KeywordCategoryModel.findOneAndDelete({ _id: categoryId }).lean();
  if (!deletedCategory) {
    throw new CustomError(`Category with ID ${categoryId} not found`, HttpCode.NOT_FOUND);
  }
  return true;
}

async function getKeywordCategory(categoryId: string): Promise<IKeywordCategory> {
  try {
    const keywordCategory = await KeywordCategoryModel.findOne({
      _id: categoryId,
      isDeleted: false,
    }).lean();
    return keywordCategory;
  } catch (err) {
    logger.info(`Failed to get a KeywordCategory Info By id (${categoryId})`);
  }
}

export { createKeywordCategory, updateKeywordCategory, deleteKeywordCategory, getKeywordCategory };
