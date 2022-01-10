import {Request, Response } from 'express';
import ClientModel from '../models/client';

export const getClients = (req: Request, res: Response) => {
    res.status(200).json({ msg: 'get clients' });
}

export const getClient = (req: Request, res: Response) => {
    const { id } = req.params;
    res.status(200).json({ msg: 'get client', id });
}

export const createClient= (req: Request, res: Response) => {
    const { body } = req.body;
    res.status(200).json({ msg: 'create client', body });
}

export const updateClient = (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req.body;
    res.status(200).json({ msg: 'update client', id, body });
}

export const deleteClient = (req: Request, res: Response) => {
    const { id } = req.params;
    res.status(200).json({ msg: 'delete client', id });
}