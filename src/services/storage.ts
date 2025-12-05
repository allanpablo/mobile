import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
    saveToken: async (token: string) => {
        await AsyncStorage.setItem('@token', token);
    },

    getToken: async (): Promise<string | null> => {
        return await AsyncStorage.getItem('@token');
    },

    removeToken: async () => {
        await AsyncStorage.removeItem('@token');
    },

    saveUser: async (user: any) => {
        await AsyncStorage.setItem('@user', JSON.stringify(user));
    },

    getUser: async (): Promise<any | null> => {
        const user = await AsyncStorage.getItem('@user');
        return user ? JSON.parse(user) : null;
    },

    removeUser: async () => {
        await AsyncStorage.removeItem('@user');
    },

    clear: async () => {
        await AsyncStorage.clear();
    },
};
