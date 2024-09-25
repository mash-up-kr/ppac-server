import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import {
  KeywordCategoryModel,
  IKeywordCategoryCreatePayload,
  IKeywordCategoryDocument,
} from '../model/keywordCategory';
import { logger } from '../util/logger';

async function createKeywordCategory(
  info: IKeywordCategoryCreatePayload,
): Promise<IKeywordCategoryDocument> {
  try {
    const newCategory = await KeywordCategoryModel.create({
      ...info,
    });
    await newCategory.save();
    const newCategoryObj = newCategory.toObject();

    logger.info(`Created new keyword category: ${JSON.stringify(newCategoryObj)}`);
    return newCategoryObj;
  } catch (err) {
    throw new CustomError(
      `Failed to create category ${info.name}: ${err.message}`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function updateKeywordCategory(
  categoryName: string,
  updateInfo: any,
): Promise<IKeywordCategoryDocument> {
  const updatedCategory = await KeywordCategoryModel.findOneAndUpdate(
    { name: categoryName, isDeleted: false },
    { $set: updateInfo },
    { new: true },
  );

  if (_.isNull(updatedCategory)) {
    throw new CustomError(`Category with ID ${updatedCategory} not found`, HttpCode.NOT_FOUND);
  }

  logger.info(`Update keyword category - category(${categoryName})`);
  return updatedCategory.toObject();
}

async function deleteKeywordCategory(categoryName: string): Promise<boolean> {
  const deletedCategory = await KeywordCategoryModel.findOneAndUpdate(
    {
      name: categoryName,
    },
    { isDeleted: true },
  );
  if (_.isNull(deletedCategory)) {
    throw new CustomError(`Category with Name ${categoryName} not found`, HttpCode.NOT_FOUND);
  }

  return true;
}

async function getKeywordCategory(categoryName: string): Promise<IKeywordCategoryDocument> {
  const keywordCategory = await KeywordCategoryModel.findOne({
    name: categoryName,
    isDeleted: false,
  });

  if (_.isNull(keywordCategory)) {
    throw new CustomError(`Category with Name ${categoryName} not found`, HttpCode.NOT_FOUND);
  }

  return keywordCategory.toObject();
}

export { createKeywordCategory, updateKeywordCategory, deleteKeywordCategory, getKeywordCategory };
