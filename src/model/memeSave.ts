import mongoose, { Schema } from 'mongoose';

export interface IMemeSave {
  deviceId: string;
  memeId: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const MemeSaveSchema: Schema = new Schema(
  {
    deviceId: { type: String, required: true },
    memeId: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'MemeSave',
  },
);

export const MemeSaveModel = mongoose.model<IMemeSave>('MemeSave', MemeSaveSchema);
