
import { Schema, Document } from "mongoose";

export interface IPrivateTodoDocument extends Document {
  title: string;
  description: string;
  status: "pending" | "completed";
  userId: Schema.Types.ObjectId;
}

const privateTodoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

export default mangoose.mongoose.model<IPrivateTodoDocument>("privateTodos",privateTodoSchema)