import React, { createContext, useState, useCallback } from "react";
import axios from "axios"
import { AuthContextType, Props } from "../interface";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState({name: "", email: ""});
    const api = axios.create({
        baseURL: 'http://127.0.0.1:5000'
      });

    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const {token} = response.data;
            setToken(token);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, []);

    const register = useCallback(async (email: string, password: string, name: string, role: string) => {
        try {
          const response = await api.post('/auth/register', { email, password, name, role });
          const {token} = response.data;
          console.log(response)
          setToken(token);
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout', { token });
            setToken(null);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, [token]);
    
    const passwordResetRequest = useCallback(async (email: string) => {
        try {
            await api.post('/auth/passwordreset/request', { email });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, []);
    
    const passwordReset = useCallback(async (resetCode: string, newPassword: string) => {
        try {
            await api.post('/auth/passwordreset/reset', { resetCode, newPassword });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, []);

    const isAuthenticated = () => Boolean(token);

    const fetchUser = useCallback(async () => {
        try {
          const response = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data); // assuming the response data is the user object
        } catch (error) {
          console.error(error);
        }
      }, [token]);

      const getAllReviews = useCallback(async (eateryId: string) => {
        try {
          const response = await api.post('/get_all_reviews', { eatery_id: eateryId });
          return response.data.reviews
        } catch (error) {
          console.error(error);
        }
      }, [token]);

    return (
        <AuthContext.Provider value={{ getAllReviews, user, fetchUser, isAuthenticated, login, logout, register, passwordResetRequest, passwordReset, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;