import mongoose, { Document, Schema } from "mongoose";

export interface tasklist extends Document {
  title: string;
  description?: string;
  customField?: string;
  deadline?: Date;
  notifications?: Array<Date>;
  userId: string;
    createdAt: Date;
    updatedAt: Date;
}   
const TasklistSchema: Schema = new Schema<tasklist>(
  {
    title: { type: String, required: true },
    description: { type: String },
    customField: { type: String },
    deadline: { type: Date },
    notifications: { type: [Date], default: [] },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Tasklist = mongoose.model<tasklist>("Tasklist", TasklistSchema);