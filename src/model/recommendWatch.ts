import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRecommendWatchCreatePayload {
  deviceId: string;
  startDate: Date;
  memeIds: Types.ObjectId[];
}

export interface IRecommendWatchUpdatePayload {
  deviceId?: string;
  startDate?: Date;
  memeIds?: Types.ObjectId[];
}

export interface IRecommendWatch {
  deviceId: string;
  startDate: Date;
  memeIds: Types.ObjectId[];
}

export interface IRecommendWatchDocument extends Document {
  _id: Types.ObjectId;
  deviceId: string;
  startDate: Date;
  memeIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const RecommendWatchSchema: Schema = new Schema(
  {
    deviceId: { type: String, required: true },
    startDate: { type: Date, required: true },
    memeIds: [{ type: Types.ObjectId, ref: 'Meme', required: true }],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'recommendWatch',
  },
);

export const RecommendWatchModel = mongoose.model<IRecommendWatchDocument>(
  'RecommendWatch',
  RecommendWatchSchema,
);
