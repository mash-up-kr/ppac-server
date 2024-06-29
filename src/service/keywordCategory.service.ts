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
  categoryName: string,
  updateInfos: Partial<IKeywordCategory>,
): Promise<IKeywordCategory> {
  const updatedCategory = await KeywordCategoryModel.findOneAndUpdate(
    { name: categoryName },
    updateInfos,
    {
      new: true,
    },
  ).lean();
  if (!updatedCategory) {
    throw new CustomError(`Category with ID ${updatedCategory} not found`, HttpCode.NOT_FOUND);
  }
  return updatedCategory;
}

async function deleteKeywordCategory(categoryName: string): Promise<boolean> {
  const deletedCategory = await KeywordCategoryModel.findOneAndDelete({
    name: categoryName,
  }).lean();
  if (!deletedCategory) {
    throw new CustomError(`Category with Name ${categoryName} not found`, HttpCode.NOT_FOUND);
  }
  return true;
}

async function getKeywordCategory(categoryName: string): Promise<IKeywordCategory> {
  try {
    const keywordCategory = await KeywordCategoryModel.findOne({
      name: categoryName,
      isDeleted: false,
    }).lean();
    return keywordCategory;
  } catch (err) {
    logger.info(`Failed to get a KeywordCategory Info By id (${categoryName})`);
  }
}

export { createKeywordCategory, updateKeywordCategory, deleteKeywordCategory, getKeywordCategory };
