import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

// Definição das formas (tipos) para o TypeScript não reclamar
interface User {
  id: string | number;
  name: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(credentials: object): Promise<void>;
  signOut(): void;
  signUp(credentials: object): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      // No celular, a busca no "banco" local é assíncrona (await)
      const storagedUser = await AsyncStorage.getItem('@MyReadify:user');
      const storagedToken = await AsyncStorage.getItem('@MyReadify:token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
      }
      setLoading(false);
    }
    loadStoragedData();
  }, []);

  const signIn = async ({ email, password }: any) => {
    try {
      const response = await api.post('/login', { email, password });
      const { user: apiUser, token } = response.data;

      await AsyncStorage.setItem('@MyReadify:user', JSON.stringify(apiUser));
      await AsyncStorage.setItem('@MyReadify:token', token);

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(apiUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Falha no login');
    }
  };

  const signUp = async ({ name, email, password }: any) => {
    try {
      const response = await api.post('/register', { name, email, password });
      const { user: apiUser, token } = response.data;

      await AsyncStorage.setItem('@MyReadify:user', JSON.stringify(apiUser));
      await AsyncStorage.setItem('@MyReadify:token', token);

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(apiUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Não foi possível realizar o cadastro.');
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@MyReadify:user');
    await AsyncStorage.removeItem('@MyReadify:token');
    setUser(null);
    delete api.defaults.headers.Authorization;
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);