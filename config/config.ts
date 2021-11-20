import dotenv from "dotenv";
dotenv.config();
export default {
    NODE_ENV: process.env.ENV,
    SERVER_PORT : process.env.PORT
};