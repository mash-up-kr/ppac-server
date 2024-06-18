import mongoose, { Schema, Document } from 'mongoose';

export interface IMemeCreatePayload {
  keywords: string[];
  image: string;
  source: string;
  isTodayMeme: boolean;
}

export interface IMeme {
  keywords: string[];
  image: string;
  reaction: number;
  source: string;
  isTodayMeme: boolean;
}

export interface IMemeDocument extends Document {
  keywords: string[];
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
    image: { type: String, required: true },
    keywords: { type: [String], requried: true, default: [] },
    reaction: { type: Number, required: true, default: 0 },
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
