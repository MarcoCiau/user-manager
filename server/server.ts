import express, { Application } from 'express';
import envConfig from '../config/config';
import connectDB from '../config/db';
import cors from 'cors';
import userRoutes from '../routes/user';
import authRoutes from '../routes/auth';
class Server {
    private app: Application;
    private port: string;
    private corsOrigin: string;
    constructor() {
        this.app = express();
        this.port = envConfig.SERVER_PORT || '8000';
        this.corsOrigin = envConfig.CORS_ORIGIN || 'localhost:8000';
        this.middlewares();
        this.routes();
    }

    middlewares() {
        /* enable cors */
        this.app.use(cors());
        /* parse application/json requests*/
        this.app.use(express.json());
        /* parse application/x-www-form-urlencoded requests. Only parse string or arrays*/
        this.app.use(express.urlencoded({extended: false}));
    }

    routes() {
        this.app.use('/api/v1/user', userRoutes);
        this.app.use('/api/v1/auth', authRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port: ${this.port}`);
        });
    }

    async init() {
        try {
            const isDBConnected = await connectDB();
            console.log('DB Connected!');
            this.listen();
        } catch (error) {
            console.log('Init Server Failed : ', error);
        }
    }
}

export default Server;