import 'dotenv/config';
import express from 'express';
import db  from './lib/database.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cors from 'cors';
import { createSocket } from "./lib/socket.js";
import bodyParser from 'body-parser';
import http from 'http';
const jsonParser = bodyParser.json();
const app = express();
const server = http.createServer(app);
app.use(jsonParser);
app.use(cors());
authRoutes(app);
userRoutes(app);
createSocket(server);
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', async(req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
    console.log(`http://localhost:${process.env.SERVER_PORT}\n`);
});
/*
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
    console.log(`http://localhost:${process.env.SERVER_PORT}\n`);
});
*/
export default server;