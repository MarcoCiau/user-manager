import { Request, Response } from 'express';
import config from '../config/config';
import UserModel from '../models/user';
import PasswordTokenModel from '../models/passwordToken';
import RefreshTokenModel from '../models/refreshToken';
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
        res.status(200).json({ msg: 'success', user: result });
    } catch (error) {
        console.log('Signing up user failed.', error);
        res.status(500).json({ msg: 'something went wrong.' })
    }
}

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        /* Verify User */
        const userExists = await UserModel.findOne({ email });
        if (!userExists) return res.status(400).json({ msg: 'User Doesn\'t exists or the email is invalid.' });
        /* Validate Password */
        const isValidPassword = await userExists.comparePassword(password);
        if (!isValidPassword) {
            return res.status(400).json({ msg: 'Invalid Password.' });
        }
        /* Generate Refresh & Access Tokens */
        const [refreshToken, accessToken] = await Promise.all([generateRefreshToken(userExists._id), generateAccessToken(userExists._id)]);
        /* Check if current refresh token exists */
        const refreshTokenExists = await RefreshTokenModel.findOne({userId: userExists._id});
        if (refreshTokenExists) refreshTokenExists.deleteOne();
        /* Create & Save new Refresh Token */
        const refreshTokenDoc = new RefreshTokenModel({
            userId: userExists._id,
            refreshToken: refreshToken
        });
        const newRefreshToken = await refreshTokenDoc.save();  
        /* Send Response */      
        res.status(200).json({ msg: 'success', user: userExists, accessToken, refreshToken:newRefreshToken.refreshToken });
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
        const oldToken = await PasswordTokenModel.findOne({ userId: user._id });
        if (oldToken) oldToken.deleteOne();
        let newToken: string = crypto.randomBytes(32).toString('hex');
        let hashedToken: string = await hashPassword(newToken);
        const tokenDoc = new PasswordTokenModel({
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
        const resetToken = await PasswordTokenModel.findOne({ userId });
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
        /* Check if current refresh token exists */
        const refreshTokenExists = await RefreshTokenModel.findOne({userId, refreshToken});
        if (!refreshTokenExists) return res.status(400).json({ msg: 'Refresh Token Doesn\t exists in DB' });
        refreshTokenExists.deleteOne();
        /* Verify Refresh Token */
        const validToken = await verifyRefreshToken(refreshToken);
        if (!validToken) return res.status(400).json({ msg: 'Verify JWT Failed: Refresh Token is expired or invalid' });
        /* Generate Refresh & Access Tokens */
        const [newRefreshToken, accessToken] = await Promise.all([generateRefreshToken(userId), generateAccessToken(userId)]);
        /* Create & Save new Refresh Token */
        const refreshTokenDoc = new RefreshTokenModel({
            userId,
            refreshToken: newRefreshToken
        });
        const result = await refreshTokenDoc.save();  
        /* Send Response */      
        res.status(200).json({ msg: 'success', accessToken, refreshToken:result.refreshToken });
    } catch (error) {
        console.log('reset refresh token failed.', error);
        res.status(500).json({ msg: 'something went wrong.' });
    }
}
