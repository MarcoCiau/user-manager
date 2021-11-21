import { Schema, model } from "mongoose";

interface User {
    name: string,
    email: string
}

const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true }
});

const UserModel = model<User>('User', userSchema);

export default UserModel;