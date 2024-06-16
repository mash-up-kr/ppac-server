import { logger } from '../util/logger';
import { IUser, UserModel } from '../model/user';
import _ from 'lodash';
import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IMeme, MemeModel } from 'src/model/meme';
import { MemeReactionModel } from 'src/model/memeReaction';
import { MemeSaveModel } from 'src/model/memeSave';
import { MemeShareModel } from 'src/model/memeShare';

async function createUser(deviceID: string): Promise<IUser> {
  try {
    const existedUser = await UserModel.findOne(
      { deviceID, isDeleted: false },
      { _id: 0, createdAt: 0, updatedAt: 0 },
    );
    if (existedUser) {
      return existedUser.toObject();
    }
    const user = await UserModel.create({
      deviceID,
    });

    await user.save();
    logger.info(`Created user - deviceID(${JSON.stringify(user.toObject)})`);
    return user.toObject();
  } catch (err) {
    logger.info(`Failed to create User`);
  }
}

async function updateLastSeenMeme(deviceID: string, memeID: string): Promise<IUser> {
  try {
    const user = await UserModel.findOne({ deviceID, isDeleted: false });
    if (_.isNull(user)) {
      throw new CustomError(`Cannot find User`, HttpCode.NOT_FOUND);
    }

    const newLastSeenMeme = [...user.lastSeenMeme, memeID];
    if (newLastSeenMeme.length > 10) {
      newLastSeenMeme.shift();
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { deviceID },
      {
        lastSeenMeme: newLastSeenMeme,
      },
      {
        projection: { _id: 0, createdAt: 0, updatedAt: 0 },
        returnDocument: 'after',
      },
    ).lean();
    logger.info(`Updated user lastSeenMeme - deviceID(${deviceID}), memeList(${newLastSeenMeme})`);
    return updatedUser;
  } catch (err) {
    logger.error(`Failed Update user LastSeenMeme`, err.message);
  }
}

async function createMemeReaction(deviceID: string, memeID: string): Promise<IMeme> {
  try {
    const meme = await MemeModel.findOne({ memeID, isDeleted: false });
    const user = await UserModel.findOne({ deviceID, isDeleted: false });

    if (_.isNull(meme)) {
      throw new CustomError(`Failed to get Meme - memeID(${memeID})`, HttpCode.NOT_FOUND);
    }
    if (_.isNull(user)) {
      throw new CustomError(`Failed to get User - deviceID(${deviceID})`, HttpCode.NOT_FOUND);
    }

    const memeReaction = await MemeReactionModel.findOne({ deviceID, memeID, isDeleted: false });
    if (!_.isNull(memeReaction)) {
      logger.info(`Already reaction meme - deviceID(${deviceID}), memeID(${memeID}`);
      return meme;
    }
    const newMemeReaction = await MemeReactionModel.create({ memeID, deviceID });
    await newMemeReaction.save();

    const newReactionCount = meme.reaction + 1;
    const updatedMeme = await MemeModel.findOneAndUpdate(
      { memeID },
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
  }
}

async function createMemeSave(deviceID: string, memeID: string): Promise<Boolean> {
  try {
    const meme = await MemeModel.findOne({ memeID, isDeleted: false });
    const user = await UserModel.findOne({ deviceID, isDeleted: false });

    if (_.isNull(meme)) {
      throw new CustomError(`Failed to get Meme - memeID(${memeID})`, HttpCode.NOT_FOUND);
    }
    if (_.isNull(user)) {
      throw new CustomError(`Failed to get User - deviceID(${deviceID})`, HttpCode.NOT_FOUND);
    }

    const memeSave = await MemeSaveModel.findOne({ deviceID, memeID, isDeleted: false });
    if (!_.isNull(memeSave)) {
      logger.info(`Already save meme - deviceID(${deviceID}), memeID(${memeID}`);
      return false;
    }
    const newMemeSave = await MemeSaveModel.create({ memeID, deviceID });
    await newMemeSave.save();

    return true;
  } catch (err) {
    logger.error(`Failed create memeSave`, err.message);
  }
}

async function createMemeShare(deviceID: string, memeID: string): Promise<Boolean> {
  try {
    const meme = await MemeModel.findOne({ memeID, isDeleted: false });
    const user = await UserModel.findOne({ deviceID, isDeleted: false });

    if (_.isNull(meme)) {
      throw new CustomError(`Failed to get Meme - memeID(${memeID})`, HttpCode.NOT_FOUND);
    }
    if (_.isNull(user)) {
      throw new CustomError(`Failed to get User - deviceID(${deviceID})`, HttpCode.NOT_FOUND);
    }

    const memeShare = await MemeShareModel.findOne({ deviceID, memeID, isDeleted: false });
    if (!_.isNull(memeShare)) {
      logger.info(`Already share meme - deviceID(${deviceID}), memeID(${memeID}`);
      return false;
    }
    const newMemeShare = await MemeShareModel.create({ memeID, deviceID });
    await newMemeShare.save();

    return true;
  } catch (err) {
    logger.error(`Failed create memeSave`, err.message);
  }
}
