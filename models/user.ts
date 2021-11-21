import { Schema, model } from "mongoose";

interface User {
    email: string,
    password : string, 
}

const userSchema = new Schema<User>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel = model<User>('User', userSchema);

export default UserModel;