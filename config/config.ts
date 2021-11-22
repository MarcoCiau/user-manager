import dotenv from "dotenv";
dotenv.config();
export default {
    NODE_ENV: process.env.ENV,
    SERVER_PORT : process.env.PORT,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    DB_URL: process.env.MONGODB_SRV,
    SALT_ROUNDS: process.env.SALT_ROUNDS
};