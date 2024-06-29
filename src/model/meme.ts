import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMemeCreatePayload {
  title: string;
  keywordIds: Types.ObjectId[];
  image: string;
  source: string;
  isTodayMeme: boolean;
}

export interface IMemeUpdatePayload {
  title: string;
  keywordIds: Types.ObjectId[];
  source: string;
  isTodayMeme: boolean;
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
  keywordIds: string[];
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
    title: { type: String, required: true },
    keywordIds: { type: [Types.ObjectId], ref: 'Keyword', required: true, default: [] },
    image: { type: String, required: true },
    reaction: { type: Number, required: true, default: 0 },
    watch: { type: Number, required: true, default: 0 },
    source: { type: String, required: true },
    isTodayMeme: { type: Boolean },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'meme',
  },
);

export const MemeModel = mongoose.model<IMemeDocument>('Meme', MemeSchema);
