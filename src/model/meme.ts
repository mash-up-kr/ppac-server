import mongoose, { Schema, Document, Types } from 'mongoose';

import { IKeywordGetResponse } from './keyword';

export interface IMemeCreatePayload {
  deviceId: string;
  title: string;
  keywordIds: Types.ObjectId[];
  image: string;
  watch: number;
  source: string;
}

export interface IMemeUpdatePayload {
  title?: string;
  keywordIds?: Types.ObjectId[];
  source?: string;
  isTodayMeme?: boolean;
}

export interface IMeme {
  deviceId: string;
  title: string;
  keywordIds: Types.ObjectId[];
  image: string;
  reaction: number;
  watch: number;
  source: string;
  isTodayMeme: boolean;
}

export interface IMemeGetResponse {
  _id: Types.ObjectId;
  deviceId: string;
  title: string;
  image: string;
  reaction: number;
  source: string;
  isTodayMeme: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  keywords: IKeywordGetResponse[];
  isSaved: boolean; // 나의 파밈함 저장 여부
  isReaction: boolean; // reaction 여부
}

export interface IMemeDocument extends Document {
  _id: Types.ObjectId;
  deviceId: string;
  title: string;
  keywordIds: Types.ObjectId[];
  image: string;
  reaction: number;
  watch: number;
  source: string;
  isTodayMeme: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const MemeSchema: Schema = new Schema(
  {
    deviceId: { type: String, required: true },
    title: { type: String, required: true },
    keywordIds: { type: [Types.ObjectId], ref: 'Keyword', required: true, default: [] },
    image: { type: String, required: true },
    reaction: { type: Number, required: true, default: 0 },
    watch: { type: Number, required: true, default: 0 },
    source: { type: String, required: true, default: '' },
    isTodayMeme: { type: Boolean, requried: true, default: false },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'meme',
  },
);

export const MemeModel = mongoose.model<IMemeDocument>('Meme', MemeSchema);
