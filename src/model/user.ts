import mongoose, { Schema, Types } from 'mongoose';

export interface IUser {
  deviceId: string;
  lastSeenMeme: Types.ObjectId[];
}

export interface IUserInfos extends IUser {
  watch: number;
  share: number;
  reaction: number;
  save: number;
}

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  deviceId: string;
  lastSeenMeme: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const UserSchema: Schema = new Schema(
  {
    deviceId: { type: String, required: true },
    lastSeenMeme: { type: [Schema.Types.ObjectId], ref: 'Meme', required: true, default: [] },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'user',
  },
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
