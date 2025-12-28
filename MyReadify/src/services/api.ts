import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.100.180:3333',
});

api.interceptors.request.use(
  async (config) => {
    // No mobile, buscamos o token de forma assíncrona
    const token = await AsyncStorage.getItem('@MyReadify:token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;