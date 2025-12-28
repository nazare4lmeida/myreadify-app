import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Substitua pelo IP atual da sua máquina se ele mudar
const IP_SERVIDOR = '192.168.100.180'; 

const api = axios.create({
  baseURL: `http://${IP_SERVIDOR}:3333`,
});

// URL base para as imagens (apontando para a rota de arquivos estáticos do seu backend)
export const IMAGE_BASE_URL = `http://${IP_SERVIDOR}:3333/files`;

api.interceptors.request.use(
  async (config) => {
    // No React Native, buscamos o token de forma assíncrona no AsyncStorage
    const token = await AsyncStorage.getItem('@MyReadify:token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Caso ocorra erro antes da requisição ser enviada
    return Promise.reject(error);
  }
);

export default api;