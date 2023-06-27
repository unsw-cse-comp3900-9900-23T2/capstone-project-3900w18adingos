import { ReactNode } from "react";

export interface Eatery { 
    id: string,
    email: string,
    restaurant_name: string,
    location: string,
    cuisine: string,
    role: string,
    latitude: number,
    longitude: number,
}

export interface EateryContextProps {
    token: string | null;
    fetchEateries: () => Promise<void>;
    fetchEateryImages: (eateryId: string) => Promise<void>;
    eateries: Array<Eatery>; // Define a proper interface for eateries
    eateryImages: Array<any>; // Define a proper interface for eatery images
}

interface User {
    name: string;
    email: string;
}

export interface AuthContextType {
    token: string | null;
    isAuthenticated: () => boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, name: string, role: string) => Promise<boolean>;
    passwordResetRequest: (email: string) => Promise<boolean>;
    passwordReset: (resetCode: string, newPassword: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    fetchUser: () => Promise<void>;
    user: User;
}

export interface Props {
    children?: ReactNode;
}

export interface MapProps {
    findLocation: Eatery | null;
}

export interface SearchBarProps {
    location: Eatery | null;
    onSearch: (place: Eatery) => void;
}

export interface RegisterFormInputs {
    name: string;
    email: string;
    password: string;
    role: string;
    address: string;
}

export interface SignInFormInputs {
    email: string;
    password: string;
}