'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { User } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    loginAsGuest: () => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Initialize from storage on client side only to prevent hydration mismatch
        const storedUser = storage.getUser();
        if (storedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(storedUser);
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const data = await api.post<User>('/auth/login', {
                username,
                password,
                expiresInMins: 60, // optional
            });

            setUser(data);
            storage.setToken(data.token!);
            storage.setUser(data);
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const loginAsGuest = () => {
        const guestUser: User = {
            id: 0,
            username: 'guest',
            email: 'guest@example.com',
            firstName: 'Guest',
            lastName: 'User',
            gender: 'unknown',
            image: '',
            token: 'guest-token'
        };
        setUser(guestUser);
        storage.setToken(guestUser.token!);
        storage.setUser(guestUser);
        router.push('/');
    };

    const logout = () => {
        setUser(null);
        storage.removeToken();
        storage.removeUser();
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, loginAsGuest, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
