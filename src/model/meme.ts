import mongoose, { Schema, Document, Types } from 'mongoose';

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
  watch: number;
  source: string;
  isTodayMeme: boolean;
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

// keywordIds로 조회한 keywords로 대체된 Meme 정보
export interface IMemeWithKeywords extends Omit<IMemeDocument, 'keywordIds'> {
  keywords: string[];
}

const MemeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    keywordIds: { type: [Types.ObjectId], ref: 'Keyword', required: true, default: [] },
    image: { type: String, required: true },
    reaction: { type: Number, required: true, default: 0 },
    source: { type: String, required: true },
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
