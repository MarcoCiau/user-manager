import { Schema, model, Types } from "mongoose";

interface Token {
    userId: Types.ObjectId,
    token: string,
    createdAt: Date
}

const tokenSchema:Schema<Token> = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    token : {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: new Date()
     }
});
const PasswordTokenModel = model<Token>('PasswordTokens', tokenSchema);

export default PasswordTokenModel;