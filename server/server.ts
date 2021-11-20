import express, { Application } from 'express';
import envConfig from '../config/config';
import cors from 'cors';

class Server {
    private app: Application;
    private port: string;
    private corsOrigin: string;
    constructor() {
        this.app = express();
        this.port = envConfig.SERVER_PORT || '8000';
        this.corsOrigin = envConfig.CORS_ORIGIN || 'localhost:8000';
        this.middlewares();
    }

    middlewares() {
        /* enable cors */
        this.app.use(cors({origin: this.corsOrigin}));
        /* parse application/json requests*/
        this.app.use(express.json);
        /* parse application/x-www-form-urlencoded requests. Only parse string or arrays*/
        this.app.use(express.urlencoded({extended: false}));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port: ${this.port}`);
        });
    }
}

export default Server;