import mongoose, { Schema, Types } from 'mongoose';
export interface IKeywordCategoryCreatePayload {
  name: string;
  isRecommend: boolean;
}

export interface IKeywordCategoryUpdatePayload {
  name?: string;
  isRecommend?: boolean;
}

export interface IKeywordCategory {
  name: string;
  isRecommend: boolean;
}

export interface IKeywordCategoryDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  isRecommend: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const KeywordCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    isRecommend: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'keywordCategory',
  },
);

export const KeywordCategoryModel = mongoose.model<IKeywordCategoryDocument>(
  'KeywordCategory',
  KeywordCategorySchema,
);
