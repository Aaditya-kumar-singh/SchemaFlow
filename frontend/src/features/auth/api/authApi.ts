import api from '@/lib/api/axios';
import { BackendResponse } from '@/types/api';

export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export const authApi = {
    login: async (data: any) => {
        const response = await api.post<BackendResponse<AuthResponse>>('/auth/login', data);
        return response.data.data; // Unwrap the nested data
    },

    register: async (data: any) => {
        const response = await api.post<BackendResponse<AuthResponse>>('/auth/register', data);
        return response.data.data; // Unwrap the nested data
    },

    // Optional: Get current user if token exists (me endpoint)
    // me: async () => { ... }
};
