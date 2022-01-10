import { Request, Response } from 'express';
import ClientModel from '../models/client';

export const getClients = async (req: Request, res: Response) => {
    try {
        const result = await ClientModel.find();
        res.status(200).json({ msg: 'success', clients: result });
    } catch (error) {
        console.log('Get all Clients user failed.', error);
        res.status(500).json({ msg: 'something went wrong.' })
    }
}

export const getClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await ClientModel.findOne({ _id: id });
        if (!result) {
            return res.status(400).json({ msg: 'Client doesn\'t exists' });
        }
        res.status(200).json({ msg: 'success', client: result });
    } catch (error) {
        console.log('Get client failed.', error);
        res.status(500).json({ msg: 'something went wrong.' })
    }
}

export const createClient = async (req: Request, res: Response) => {

    try {
        const { email } = req.body;
        const clientExists = await ClientModel.findOne({ email });
        if (clientExists) return res.status(400).json({ msg: 'Client already exists.' });
        const clientDocument = new ClientModel({
            ...req.body
        });
        const result = await clientDocument.save();
        res.status(200).json({ msg: 'success', client: result });
    } catch (error) {
        console.log('Create client failed.', error);
        res.status(500).json({ msg: 'something went wrong.' })
    }
}

export const updateClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        console.log(id, body);

        const result = await ClientModel.findOneAndUpdate({ _id: id }, { ...body }, { new: true });
        if (!result) {
            return res.status(400).json({ msg: 'Client doesn\'t exists' });
        }
        res.status(200).json({ msg: 'success', client: result });
    } catch (error) {
        console.log('update client failed.', error);
        res.status(500).json({ msg: 'something went wrong.' });
    }
}

export const deleteClient = async (req: Request, res: Response) => {

    try {
        const { id } = req.params;
        const result = await ClientModel.findByIdAndDelete({ _id: id });
        if (!result) {
            return res.status(400).json({ msg: 'Client doesn\'t exists' });
        }
        res.status(200).json({ msg: 'success', client: result });
    } catch (error) {
        console.log('Delete client failed.', error);
        res.status(500).json({ msg: 'something went wrong.' });
    }
}