import express, { Application } from 'express';
import envConfig from '../config/config';

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = envConfig.SERVER_PORT || '8000';
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port: ${this.port}`);
        });
    }
}

export default Server;