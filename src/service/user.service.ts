import { startOfWeek } from 'date-fns';
import _ from 'lodash';
import { Types } from 'mongoose';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IMemeDocument, MemeModel } from '../model/meme';
import { InteractionType, MemeInteractionModel } from '../model/memeInteraction';
import {
  MemeRecommendWatchModel,
  IMemeRecommendWatchUpdatePayload,
  IMemeRecommendWatchCreatePayload,
} from '../model/memeRecommendWatch';
import { IUser, IUserDocument, IUserInfos, UserModel } from '../model/user';
import { logger } from '../util/logger';

async function getUser(deviceId: string): Promise<IUserDocument | null> {
  try {
    const user = await UserModel.findOne(
      { deviceId, isDeleted: false },
      {
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    );
    return user?.toObject() || null;
  } catch (err) {
    logger.error(`Failed to getUser - deviceId${deviceId}`);
    throw new CustomError(
      'Failed to getUser - deviceId${deviceId}`',
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function createUser(deviceId: string): Promise<IUserInfos> {
  try {
    const foundUser = await UserModel.findOne(
      { deviceId, isDeleted: false },
      { _id: 0, createdAt: 0, updatedAt: 0 },
    );

    if (foundUser) {
      const countInteractionType = (type: InteractionType) =>
        MemeInteractionModel.countDocuments({
          deviceId: foundUser.deviceId,
          interactionType: type,
        });

      const [watch, reaction, share, save] = await Promise.all([
        countInteractionType(InteractionType.WATCH),
        countInteractionType(InteractionType.REACTION),
        countInteractionType(InteractionType.SHARE),
        countInteractionType(InteractionType.SAVE),
      ]);

      const todayWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const memeRecommendWatchCount = await MemeRecommendWatchModel.countDocuments({
        startDate: todayWeekStart,
        deviceId: foundUser.deviceId,
        isDeleted: false,
      });

      return {
        ...foundUser.toObject(),
        watch,
        reaction,
        save,
        share,
        memeRecommendWatchCount,
      };
    }

    const user = await UserModel.create({
      deviceId,
    });

    await user.save();
    logger.info(`Created user - deviceId(${JSON.stringify(user.toObject())})`);
    return { ...user.toObject(), watch: 0, share: 0, reaction: 0, save: 0 };
  } catch (err) {
    logger.error(`Failed to create User`);
    throw new CustomError(`Failed to create a User`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function updateLastSeenMeme(user: IUserDocument, meme: IMemeDocument): Promise<IUser> {
  try {
    const newLastSeenMeme = [...user.lastSeenMeme];

    const index = newLastSeenMeme.indexOf(meme._id);
    // 새 값이 존재하면 해당 값을 배열에서 제거합니다.
    if (index !== -1) {
      newLastSeenMeme.splice(index, 1);
    }
    // 새 값을 배열의 첫 번째 위치에 추가합니다.
    newLastSeenMeme.unshift(meme._id);

    if (newLastSeenMeme.length > 10) {
      newLastSeenMeme.pop();
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { deviceId: user.deviceId },
      {
        $set: { lastSeenMeme: newLastSeenMeme },
      },
      {
        projection: { _id: 0, createdAt: 0, updatedAt: 0 },
        returnDocument: 'after',
      },
    ).lean();
    logger.info(
      `Updated user lastSeenMeme - deviceId(${user.deviceId}), memeList(${newLastSeenMeme})`,
    );
    return updatedUser;
  } catch (err) {
    logger.error(`Failed Update user lastSeenMeme`, err.message);
    throw new CustomError(
      `Failed Update user lastSeenMeme(${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getLastSeenMemes(user: IUserDocument): Promise<IMemeDocument[]> {
  try {
    const lastSeenMeme = user.lastSeenMeme;
    const memeList = await MemeModel.find({
      _id: { $in: lastSeenMeme },
      isDeleted: false,
    }).lean();

    return memeList;
  } catch (err) {
    logger.error(`Failed get lastSeenMeme`, err.message);
    throw new CustomError(
      `Failed get lastSeenMeme(${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getSavedMemes(
  page: number,
  size: number,
  user: IUserDocument,
): Promise<{ total: number; page: number; totalPages: number; data: IMemeDocument[] }> {
  try {
    const totalSavedMemes = await MemeInteractionModel.countDocuments({
      deviceId: user.deviceId,
      interactionType: InteractionType.SAVE,
      isDeleted: false,
    });

    const savedMemes = await MemeInteractionModel.find({
      deviceId: user.deviceId,
      interactionType: InteractionType.SAVE,
      isDeleted: false,
    })
      .skip((page - 1) * size)
      .limit(size)
      .sort({ createdAt: -1 })
      .lean();

    const memeIds = savedMemes.map(({ memeId }) => new Types.ObjectId(memeId));
    const memeList = await MemeModel.find({ _id: { $in: memeIds }, isDeleted: false }).lean();

    return {
      total: totalSavedMemes,
      page,
      totalPages: Math.ceil(totalSavedMemes / size),
      data: memeList,
    };
  } catch (error) {
    throw new CustomError(`Failed to get saved memes`, HttpCode.INTERNAL_SERVER_ERROR, error);
  }
}

async function createMemeRecommendWatch(user: IUserDocument, meme: IMemeDocument): Promise<number> {
  try {
    const todayWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const memeRecommendWatch = await MemeRecommendWatchModel.findOne({
      memeId: meme._id,
      startDate: todayWeekStart,
      deviceId: user.deviceId,
      isDeleted: false,
    });

    if (!_.isNull(memeRecommendWatch)) {
      logger.info(`Already watched recommend meme - deviceId(${user.deviceId})`);

      const updatePayload: IMemeRecommendWatchUpdatePayload = {
        memeIds: [...memeRecommendWatch.memeIds, meme._id],
      };

      await MemeRecommendWatchModel.findOneAndUpdate(
        { _id: memeRecommendWatch._id },
        { $set: updatePayload },
      );
      return updatePayload.memeIds.length;
    }

    const createPayload: IMemeRecommendWatchCreatePayload = {
      deviceId: user.deviceId,
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
      memeIds: [meme._id],
    };

    await MemeRecommendWatchModel.create(createPayload);

    return 1;
  } catch (err) {
    logger.error(`Failed create memeRecommendWatch`, err.message);
    throw new CustomError(
      `Failed create memeRecommendWatch(${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

export {
  getUser,
  createUser,
  updateLastSeenMeme,
  getLastSeenMemes,
  getSavedMemes,
  createMemeRecommendWatch,
};
