import { Schema, model } from "mongoose";

interface User {
    email: string,
    password: string,
}

const userSchema = new Schema<User>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.methods.toJSON = function () {
    const { password, __v, ...user } = this.toObject();
    return user;
}

const UserModel = model<User>('Users', userSchema);

export default UserModel;