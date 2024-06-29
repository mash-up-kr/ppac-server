import mongoose, { Schema } from 'mongoose';

export interface IMemeReaction {
  deviceId: string;
  memeId: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const MemeReactionSchema: Schema = new Schema(
  {
    deviceId: { type: String, required: true },
    memeId: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'MemeReaction',
  },
);

export const MemeReactionModel = mongoose.model<IMemeReaction>('MemeReaction', MemeReactionSchema);
