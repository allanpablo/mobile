import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.33:3000'; // IP do servidor

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expirado, fazer logout
            await AsyncStorage.removeItem('@token');
            await AsyncStorage.removeItem('@user');
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email: string, senha: string) => {
        const response = await api.post('/auth/login', { email, senha });
        return response.data;
    },

    register: async (nome: string, email: string, senha: string) => {
        const response = await api.post('/auth/register', { nome, email, senha });
        return response.data;
    },
};

export const higienizacaoService = {
    iniciar: async (codigoSetor: string) => {
        const response = await api.post('/higienizacao/iniciar', { codigoSetor });
        return response.data;
    },

    finalizar: async (id: string, observacoes?: string) => {
        const response = await api.post(`/higienizacao/finalizar/${id}`, { observacoes });
        return response.data;
    },

    emAndamento: async () => {
        const response = await api.get('/higienizacao/em-andamento');
        return response.data;
    },

    historico: async () => {
        const response = await api.get('/higienizacao/historico');
        return response.data;
    },
};

export const setoresService = {
    buscarPorCodigo: async (codigo: string) => {
        const response = await api.get(`/setores/codigo/${codigo}`);
        return response.data;
    },
};

export default api;
