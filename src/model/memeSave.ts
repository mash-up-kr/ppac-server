import mongoose, { Schema } from 'mongoose';

export interface IMemeSave {
  deviceID: string;
  memeID: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const MemeSaveSchema: Schema = new Schema(
  {
    deviceID: { type: String, required: true },
    memeID: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'MemeSave',
  },
);

export const MemeSaveModel = mongoose.model<IMemeSave>('MemeSave', MemeSaveSchema);
