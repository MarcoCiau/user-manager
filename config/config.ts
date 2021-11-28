import dotenv from "dotenv";
dotenv.config();
export default {
    NODE_ENV: process.env.ENV,
    SERVER_PORT : process.env.PORT,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    DB_URL: process.env.MONGODB_SRV,
    JWT_PRIVATE_KEY: process.env.JWT_KEY || '1234567890ABCDEFGHIJK',
    CLIENT_URL: process.env.CLIENT_URL || 'localhost'
};