export const storage = {
    getToken: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('auth_token');
    },
    setToken: (token: string) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('auth_token', token);
    },
    removeToken: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('auth_token');
    },
    getUser: () => {
        if (typeof window === 'undefined') return null;
        const user = localStorage.getItem('auth_user');
        return user ? JSON.parse(user) : null;
    },
    setUser: (user: unknown) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('auth_user', JSON.stringify(user));
    },
    removeUser: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('auth_user');
    },
    // Generic helper for other data
    getItem: <T>(key: string, defaultValue: T): T => {
        if (typeof window === 'undefined') return defaultValue;
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    },
    setItem: (key: string, value: unknown) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, JSON.stringify(value));
    },
};
