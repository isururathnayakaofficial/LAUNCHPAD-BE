import mongoose, { Document, Schema } from "mongoose";


export interface ITaskDocument extends Document {

    title:string;

    name:string;

    email:string;

    role:string;

    description:string;

    mediaUrl?: string[];

    inviteToken:string;

    assignedUserId?: mongoose.Types.ObjectId;

    status:'pending' | 'in-progress' | 'completed';

    createdAt:Date;

    updatedAt:Date;
}



const taskSchema = new Schema<ITaskDocument>(

{

title:{
    type:String,
    required:true
},


email:{
    type:String,
    required:true,
    lowercase:true
},

name:{
    type:String,
    required:true
},


role:{
    type:String,
    required:true
},


description:{
    type:String,
    required:true
},


mediaUrl:[{
    type:String
}],



inviteToken:{
    type:String,
    required:true,
    unique:true
},



assignedUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},



status:{
    type:String,
    enum:[
        'pending',
        'in-progress',
        'completed'
    ],
    default:'pending'
}


},

{
timestamps:true
}

);


export default mongoose.model<ITaskDocument>(
"Tasks",
taskSchema
);