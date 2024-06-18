import mongoose, { Schema } from 'mongoose';

export interface IMemeShare {
  deviceId: string;
  memeId: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const MemeShareSchema: Schema = new Schema(
  {
    deviceId: { type: String, required: true },
    memeId: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'MemeShare',
  },
);

export const MemeShareModel = mongoose.model<IMemeShare>('MemeShare', MemeShareSchema);
