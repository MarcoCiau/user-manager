import { Request, Response } from 'express';
import UserModel from '../models/user';
import TokenModel from '../models/token';
import { hashPassword, generateJWT } from '../util/auth.util';
import crypto from 'crypto';

export const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) return res.status(400).json({ msg: 'User already exists.' });
        const hashedPassword: string = await hashPassword(password);
        const userDoc = new UserModel({
            email,
            password: hashedPassword
        });
        const result = await userDoc.save();
        const token: string = await generateJWT(result._id);
        res.status(200).json({ msg: 'success', user: result, token });
    } catch (error) {
        console.log('Signing up user failed.', error);
        res.status(500).json({ msg: 'something went wrong.' })
    }
}

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const userExists = await UserModel.findOne({ email });
        if (!userExists) return res.status(400).json({ msg: 'User Doesn\'t exists or the email is invalid.' });
        const isValidPassword = await userExists.comparePassword(password);
        if (!isValidPassword) {
            return res.status(400).json({ msg: 'Invalid Password.' });
        }
        const token: string = await generateJWT(userExists._id);
        res.status(200).json({ msg: 'success', user: userExists, token });
    } catch (error) {
        console.log('Signing in user failed.', error);
        res.status(500).json({ msg: 'something went wrong.' })
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    /*
    - check if user exists
    - check if there is an available token, if yes, delete it
    - create new tolen with crypto
    - hash token and save it to db
    - send email with template & url that contain an userId & token (plain text)
    */
    const { email} = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User Doesn\'t exists or the email is invalid.' });
    const oldToken = await TokenModel.findOne({userId: user._id});
    if (oldToken) oldToken.deleteOne();
    let newToken:string = crypto.randomBytes(32).toString('hex');
    let hashedToken:string = await hashPassword(newToken);
    const tokenDoc = new TokenModel({
        userId: user._id,
        token: hashedToken, 
        createdAt: new Date()
    });
    const result = await tokenDoc.save();
    if (!result) return res.status(500).json({ msg: 'sGenerating new token failed' });
    //TODO: send email
    res.status(200).json({ msg: 'forgot password', result });
}

export const resetPassword = (req: Request, res: Response) => {
    res.status(200).json({ msg: 'reset password' });
}
