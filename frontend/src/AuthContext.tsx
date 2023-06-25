import React, { createContext, useState, useCallback } from "react";
import axios from "axios"

// Create the Context
interface AuthContextType {
    token: string | null;
    isAuthenticated: () => boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string, role: string) => Promise<void>;
    passwordResetRequest: (email: string) => Promise<void>;
    passwordReset: (resetCode: string, newPassword: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface props { 
    children: any
}
// Create the Context Provider
export const AuthProvider: React.FC<props> = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await axios.post('/auth/login', { email, password });
            const token = response.data.token;
            localStorage.setItem('token', token); // store token in local storage for persistence
            setToken(token);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const register = useCallback(async (email: string, password: string, name: string, role: string) => {
        try {
          const response = await axios.post('/auth/register', { email, password, name, role });
          const token = response.data.token;
          localStorage.setItem('token', token); // store token in local storage for persistence
          setToken(token);
        } catch (error) {
          console.error(error);
        }
      }, []);
      
    const logout = useCallback(async () => {
        try {
            await axios.post('/auth/logout', { token });
            localStorage.removeItem('token'); // remove token from local storage
            setToken(null);
        } catch (error) {
            console.error(error);
        }
    }, [token]); // token dependency 
    
    const passwordResetRequest = useCallback(async (email: string) => {
        try {
            const response = await axios.post('/auth/passwordreset/request', { email });
            // handle response
        } catch (error) {
            console.error(error);
        }
    }, []);
    
    const passwordReset = useCallback(async (resetCode: string, newPassword: string) => {
        try {
            const response = await axios.post('/auth/passwordreset/reset', { resetCode, newPassword });
            // handle response
        } catch (error) {
            console.error(error);
        }
    }, []);

    const isAuthenticated = () => Boolean(token); // check if token exists to validate authentication status

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, register, passwordResetRequest, passwordReset, token }}>
            {children}
        </AuthContext.Provider>
    );
};