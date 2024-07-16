import axios from 'axios';
import { useAuthStore } from '@/stores';

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
    patch: request("PATCH")
};

function request(method) {
    return async (url, body, isImage=false, formData=null) => {
        const requestOptions = {
            method,
            headers: authHeader(url)
        };
        if (body) {
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.data = JSON.stringify(body);
        }
        if (isImage) {
            requestOptions.responseType = 'arraybuffer';
        }
        if (formData) {
            requestOptions.headers['Content-Type'] = 'multipart/form-data';
            requestOptions.data = formData;
        }

        return axios(url, requestOptions)
    }
}

// Helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const { token } = useAuthStore();
    const isLoggedIn = !!token;
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
}

export function handleResponse(response,token,logout) {
    if ([401, 403].includes(response.status) && token) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        logout();
    }
}
