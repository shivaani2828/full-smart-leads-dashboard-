const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;


    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `http error found ${response.status}`);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// API methods
const API = {
    get: (endpoint) => {
        return apiRequest(endpoint, {
            method: 'GET',
        });
    },
    post: (endpoint, body) => {
        return apiRequest(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },
    put: (endpoint, body) => {
        return apiRequest(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },
    patch: (endpoint, body) => {
        return apiRequest(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    },
    delete: (endpoint) => {
        return apiRequest(endpoint, {
            method: 'DELETE',
        });
    },
};

export default API;