import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/auth/me');
      return { user: response.data.user };
    } catch (error) {
      return rejectWithValue({ message: 'Not authenticated' });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return {
        message: response.data.message,
        email: userData.email,
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Registration failed',
      });
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/verify-otp', { email, otp });
      return {
        message: response.data.message,
        user: response.data.user,
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'OTP verification failed',
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      return {
        message: response.data.message,
        user: response.data.user,
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Login failed',
        status: error.response?.status,
      });
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/resend-otp', { email });
      return {
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to resend OTP',
      });
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (credential, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/google-login', { token: credential });
      return {
        message: response.data.message,
        user: response.data.user,
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Google login failed',
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/api/auth/logout');
      return {};
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Logout failed',
      });
    }
  }
);
