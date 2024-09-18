import mongoose, { Schema, Document, Types } from 'mongoose';

import { IKeywordGetResponse } from './keyword';

export interface IMemeCreatePayload {
  title: string;
  keywordIds: Types.ObjectId[];
  image: string;
  source: string;
}

export interface IMemeUpdatePayload {
  title?: string;
  keywordIds?: Types.ObjectId[];
  source?: string;
  isTodayMeme?: boolean;
}

export interface IMeme {
  title: string;
  keywordIds: Types.ObjectId[];
  image: string;
  reaction: number;
  source: string;
  isTodayMeme: boolean;
}

export interface IMemeGetResponse {
  _id: Types.ObjectId;
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
  title: string;
  keywordIds: Types.ObjectId[];
  image: string;
  reaction: number;
  source: string;
  isTodayMeme: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const MemeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    keywordIds: { type: [Types.ObjectId], ref: 'Keyword', required: true, default: [] },
    image: { type: String, required: true },
    reaction: { type: Number, required: true, default: 0 },
    source: { type: String, default: '' },
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
