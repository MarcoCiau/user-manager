import { Request, Response } from 'express';
import config from '../config/config';
import UserModel from '../models/user';
import TokenModel from '../models/token';
import { hashPassword, compareHash, generateAccessToken, generateRefreshToken, verifyRefreshToken, sendEmail } from '../util/auth.util';
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
        const [refreshToken, accessToken] = await Promise.all([generateRefreshToken(result._id), generateAccessToken(result._id)]);
        const refreshTokenEncrypted = await hashPassword(refreshToken);
        const updatedUser = await UserModel.findOneAndUpdate({ _id: result._id }, { refreshToken: refreshTokenEncrypted }, { new: true });
        res.status(200).json({ msg: 'success', user: updatedUser, accessToken, refreshToken });
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
        const [refreshToken, accessToken] = await Promise.all([generateRefreshToken(userExists._id), generateAccessToken(userExists._id)]);
        const refreshTokenEncrypted = await hashPassword(refreshToken);
        const updatedUser = await UserModel.findOneAndUpdate({ _id: userExists._id }, { refreshToken: refreshTokenEncrypted }, { new: true });
        res.status(200).json({ msg: 'success', user: updatedUser, accessToken, refreshToken });
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
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User Doesn\'t exists or the email is invalid.' });
        const oldToken = await TokenModel.findOne({ userId: user._id });
        if (oldToken) oldToken.deleteOne();
        let newToken: string = crypto.randomBytes(32).toString('hex');
        let hashedToken: string = await hashPassword(newToken);
        const tokenDoc = new TokenModel({
            userId: user._id,
            token: hashedToken,
            createdAt: new Date()
        });
        const result = await tokenDoc.save();
        if (!result) return res.status(500).json({ msg: 'Generating new token failed' });
        const link: string = `${config.CLIENT_URL}/passwordReset?token=${newToken}&id=${user._id}`;
        await sendEmail(user.email, "Restablecer Contraseña", link);
        res.status(200).json({ msg: 'forgot password', result, link });
    } catch (error) {
        console.log('forgot password failed.', error);
        res.status(500).json({ msg: 'something went wrong.' })
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    /*
    - check if token exists
    - compare plain token with hashed
    - hash and save new password
    */
    try {
        const { userId, token, password } = req.body;
        const resetToken = await TokenModel.findOne({ userId });
        if (!resetToken) return res.status(400).json({ msg: 'Invalid o expired password reset token.' });
        const isValidToken: boolean = await compareHash(token, resetToken.token);
        if (!isValidToken) return res.status(400).json({ msg: 'Invalid o expired password reset token.' });
        const hashedPassword: string = await hashPassword(password);
        const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, { password: hashedPassword }, { new: true });
        resetToken.deleteOne({ userId });
        res.status(200).json({ msg: 'success', user: updatedUser });
    } catch (error) {
        console.log('reset user password failed.', error);
        res.status(500).json({ msg: 'something went wrong.' })
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    /*
    - check if token exists
    - compare plain token with hashed
    - verify access token : todo
    - create new access & refresh token
    */
    try {
        const { refreshToken, userId } = req.body;
        const user = await UserModel.findOne({userId});
        if (!user) return res.status(400).json({ msg: 'User doesn\'t exists or the userId is Invalid.' });
        const isValidToken: boolean = await compareHash(refreshToken, user.refreshToken);
        if (!isValidToken) return res.status(400).json({ msg: 'Invalid refresh token.' });
        const validRefreshToken = await verifyRefreshToken(refreshToken);
        if (!validRefreshToken) return res.status(400).json({ msg: 'Invalid refresh token.' })
        const [newRefreshToken, accessToken] = await Promise.all([generateRefreshToken(user._id), generateAccessToken(user._id)]);
        const refreshTokenEncrypted = await hashPassword(newRefreshToken);
        const updatedUser = await UserModel.findOneAndUpdate({ _id: user._id }, { refreshToken: refreshTokenEncrypted }, { new: true });
        res.status(200).json({ msg: 'success', user: updatedUser, accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.log('reset user password failed.', error);
        res.status(500).json({ msg: 'something went wrong.' });
    }
}
