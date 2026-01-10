import axios, { AxiosError } from 'axios';
import { BackendErrorResponse } from '@/types/api';

const getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) return '/api/v1';

    // Remove trailing slash if present
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }

    // Append /api/v1 if not present
    if (!url.endsWith('/api/v1')) {
        url += '/api/v1';
    }

    return url;
};

const baseURL = getBaseUrl();
console.log('🔌 API Base URL:', baseURL);

const api = axios.create({
    baseURL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => {
        // Unwrap the 'data' property if the backend wraps success responses in { data: ... }
        // Our ResponseUtil.success wraps in { success: true, data: ..., timestamp: ... }
        // So we return the full response or just the data depending on preference.
        // For now, let's return the full response to keep access to meta fields, 
        // OR we can strip it. Let's return the standard axios response, but consumers 
        // should know to look at response.data.data
        return response;
    },
    (error: AxiosError<BackendErrorResponse>) => {
        // 1. Extract the standardized error message from backend
        const backendError = error.response?.data?.error;

        if (backendError) {
            // Override the generic Axios error message with the backend's specific message
            error.message = backendError.message;
        }

        // 2. Handle Authentication Errors (401)
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                // Prevent infinite redirect loops if we are already on login
                if (!window.location.pathname.includes('/login')) {
                    // Optional: Clear token
                    localStorage.removeItem('token');
                    window.location.href = '/login?expired=true';
                }
            }
        }

        // 3. Return the modified error so components can access error.response.data.error.details
        return Promise.reject(error);
    }
);

export default api;
