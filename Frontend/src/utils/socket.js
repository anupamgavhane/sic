import { io } from 'socket.io-client';

const socket = io('https://sic-v64w.onrender.com/', {
  withCredentials: true,
  autoConnect: false,
});

export default socket;