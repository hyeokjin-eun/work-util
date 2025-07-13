import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/protected/profile');
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/protected/dashboard');
    return response.data;
  }
};