import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IMemeDocument, MemeModel } from '../model/meme';
import { MemeReactionModel } from '../model/memeReaction';
import { MemeSaveModel } from '../model/memeSave';
import { MemeShareModel } from '../model/memeShare';
import { MemeWatchModel } from '../model/memeWatch';
import { IUser, IUserDocument, IUserInfos, UserModel } from '../model/user';
import { logger } from '../util/logger';

async function getUser(deviceId: string): Promise<IUserDocument | null> {
  try {
    const user = await UserModel.findOne({ deviceId, isDeleted: false });
    return user.toObject();
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
      const [memeShareCount, memeReactionCount, memeSaveCount] = await Promise.all([
        MemeShareModel.countDocuments({ deviceId, isDeleted: false }),
        MemeReactionModel.countDocuments({ deviceId, isDeleted: false }),
        MemeSaveModel.countDocuments({ deviceId, isDeleted: false }),
      ]);

      return { ...foundUser.toObject(), memeShareCount, memeReactionCount, memeSaveCount };
    }
    const user = await UserModel.create({
      deviceId,
    });

    await user.save();
    logger.info(`Created user - deviceId(${JSON.stringify(user.toObject())})`);
    return { ...user.toObject(), memeShareCount: 0, memeReactionCount: 0, memeSaveCount: 0 };
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

async function createMemeReaction(
  user: IUserDocument,
  meme: IMemeDocument,
): Promise<IMemeDocument> {
  try {
    const memeReaction = await MemeReactionModel.findOne({
      deviceId: user.deviceId,
      memeId: meme._id,
      isDeleted: false,
    });
    if (!_.isNull(memeReaction)) {
      logger.info(`Already reaction meme - deviceId(${user.deviceId}), memeId(${meme._id}`);
      return meme;
    }

    const newMemeReaction = await MemeReactionModel.create({
      memeId: meme._id,
      deviceId: user.deviceId,
    });
    await newMemeReaction.save();

    const updatedMeme = await MemeModel.findOneAndUpdate(
      { memeId: meme._id },
      { $inc: { reaction: 1 } },
      {
        projection: { _id: 0, createdAt: 0, updatedAt: 0 },
        returnDocument: 'after',
      },
    ).lean();

    return updatedMeme;
  } catch (err) {
    logger.error(`Failed create memeReaction`, err.message);
    throw new CustomError(
      `Failed create memeReaction(${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function createMemeSave(user: IUserDocument, meme: IMemeDocument): Promise<boolean> {
  try {
    const memeSave = await MemeSaveModel.findOne({
      deviceId: user.deviceId,
      memeId: meme._id,
      isDeleted: false,
    });
    if (!_.isNull(memeSave)) {
      logger.info(`Already save meme - user.deviceId(${user.deviceId}), memeId(${meme._id}`);
      return false;
    }
    const newMemeSave = await MemeSaveModel.create({ memeId: meme._id, deviceId: user.deviceId });
    await newMemeSave.save();

    return true;
  } catch (err) {
    logger.error(`Failed create memeSave`, err.message);
    throw new CustomError(`Failed create memeSave(${err.message})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function createMemeShare(user: IUserDocument, meme: IMemeDocument): Promise<boolean> {
  try {
    const memeShare = await MemeShareModel.findOne({
      deviceId: user.deviceId,
      memeId: meme._id,
      isDeleted: false,
    });
    if (!_.isNull(memeShare)) {
      logger.info(`Already share meme - deviceId(${user.deviceId}), memeId(${meme._id}`);
      return false;
    }
    const newMemeShare = await MemeShareModel.create({ memeId: meme._id, deviceId: user.deviceId });
    await newMemeShare.save();

    return true;
  } catch (err) {
    logger.error(`Failed create memeSave`, err.message);
    throw new CustomError(`Failed create memeSave(${err.message})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function createMemeWatch(user: IUserDocument, meme: IMemeDocument): Promise<boolean> {
  try {
    const memeWatch = await MemeWatchModel.findOne({
      deviceId: user.deviceId,
      memeId: meme._id,
      isDeleted: false,
    });
    if (!_.isNull(memeWatch)) {
      logger.info(`Already watch meme - deviceId(${user.deviceId}), memeId(${meme._id}`);
      return true;
    }
    const newMemeWatch = await MemeWatchModel.create({ memeId: meme._id, deviceId: user.deviceId });
    await newMemeWatch.save();

    await MemeModel.findOneAndUpdate(
      { memeId: meme._id },
      {
        $inc: { watch: 1 },
      },
      {
        projection: { _id: 0, createdAt: 0, updatedAt: 0 },
        returnDocument: 'after',
      },
    ).lean();

    return true;
  } catch (err) {
    logger.error(`Failed create memeSave`, err.message);
    throw new CustomError(`Failed create memeSave(${err.message})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function deleteMemeSave(user: IUserDocument, meme: IMemeDocument): Promise<boolean> {
  try {
    const memeSave = await MemeSaveModel.findOne({
      deviceId: user.deviceId,
      memeId: meme._id,
      isDeleted: false,
    });

    if (_.isNull(memeSave)) {
      logger.info(`Already delete memeSave - deviceId(${user.deviceId}), memeId(${meme._id}`);
      return false;
    }
    await MemeSaveModel.findOneAndUpdate(
      { deviceId: user.deviceId, memeId: meme._id },
      {
        isDeleted: true,
      },
    ).lean();

    return true;
  } catch (err) {
    logger.error(`Failed delete memeSave`, err.message);
    throw new CustomError(`Failed delete memeSave(${err.message})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function getLastSeenMeme(user: IUserDocument): Promise<IMemeDocument[]> {
  try {
    const lastSeenMeme = user.lastSeenMeme;
    const memeList = await MemeModel.find({
      memeId: { $in: lastSeenMeme },
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

async function getSavedMeme(user: IUserDocument): Promise<IMemeDocument[]> {
  try {
    const savedMeme = await MemeSaveModel.find({
      deviceId: user.deviceId,
      isDeleted: false,
    }).lean();

    const memeList = await MemeModel.find({
      memeId: { $in: savedMeme.map((meme) => meme.memeId) },
      isDeleted: false,
    }).lean();

    logger.info(`Get savedMeme - deviceId(${user.deviceId}), memeList(${memeList})`);
    return memeList;
  } catch (err) {
    logger.error(`Failed get savedMeme`, err.message);
    throw new CustomError(`Failed get savedMeme(${err.message})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}

export {
  getUser,
  createUser,
  updateLastSeenMeme,
  createMemeReaction,
  createMemeSave,
  createMemeShare,
  createMemeWatch,
  deleteMemeSave,
  getLastSeenMeme,
  getSavedMeme,
};
