import mongoose, { Schema } from "mongoose";
import { User } from "../interface/user";




const UserSchema = new Schema<User>({
    username: { type: String, required: true },
    phone: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
   
});

export const UserModel = mongoose.model("UserModel", UserSchema);

