const BASE_URL = 'https://dummyjson.com';

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.message || 'An error occurred');
    }
    return response.json();
}

export const api = {
    get: async <T>(endpoint: string): Promise<T> => {
        const res = await fetch(`${BASE_URL}${endpoint}`);
        return handleResponse<T>(res);
    },

    post: async <T>(endpoint: string, data: Record<string, unknown>): Promise<T> => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse<T>(res);
    },

    put: async <T>(endpoint: string, data: Record<string, unknown>): Promise<T> => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse<T>(res);
    },

    delete: async <T>(endpoint: string): Promise<T> => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
        });
        return handleResponse<T>(res);
    },
};
