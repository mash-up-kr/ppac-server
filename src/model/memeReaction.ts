import mongoose, { Schema } from 'mongoose';

export interface IMemeReaction {
  deviceID: string;
  memeID: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const MemeReactionSchema: Schema = new Schema(
  {
    deviceID: { type: String, required: true },
    memeID: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'MemeReaction',
  },
);

export const MemeReactionModel = mongoose.model<IMemeReaction>('MemeReaction', MemeReactionSchema);
