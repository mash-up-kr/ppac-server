import mongoose, { Schema } from 'mongoose';

export interface IKeywordCreatePayload {
    name: string;
    memes: mongoose.Types.ObjectId[];
  }
  
export interface IKeyword {
  _id: string;
  name: string;
  memes: mongoose.Types.ObjectId[];
  searchCount: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const KeywordSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    memes: { type: [mongoose.Types.ObjectId], ref: 'Meme', required: true, default: [] },
    searchCount: { type: Number, required: true, default: 0 },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'keyword',
  },
);

export const KeywordModel = mongoose.model<IKeyword>('Keyword', KeywordSchema);
