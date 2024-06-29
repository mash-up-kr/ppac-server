import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IKeywordCreatePayload {
  name: string;
}

export interface IKeywordUpdatePayload {
  name?: string;
}

export interface IKeyword {
  name: string;
  searchCount: number;
}

export interface IKeywordDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  searchCount: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const KeywordSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
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
