import mongoose, { Schema, Document } from "mongoose";

export interface ICustomerDocument extends Document {
  name: string;
  email: string;
  phone: string;
}

const customerSchema = new Schema<ICustomerDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICustomerDocument>(
  "Customer",
  customerSchema
);