import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_BASE_URL;

const socket = io(URL);

//handle reconnect event

export default socket;
