import mongoose, { Schema } from 'mongoose';

export interface IMemeShare {
  deviceID: string;
  memeID: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const MemeShareSchema: Schema = new Schema(
  {
    deviceID: { type: String, required: true },
    memeID: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'MemeShare',
  },
);

export const MemeShareModel = mongoose.model<IMemeShare>('MemeShare', MemeShareSchema);
