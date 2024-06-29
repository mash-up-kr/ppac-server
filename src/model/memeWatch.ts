import mongoose, { Schema } from 'mongoose';

export interface IMemeWatch {
  deviceId: string;
  memeId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MemeWatchSchema: Schema = new Schema(
  {
    deviceId: { type: String, required: true },
    memeId: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'MemeWatch',
  },
);

export const MemeWatchModel = mongoose.model<IMemeWatch>('MemeWatch', MemeWatchSchema);
