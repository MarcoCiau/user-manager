import Server from './server/server';
import connectDB from './config/db';
const server = new Server();

server.init();

