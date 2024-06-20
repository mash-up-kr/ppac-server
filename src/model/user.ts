import mongoose, { Schema } from 'mongoose';

export interface IUserDocument extends Document {
  deviceId: string;
  lastSeenMeme: string[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface IUser {
  deviceId: string;
  lastSeenMeme: string[];
}

export interface IUserInfos extends IUser {
  memeShareCount: number;
  memeReactionCount: number;
  memeSaveCount: number;
}

const UserSchema: Schema = new Schema(
  {
    deviceId: { type: String, required: true },
    lastSeenMeme: { type: Schema.Types.ObjectId, ref: 'Meme' },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'user',
  },
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
