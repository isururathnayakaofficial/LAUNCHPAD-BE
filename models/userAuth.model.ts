import mangoose , { Schema, Document } from "mongoose";

export interface IUserAuthDocument extends Document {
  name: string;
  email: string;
  password: string;

}

const userAuthSchema = new Schema<IUserAuthDocument>(
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
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    },
);

export default mangoose.model<IUserAuthDocument>("UserAuth", userAuthSchema);