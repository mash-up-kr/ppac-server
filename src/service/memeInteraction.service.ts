import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IMemeDocument, MemeModel } from '../model/meme';
import {
  IMemeInteractionDocument,
  InteractionType,
  MemeInteractionModel,
} from '../model/memeInteraction';
import { IUserDocument } from '../model/user';
import { logger } from '../util/logger';

async function getMemeInteractionInfo(
  user: IUserDocument,
  meme: IMemeDocument,
  interactionType: InteractionType,
  isDeletedFilter: boolean = true,
): Promise<IMemeInteractionDocument | null> {
  try {
    const condition = {
      deviceId: user.deviceId,
      memeId: meme._id,
      interactionType,
    };

    // isDeletedFilter true인 경우 { isDeleted: false }로 검색
    // isDeletedFilter false인 경우 {}로 검색 (삭제된 도큐먼트도 검색)
    const isDeletedCondition = isDeletedFilter ? { isDeleted: false } : {};

    const memeInteraction = await MemeInteractionModel.findOne({
      ...condition,
      ...isDeletedCondition,
    });

    return memeInteraction || null;
  } catch (error) {
    logger.error(`Failed to get a MemeInteraction Info(${meme._id} - ${interactionType})`, {
      error,
    });
    throw new CustomError(
      `Failed to get a MemeInteraction Info(${meme._id} - ${interactionType})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getMemeInteractionInfoWithCondition(
  user: IUserDocument,
  meme: IMemeDocument,
  interactionType: InteractionType,
  findCondition: Partial<IMemeInteractionDocument> = {},
): Promise<IMemeInteractionDocument | null> {
  try {
    const condition: Partial<IMemeInteractionDocument> = {
      deviceId: user.deviceId,
      memeId: meme._id,
      interactionType,
      ...findCondition,
    };

    const memeInteraction = await MemeInteractionModel.findOne(condition);
    return memeInteraction || null;
  } catch (err) {
    logger.error(`Failed to get a MemeInteraction Info(${meme._id} - ${interactionType})`);
    throw new CustomError(
      `Failed to get a MemeInteraction Info(${meme._id} - ${interactionType})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getMemeInteractionCount(
  user: IUserDocument,
  interactionType: InteractionType,
): Promise<number> {
  try {
    const count = await MemeInteractionModel.countDocuments({
      deviceId: user.deviceId,
      interactionType,
      isDeleted: false,
    });
    return count;
  } catch (err) {
    logger.error(`Failed to count MemeInteraction(${interactionType})`);
    throw new CustomError(
      `Failed to count MemeInteraction(${interactionType}) (${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getMemeInteractionList(
  page: number,
  size: number,
  user: IUserDocument,
  interactionType: InteractionType,
): Promise<IMemeInteractionDocument[]> {
  try {
    const memeInteractionList = await MemeInteractionModel.find(
      {
        deviceId: user.deviceId,
        interactionType: InteractionType.SAVE,
        isDeleted: false,
      },
      { isDeleted: 0 },
    )
      .skip((page - 1) * size)
      .limit(size)
      .sort({ createdAt: -1 });

    return memeInteractionList;
  } catch (err) {
    logger.error(`Failed to count MemeInteraction(${interactionType})`);
    throw new CustomError(
      `Failed to count MemeInteraction(${interactionType}) (${err.message})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function createMemeInteraction(
  user: IUserDocument,
  meme: IMemeDocument,
  interactionType: InteractionType,
): Promise<IMemeInteractionDocument> {
  try {
    const newMemeInteraction = new MemeInteractionModel({
      deviceId: user.deviceId,
      memeId: meme._id,
      interactionType,
    });
    await newMemeInteraction.save();
    return newMemeInteraction;
  } catch (err) {
    logger.error(`Failed to create a MemeInteraction(${meme._id} - ${interactionType})`);
    throw new CustomError(
      `Failed to create a MemeInteraction(${meme._id} - ${interactionType})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

async function updateMemeInteraction(
  user: IUserDocument,
  meme: IMemeDocument,
  interactionType: InteractionType,
): Promise<void> {
  switch (interactionType) {
    case InteractionType.SAVE:
      await MemeInteractionModel.findOneAndUpdate(
        { memeId: meme._id, deviceId: user.deviceId, interactionType },
        { $set: { isDeleted: false } },
      );
      logger.debug(`[${interactionType}] interaction - updated isDeleted to 'false'`);
      break;

    case InteractionType.REACTION:
      await MemeModel.findOneAndUpdate(
        { _id: meme._id, isDeleted: false },
        { $inc: { reaction: 1 } },
        {
          projection: { _id: 0, createdAt: 0, updatedAt: 0 },
          returnDocument: 'after',
        },
      ).lean();
      logger.debug(`[${interactionType}] interaction - increased Meme reaction count`);
      break;

    case InteractionType.SHARE:
    case InteractionType.WATCH:
      logger.debug(`${interactionType} interaction don't need to be updated. `);
      break;

    default:
      logger.error(`Unsupported interactionType(${interactionType})`);
      throw new CustomError(
        `Unsupported interactionType(${interactionType})`,
        HttpCode.BAD_REQUEST,
      );
  }
}

async function deleteMemeInteraction(
  user: IUserDocument,
  meme: IMemeDocument,
  interactionType: InteractionType,
): Promise<IMemeInteractionDocument> {
  try {
    const memeInteraction = await MemeInteractionModel.findOneAndUpdate(
      { deviceId: user.deviceId, memeId: meme._id, interactionType: InteractionType.SAVE },
      {
        isDeleted: true,
      },
    );

    return memeInteraction;
  } catch (err) {
    logger.error(`Failed to delete a MemeInteraction(${meme._id} - ${interactionType})`);
    throw new CustomError(
      `Failed to delete a MemeInteraction(${meme._id} - ${interactionType})`,
      HttpCode.INTERNAL_SERVER_ERROR,
    );
  }
}

export {
  getMemeInteractionInfo,
  getMemeInteractionInfoWithCondition,
  getMemeInteractionCount,
  getMemeInteractionList,
  createMemeInteraction,
  updateMemeInteraction,
  deleteMemeInteraction,
};
