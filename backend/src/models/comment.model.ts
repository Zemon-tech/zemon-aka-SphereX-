import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  text: string;
  author: Schema.Types.ObjectId;
  idea: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  likes: Schema.Types.ObjectId[];
}

const CommentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  idea: {
    type: Schema.Types.ObjectId,
    ref: 'Idea',
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

export default mongoose.model<IComment>('Comment', CommentSchema); 