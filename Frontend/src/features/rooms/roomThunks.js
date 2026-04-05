import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (category, { rejectWithValue }) => {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/rooms', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch rooms',
      });
    }
  }
);

export const fetchMyRooms = createAsyncThunk(
  'rooms/fetchMyRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/rooms/my-rooms');
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch your rooms',
      });
    }
  }
);

export const fetchRoom = createAsyncThunk(
  'rooms/fetchRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch room',
      });
    }
  }
);

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await api.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to create room',
      });
    }
  }
);

export const joinRoom = createAsyncThunk(
  'rooms/joinRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/rooms/${roomId}/join`);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to join room',
      });
    }
  }
);

export const leaveRoom = createAsyncThunk(
  'rooms/leaveRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/rooms/${roomId}/leave`);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to leave room',
      });
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      await api.delete(`/rooms/${roomId}`);
      return { roomId };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to delete room',
      });
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'rooms/fetchMessages',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/${roomId}/messages`);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch messages',
      });
    }
  }
);

export const removeMember = createAsyncThunk(
  'rooms/removeMember',
  async ({ roomId, memberId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/rooms/${roomId}/remove/${memberId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to remove member',
      });
    }
  }
);
