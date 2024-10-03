import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import mongoose, { Types } from 'mongoose';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { CustomRequest } from '../middleware/requestedInfo';
import { IKeywordDocument } from '../model/keyword';
import { IMemeCreatePayload, IMemeUpdatePayload } from '../model/meme';
import { InteractionType } from '../model/memeInteraction';
import { IUserDocument } from '../model/user';
import { getKeywordByName } from '../service/keyword.service';
import * as MemeService from '../service/meme.service';
import * as UserService from '../service/user.service';
import { logger } from '../util/logger';
import { createSuccessResponse } from '../util/response';

enum MemeWatchType {
  SEARCH = 'search',
  RECOMMEND = 'recommend',
}
const getMeme = async (req: Request, res: Response, next: NextFunction) => {
  const memeId = req.params?.memeId || null;

  if (_.isNull(memeId)) {
    return next(new CustomError(`'memeId' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!mongoose.Types.ObjectId.isValid(memeId)) {
    return next(new CustomError(`${memeId} is not a valid ObjectId`, HttpCode.BAD_REQUEST));
  }

  try {
    const meme = await MemeService.getMeme(memeId);
    if (_.isNull(meme)) {
      return next(new CustomError(`Meme(${memeId}) not found.`, HttpCode.NOT_FOUND));
    }

    logger.info(`Get meme - ${memeId})`);
    return res.json(createSuccessResponse(HttpCode.OK, 'Get Meme', meme));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const getMemeWithKeywords = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const ret = await MemeService.getMemeWithKeywords(user, meme);
    if (_.isNull(ret)) {
      return next(new CustomError(`Meme(${meme._id}) not found.`, HttpCode.NOT_FOUND));
    }

    logger.info(`Get meme with keywords - ${meme._id})`);
    return res.json(createSuccessResponse(HttpCode.OK, 'Get Meme', ret));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const createMeme = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;

  const image = req.file;

  if (_.isUndefined(image)) {
    return next(new CustomError(`'file' should be provided.`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'title')) {
    return next(new CustomError(`'title' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!req.file) {
    return next(new CustomError(`'image' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'source')) {
    return next(new CustomError(`'source' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'keywordIds')) {
    return next(new CustomError(`'keywordIds' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!Array.isArray(req.body.keywordIds)) {
    return next(new CustomError(`'keywordIds' should be an array`, HttpCode.BAD_REQUEST));
  }

  const createPayload: IMemeCreatePayload = {
    deviceId: user.deviceId,
    title: req.body.title,
    image: image.location,
    source: req.body.source,
    keywordIds: req.body.keywordIds.map((id: string) => new Types.ObjectId(id)),
    watch: 0,
  };

  try {
    const meme = await MemeService.createMeme(createPayload);
    return res.json(createSuccessResponse(HttpCode.CREATED, 'Create Meme', meme));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const updateMeme = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const meme = req.requestedMeme;

  const updatePayload: IMemeUpdatePayload = {
    ...req.body,
    keywordIds: req.body.keywordIds.map((id: string) => new Types.ObjectId(id)),
  };

  try {
    const updatedMeme = await MemeService.updateMeme(meme._id, updatePayload);
    return res.json(createSuccessResponse(HttpCode.OK, 'Updated Meme', updatedMeme));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const deleteMeme = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const meme = req.requestedMeme;
  try {
    await MemeService.deleteMeme(meme._id);
    return res.json(createSuccessResponse(HttpCode.OK, 'Deleted Meme', true));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const getAllMemeList = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const page = parseInt(req.query.page as string) || 1;
  if (page < 1) {
    return next(new CustomError(`Invalid 'page' parameter`, HttpCode.BAD_REQUEST));
  }

  const size = parseInt(req.query.size as string) || 10;
  if (size < 1) {
    return next(new CustomError(`Invalid 'size' parameter`, HttpCode.BAD_REQUEST));
  }

  try {
    const memeList = await MemeService.getAllMemeList(page, size, user);

    const data = {
      pagination: {
        total: memeList.total,
        page: memeList.page,
        perPage: size,
        currentPage: memeList.page,
        totalPages: memeList.totalPages,
      },
      memeList: memeList.data,
    };

    return res.json(createSuccessResponse(HttpCode.OK, 'Get all meme list', data));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const getTodayMemeList = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const size = parseInt(req.query.size as string) || 5;

  if (size > 5) {
    return next(
      new CustomError(
        `Invalid 'size' parameter. Today Meme List max size is 5.`,
        HttpCode.BAD_REQUEST,
      ),
    );
  }

  try {
    const todayMemeList = await MemeService.getTodayMemeList(size, user);
    return res.json(createSuccessResponse(HttpCode.OK, 'Get today meme list', todayMemeList));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const searchMemeList = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;

  const page = parseInt(req.query.page as string) || 1;
  if (page < 1) {
    return next(new CustomError(`Invalid 'page' parameter`, HttpCode.BAD_REQUEST));
  }

  const size = parseInt(req.query.size as string) || 10;
  if (size < 1) {
    return next(new CustomError(`Invalid 'size' parameter`, HttpCode.BAD_REQUEST));
  }

  const searchTerm = (req.query.q as string) || '';
  try {
    if (searchTerm) {
      // 검색어로 검색하는 경우 (query-parameter)
      logger.info(`Search by searchTerm: ${searchTerm}`);
      const result = await searchMemeListBySearchTerm(page, size, searchTerm, user);
      return res.json(createSuccessResponse(HttpCode.OK, 'Search meme list by searchTerm', result));
    } else {
      // 키워드로 검색하는 경우 (parameter)
      const keyword = req.params?.name;
      logger.info(`Search by keyword: ${keyword}`);
      const requestedKeyword = await getKeywordByName(keyword);
      if (_.isNull(requestedKeyword)) {
        return next(
          new CustomError(`Keyword name '${keyword}' does not exist`, HttpCode.NOT_FOUND),
        );
      }
      const result = await searchMemeListByKeyword(page, size, requestedKeyword, user);
      return res.json(createSuccessResponse(HttpCode.OK, 'Search meme list by keyword', result));
    }
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const searchMemeListByKeyword = async (
  page: number,
  size: number,
  keyword: IKeywordDocument,
  user: IUserDocument,
) => {
  try {
    const memeList = await MemeService.searchMemeByKeyword(page, size, keyword, user);
    const data = {
      pagination: {
        total: memeList.total,
        page: memeList.page,
        perPage: size,
        currentPage: memeList.page,
        totalPages: memeList.totalPages,
      },
      memeList: memeList.data,
    };

    return data;
  } catch (err) {
    throw new CustomError(err.message, err.status);
  }
};

const searchMemeListBySearchTerm = async (
  page: number,
  size: number,
  saerchTerm: string,
  user: IUserDocument,
) => {
  try {
    const memeList = await MemeService.searchMemeBySearchTerm(page, size, saerchTerm, user);
    const data = {
      pagination: {
        total: memeList.total,
        page: memeList.page,
        perPage: size,
        currentPage: memeList.page,
        totalPages: memeList.totalPages,
      },
      memeList: memeList.data,
    };

    return data;
  } catch (err) {
    throw new CustomError(err.message, err.status);
  }
};

const createMemeReaction = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;
  const { count = 1 } = req.body;

  let reactionCount = meme.reaction;

  try {
    const result: boolean = await MemeService.createMemeInteraction(
      user,
      meme,
      InteractionType.REACTION,
      count,
    );
    reactionCount = reactionCount + count;
    return res.json(
      createSuccessResponse(HttpCode.CREATED, 'Create Meme Reaction', { count: reactionCount }),
    );
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const createMemeSave = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const result: boolean = await MemeService.createMemeInteraction(
      user,
      meme,
      InteractionType.SAVE,
    );
    return res.json(createSuccessResponse(HttpCode.CREATED, 'Crate Meme Save', result));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const createMemeShare = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const result: boolean = await MemeService.createMemeInteraction(
      user,
      meme,
      InteractionType.SHARE,
    );
    return res.json(createSuccessResponse(HttpCode.CREATED, 'Crate Meme Share', result));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const createMemeWatch = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;
  const type = req.params.type as MemeWatchType;

  try {
    // 밈 조회
    // 최근 본 밈 추가
    if (type == MemeWatchType.SEARCH) {
      const [result, _]: [boolean, any] = await Promise.all([
        MemeService.createMemeInteraction(user, meme, InteractionType.WATCH),
        UserService.updateLastSeenMeme(user, meme),
      ]);

      return res.json(createSuccessResponse(HttpCode.CREATED, 'Crate Meme Watch', result));
    } else if (type == MemeWatchType.RECOMMEND) {
      const [recommendMemeWatchCount, _]: [number, any] = await Promise.all([
        UserService.createMemeRecommendWatch(user, meme),
        UserService.updateLastSeenMeme(user, meme),
      ]);

      return res.json(
        createSuccessResponse(HttpCode.CREATED, `${type} Meme Watch`, recommendMemeWatchCount),
      );
    } else {
      return next(new CustomError(`Invalid 'type' parameter.`, HttpCode.BAD_REQUEST));
    }
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const deleteMemeSave = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const result: boolean = await MemeService.deleteMemeSave(user, meme);
    return res.json(createSuccessResponse(HttpCode.OK, 'Delete Meme Save', result));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

export {
  getMeme,
  getTodayMemeList,
  getAllMemeList,
  createMeme,
  createMemeSave,
  createMemeWatch,
  createMemeShare,
  createMemeReaction,
  deleteMeme,
  deleteMemeSave,
  updateMeme,
  getMemeWithKeywords,
  searchMemeList,
  searchMemeListByKeyword,
  searchMemeListBySearchTerm,
};
