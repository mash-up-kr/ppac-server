import mongoose, { Schema } from 'mongoose';

export interface IUser {
  deviceID: string;
  lastSeenMeme: string[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface IUserInfos extends IUser {
  memeShareCount: number;
  memeReactionCount: number;
  memeSaveCount: number;
}

const UserSchema: Schema = new Schema(
  {
    deviceID: { type: String, required: true },
    lastSeenMeme: { type: [String], default: [] },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'user',
  },
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
