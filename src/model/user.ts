import mongoose, { Schema } from 'mongoose';

export interface IUser {
  deviceID: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const UserSchema: Schema = new Schema(
  {
    deviceID: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'user',
  },
);

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default { UserModel };
