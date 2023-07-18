import React, { createContext, useState, useCallback } from "react";
import axios from "axios"
import { AuthContextType, Props, User } from "../interface";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<Props> = ({ children }) => {

    const checkToken = localStorage.getItem('token')
    const [token, setToken] = useState<string | null>(checkToken ? checkToken : null);
    const [user, setUser] = useState<User | null>(null);
    const api = axios.create({
        baseURL: 'http://127.0.0.1:5000',
        withCredentials: true
    });

    const login = useCallback(async (email: string, password: string, role: string) => {
        try {
            const response = await api.post('/auth/login', { email, password, role });
            setUser(response.data);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, []);

    const googleLogin = useCallback(async (code: string) => {
      try {
        const response = await api.post('/auth/validate-google-token', { code });
        setUser(response.data.user);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }, []);


const register = useCallback(async (email: string, password: string, name: string, role: string) => {
    try {
      const response = await api.post('/auth/register', { email, password, name, role });
      setUser(response.data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);

const logout = useCallback(async () => {
    try {
      await api.get('/auth/logout');
      setUser(null);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);
  const passwordResetRequest = useCallback(async (email: string, role: string) => {
      try {
        await api.post('/auth/passwordreset/request', { email, role });  // include role here
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
  }, []);


  const updateProfile = useCallback(async (name: string, email: string) => {
    try {
      const response = await api.post('/customer/edit-profile', { email, name });
      return response.data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);



  const passwordReset = useCallback(async (resetCode: any, newPassword: any) => {
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
            const response = await api.get('/auth/whoami');
            setUser(response.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

  const getAllReviews = useCallback(async (eateryId: string) => {
    try {
      const response = await api.post('/get_all_reviews', { eatery_id: eateryId });
      return response.data.reviews
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const getUserById = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/user/${id}`)
      return response.data
    } catch (error) {
      console.error(error);
    }
  }, [token]);

    return (
        <AuthContext.Provider 
          value={{
            updateProfile, 
            googleLogin, 
            getUserById, 
            getAllReviews, 
            fetchUser, 
            isAuthenticated,
            login, 
            logout, 
            register, 
            passwordResetRequest, 
            passwordReset, 
            setUser,
            user, 
            token 
          }}>
            {children}
        </AuthContext.Provider>
    );
  };


export default AuthProvider;