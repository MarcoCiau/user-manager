import {Request, Response} from 'express';

export const signup = (req: Request, res: Response) => {
    res.status(200).json({ msg: 'signup' });
}

export const signin = (req: Request, res: Response) => {
    res.status(200).json({ msg: 'signin' });
}

export const forgotPassword = (req: Request, res: Response) => {
    res.status(200).json({ msg: 'forgot password' });
}

export const resetPassword = (req: Request, res: Response) => {
    res.status(200).json({ msg: 'reset password' });
}
