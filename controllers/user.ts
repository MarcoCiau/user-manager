import { Request, Response } from "express"

export const getUsers = (req: Request, res: Response) => {
    res.status(200).json({ msg: 'get users' });
}

export const getUser = (req: Request, res: Response) => {
    const { id } = req.params;
    res.status(200).json({ msg: 'get user', id });
}

export const createUser = (req: Request, res: Response) => {
    const { body } = req.body;
    res.status(200).json({ msg: 'create user', body });
}

export const updateUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req.body;
    res.status(200).json({ msg: 'create user', id, body });
}

export const deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;
    res.status(200).json({ msg: 'delete user', id });
}