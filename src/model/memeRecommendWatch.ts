import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMemeRecommendWatchCreatePayload {
  deviceId: string;
  startDate: Date;
  memeIds: Types.ObjectId[];
}

export interface IMemeRecommendWatchUpdatePayload {
  deviceId?: string;
  startDate?: Date;
  memeIds?: Types.ObjectId[];
}

export interface IMemeRecommendWatch {
  deviceId: string;
  startDate: Date;
  memeIds: Types.ObjectId[];
}

export interface IMemeRecommendWatchDocument extends Document {
  _id: Types.ObjectId;
  deviceId: string;
  startDate: Date;
  memeIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MemeRecommendWatchSchema: Schema = new Schema(
  {
    deviceId: { type: String, required: true },
    startDate: { type: Date, required: true },
    memeIds: [{ type: Types.ObjectId, ref: 'Meme', required: true }],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'MemeRecommendWatch',
  },
);

export const MemeRecommendWatchModel = mongoose.model<IMemeRecommendWatchDocument>(
  'MemeRecommendWatch',
  MemeRecommendWatchSchema,
);
