import mongoose, { Schema } from 'mongoose';
export interface IKeywordCategoryCreatePayload {
  name: string;
  isRecommend: boolean;
}

export interface IKeywordCategoryUpdatePayload {
  name?: string;
  isRecommend?: boolean;
}

export interface IKeywordCategory {
  _id: string;
  name: string;
  isRecommend: boolean;
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

export const KeywordCategoryModel = mongoose.model<IKeywordCategory>(
  'KeywordCategory',
  KeywordCategorySchema,
);
