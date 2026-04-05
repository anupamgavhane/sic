import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import roomReducer from '../features/rooms/roomSlice';
import messageReducer from '../features/messages/messageSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomReducer,
    messages: messageReducer,
  },
});

export default store;
