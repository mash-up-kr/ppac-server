import mongoose, { Schema, Types } from 'mongoose';

export enum InteractionType {
  WATCH = 'watch',
  REACTION = 'reaction',
  SHARE = 'share',
  SAVE = 'save',
}

export interface IMemeInteraction {
  deviceId: string;
  memeId: Types.ObjectId;
  interactionType: InteractionType;
}

export interface IMemeInteractionDocument extends Document {
  _id: Types.ObjectId;
  deviceId: string;
  memeId: Types.ObjectId;
  interactionType: InteractionType;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MemeInteractionSchema: Schema = new Schema(
  {
    deviceId: { type: String, ref: 'user', required: true },
    memeId: { type: Types.ObjectId, ref: 'keyword', required: true },
    interactionType: { type: String, enum: InteractionType, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'memeInteraction',
  },
);

export const MemeInteractionModel = mongoose.model<IMemeInteractionDocument>(
  'memeInteraction',
  MemeInteractionSchema,
);
