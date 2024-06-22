import { logger } from '../util/logger';
import { IUser, IUserDocument, IUserInfos, UserModel } from '../model/user';
import _ from 'lodash';
import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IMeme, MemeModel } from '../model/meme';
import { MemeReactionModel } from '../model/memeReaction';
import { MemeSaveModel } from '../model/memeSave';
import { MemeShareModel } from '../model/memeShare';
import { MemeWatchModel } from '../model/memeWatch';

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

async function updateLastSeenMeme(deviceId: string, memeId: string): Promise<IUser> {
  try {
    const user = await UserModel.findOne({ deviceId, isDeleted: false });
    if (_.isNull(user)) {
      throw new CustomError(`Cannot find User`, HttpCode.NOT_FOUND);
    }

    const newLastSeenMeme = [...user.lastSeenMeme];

    const index = newLastSeenMeme.indexOf(memeId);
    // 새 값이 존재하면 해당 값을 배열에서 제거합니다.
    if (index !== -1) {
      newLastSeenMeme.splice(index, 1);
    }
    // 새 값을 배열의 첫 번째 위치에 추가합니다.
    newLastSeenMeme.unshift(memeId);

    if (newLastSeenMeme.length > 10) {
      newLastSeenMeme.pop();
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { deviceId },
      {
        lastSeenMeme: newLastSeenMeme,
      },
      {
        projection: { _id: 0, createdAt: 0, updatedAt: 0 },
        returnDocument: 'after',
      },
    ).lean();
    logger.info(`Updated user lastSeenMeme - deviceId(${deviceId}), memeList(${newLastSeenMeme})`);
    return updatedUser;
  } catch (err) {
    logger.error(`Failed Update user lastSeenMeme`, err.message);
    throw new CustomError(
      `Failed Update user lastSeenMeme(${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function createMemeReaction(deviceId: string, memeId: string): Promise<IMeme> {
  try {
    const meme = await MemeModel.findOne({ memeId, isDeleted: false });
    const user = await UserModel.findOne({ deviceId, isDeleted: false });

    if (_.isNull(meme)) {
      throw new CustomError(`Failed to get Meme - memeId(${memeId})`, HttpCode.NOT_FOUND);
    }
    if (_.isNull(user)) {
      throw new CustomError(`Failed to get User - deviceId(${deviceId})`, HttpCode.NOT_FOUND);
    }

    const memeReaction = await MemeReactionModel.findOne({ deviceId, memeId, isDeleted: false });
    if (!_.isNull(memeReaction)) {
      logger.info(`Already reaction meme - deviceId(${deviceId}), memeId(${memeId}`);
      return meme;
    }
    const newMemeReaction = await MemeReactionModel.create({ memeId, deviceId });
    await newMemeReaction.save();

    const newReactionCount = meme.reaction + 1;
    const updatedMeme = await MemeModel.findOneAndUpdate(
      { memeId },
      {
        reaction: newReactionCount,
      },
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

async function createMemeSave(deviceId: string, memeId: string): Promise<boolean> {
  try {
    const meme = await MemeModel.findOne({ memeId, isDeleted: false });
    const user = await UserModel.findOne({ deviceId, isDeleted: false });

    if (_.isNull(meme)) {
      throw new CustomError(`Failed to get Meme - memeId(${memeId})`, HttpCode.NOT_FOUND);
    }
    if (_.isNull(user)) {
      throw new CustomError(`Failed to get User - deviceId(${deviceId})`, HttpCode.NOT_FOUND);
    }

    const memeSave = await MemeSaveModel.findOne({ deviceId, memeId, isDeleted: false });
    if (!_.isNull(memeSave)) {
      logger.info(`Already save meme - deviceId(${deviceId}), memeId(${memeId}`);
      return false;
    }
    const newMemeSave = await MemeSaveModel.create({ memeId, deviceId });
    await newMemeSave.save();

    return true;
  } catch (err) {
    logger.error(`Failed create memeSave`, err.message);
    throw new CustomError(`Failed create memeSave(${err.message})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function createMemeShare(deviceId: string, memeId: string): Promise<boolean> {
  try {
    const meme = await MemeModel.findOne({ memeId, isDeleted: false });
    const user = await UserModel.findOne({ deviceId, isDeleted: false });

    if (_.isNull(meme)) {
      throw new CustomError(`Failed to get Meme - memeId(${memeId})`, HttpCode.NOT_FOUND);
    }
    if (_.isNull(user)) {
      throw new CustomError(`Failed to get User - deviceId(${deviceId})`, HttpCode.NOT_FOUND);
    }

    const memeShare = await MemeShareModel.findOne({ deviceId, memeId, isDeleted: false });
    if (!_.isNull(memeShare)) {
      logger.info(`Already share meme - deviceId(${deviceId}), memeId(${memeId}`);
      return false;
    }
    const newMemeShare = await MemeShareModel.create({ memeId, deviceId });
    await newMemeShare.save();

    return true;
  } catch (err) {
    logger.error(`Failed create memeSave`, err.message);
    throw new CustomError(`Failed create memeSave(${err.message})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
}

async function createMemeWatch(deviceId: string, memeId: string): Promise<boolean> {
  try {
    const meme = await MemeModel.findOne({ memeId, isDeleted: false });
    const user = await UserModel.findOne({ deviceId, isDeleted: false });

    if (_.isNull(meme)) {
      throw new CustomError(`Failed to get Meme - memeId(${memeId})`, HttpCode.NOT_FOUND);
    }
    if (_.isNull(user)) {
      throw new CustomError(`Failed to get User - deviceId(${deviceId})`, HttpCode.NOT_FOUND);
    }

    const memeWatch = await MemeWatchModel.findOne({ deviceId, memeId, isDeleted: false });
    if (!_.isNull(memeWatch)) {
      logger.info(`Already watch meme - deviceId(${deviceId}), memeId(${memeId}`);
      return true;
    }
    const newMemeWatch = await MemeWatchModel.create({ memeId, deviceId });
    await newMemeWatch.save();

    const newWatchCount = meme.watch + 1;
    const updatedMeme = await MemeModel.findOneAndUpdate(
      { memeId },
      {
        watch: newWatchCount,
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

async function deleteMemeReaction(deviceId: string, memeId: string): Promise<IMeme> {
  try {
    const meme = await MemeModel.findOne({ memeId, isDeleted: false });
    const user = await UserModel.findOne({ deviceId, isDeleted: false });

    if (_.isNull(meme)) {
      throw new CustomError(`Failed to get Meme - memeId(${memeId})`, HttpCode.NOT_FOUND);
    }

    if (_.isNull(user)) {
      throw new CustomError(`Failed to get User - deviceId(${deviceId})`, HttpCode.NOT_FOUND);
    }

    const memeReaction = await MemeReactionModel.findOne({ deviceId, memeId, isDeleted: false });
    if (_.isNull(memeReaction)) {
      logger.info(`Already delete memeReaction - deviceId(${deviceId}), memeId(${memeId}`);
      return meme;
    }
    await MemeReactionModel.findOneAndUpdate(
      { deviceId, memeId },
      {
        isDeleted: true,
      },
    ).lean();

    const newReactionCount = meme.reaction - 1;

    const updatedMeme = await MemeModel.findOneAndUpdate(
      { memeId },
      {
        reaction: newReactionCount,
      },
      {
        projection: { _id: 0, createdAt: 0, updatedAt: 0 },
        returnDocument: 'after',
      },
    ).lean();

    return updatedMeme;
  } catch (err) {
    logger.error(`Failed delete memeReaction`, err.message);
    throw new CustomError(
      `Failed delete memeReaction(${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function deleteMemeSave(deviceId: string, memeId: string): Promise<boolean> {
  try {
    const meme = await MemeModel.findOne({ memeId, isDeleted: false });
    const user = await UserModel.findOne({ deviceId, isDeleted: false });

    if (_.isNull(meme)) {
      throw new CustomError(`Failed to get Meme - memeId(${memeId})`, HttpCode.NOT_FOUND);
    }

    if (_.isNull(user)) {
      throw new CustomError(`Failed to get User - deviceId(${deviceId})`, HttpCode.NOT_FOUND);
    }

    const memeSave = await MemeSaveModel.findOne({ deviceId, memeId, isDeleted: false });

    if (_.isNull(memeSave)) {
      logger.info(`Already delete memeSave - deviceId(${deviceId}), memeId(${memeId}`);
      return false;
    }
    await MemeSaveModel.findOneAndUpdate(
      { deviceId, memeId },
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

async function getLastSeenMeme(deviceId: string): Promise<IMeme[]> {
  try {
    const user = await UserModel.findOne({ deviceId, isDeleted: false });
    if (_.isNull(user)) {
      throw new CustomError(`Cannot find User`, HttpCode.NOT_FOUND);
    }

    const lastSeenMeme = user.lastSeenMeme;
    const memeList = await MemeModel.find({ memeId: { $in: lastSeenMeme } }).lean();

    return memeList;
  } catch (err) {
    logger.error(`Failed get lastSeenMeme`, err.message);
    throw new CustomError(
      `Failed get lastSeenMeme(${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getSavedMeme(deviceId: string): Promise<IMeme[]> {
  try {
    const user = await UserModel.findOne({ deviceId, isDeleted: false });
    if (_.isNull(user)) {
      throw new CustomError(`Cannot find User`, HttpCode.NOT_FOUND);
    }

    const savedMeme = await MemeSaveModel.find({ deviceId, isDeleted: false }).lean();

    const memeList = await MemeModel.find({
      memeId: { $in: savedMeme.map((meme) => meme.memeId) },
    }).lean();

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
  deleteMemeReaction,
  deleteMemeSave,
  getLastSeenMeme,
  getSavedMeme,
};
