import { io } from 'socket.io-client';

const socket = io(
  import.meta.env.MODE === 'production'
    ? 'https://sic-v64w.onrender.com'
    : 'http://localhost:3000',
  {
    withCredentials: true,
    autoConnect: false,
  }
);

export default socket;