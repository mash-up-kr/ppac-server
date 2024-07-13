import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IKeywordCreatePayload {
  name: string;
  category: string;
}

export interface IKeywordUpdatePayload {
  name?: string;
  category?: string;
}

export interface IKeywordWithImage extends IKeyword {
  topReactionImage: string;
}

export interface IKeywordGetResponse {
  _id: Types.ObjectId;
  name: string;
}

export interface IKeyword {
  name: string;
  category: string;
  searchCount: number;
}

export interface IKeywordDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  category: string;
  searchCount: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const KeywordSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    searchCount: { type: Number, required: true, default: 0 },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'keyword',
  },
);

export const KeywordModel = mongoose.model<IKeywordDocument>('Keyword', KeywordSchema);
