import { Schema, model, Document } from "mongoose";

interface Client {
    name: string,
    company: string,
    fullName: string,
    rfc: string,
    email: string,
    phone: string
}

const clientSchema: Schema<Client> = new Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    rfc: {
        type: String,
        required: true,
        maxlength: 12
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
});

const ClientModel = model<Client>('Clients', clientSchema);

export default ClientModel;