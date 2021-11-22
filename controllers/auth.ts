import { Request, Response } from 'express';
import UserModel from '../models/user';
import { hashPassword, generateJWT } from '../util/auth.util';

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

export const forgotPassword = (req: Request, res: Response) => {
    res.status(200).json({ msg: 'forgot password' });
}

export const resetPassword = (req: Request, res: Response) => {
    res.status(200).json({ msg: 'reset password' });
}
