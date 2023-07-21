import { ReactNode } from "react";

interface Cuisine {
    cuisine_name: string;
  }
  
  interface CooksCuisine {
    cuisine: Cuisine;
    cuisine_id: number;
    eatery_id: number;
    id: number;
  }

export interface Eatery {
    id: string,
    email: string,
    restaurant_name: string,
    location: string,
    cuisines: CooksCuisine[],
    role: string,
    latitude: number,
    longitude: number,
    reviews: Review[],
    opening_hours: string,
    eatery_image: Array<string>
}
export interface Images {
    images: Array<any>;
    image_ids: Array<any>;
}
export interface Review {
    rating: number;
    review_text: string;
    id: string;
    customer_id: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    profile_pic: string;
    role: string;
}

export interface Voucher {
    id: string;
    description: string;
    eatery_id: string;
    quantity: number;
    start: Date;
    expiry: Date;
}

// CONTEXT

export interface EateryContextProps {
    token: string | null;
    fetchEateries: () => Promise<void>;
    fetchEateryImages: (eateryId: string) => Promise<void>;
    getReview: (eateryId: string) => Promise<Review | void>;
    getAllReviews: (eateryId: string) => Promise<Array<Review> | void>;
    addReview: (eateryId: string, rating: string, reviewText: string) => Promise<boolean | void>;
    deleteReview: (reviewId: string) => Promise<boolean | void>;
    fetchEatery: (id: string) => Promise<Eatery | null>;
    eatery: Eatery | null;
    eateries: Array<Eatery>;
    eateryImages: Images | null;
    review: Review | null;
    allReviews: Array<Review>;
    addImage: (imageFile: File) => Promise<boolean>;
    deleteImage: (imageId: string) => Promise<boolean>;
    getEateryImage: (imageId: string) => Promise<string | undefined>;
}
export interface AuthContextType {
    token: string | null;
    getAllReviews: (eateryId: string) => Promise<Array<Review> | void>;
    isAuthenticated: () => boolean;
    login: (email: string, password: string, role: string) => Promise<boolean>;
    googleLogin: (code: string) => Promise<boolean>;
    register: (email: string, password: string, name: string, role: string) => Promise<boolean>;
    passwordResetRequest: (email: string, role:string) => Promise<boolean>;
    passwordReset: (resetCode: any, newPassword: any) => Promise<boolean>;
    logout: () => Promise<boolean>;
    fetchUser: () => Promise<void>;
    user: User | null;
    getUserById:(id: string) => Promise<User |void>;
    updateProfile: (name: string, email: string) => Promise<User>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
export interface VoucherContextProps {
  cusomterVouchers: Array<Voucher>;
  eateryVouchers: Array<Voucher>;
  fetchVouchers: (customerId: string) => Promise<void>;
  claimVoucher: (voucherId: string, customerId: string) => Promise<any>
  fetchVouchersForEatery: (eateryId: string) => Promise<void>
  fetchQRCode: () => Promise<string>;  // New addition
}



export interface Props {
    children?: ReactNode;
}

export interface RegisterFormInputs {
    name: string;
    email: string;
    password: string;
    role: string;
    address: string;
}

export interface ResetPassword {
    newPassword: string;
    resetCode: string;
}


export interface SignInFormInputs {
    email: string;
    password: string;
    role: 'customer' | 'eatery';
}

export interface Review {
    rating: number,
    review_text: string,
    id: string,
}

// utils/location
export type SetUserLocation = React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
export interface UserPosition {
    lat: number;
    lng: number;
}

// Map 
export type MapRef = React.MutableRefObject<google.maps.Map | null>;
export type SetLoadingPosition = React.Dispatch<React.SetStateAction<boolean>>;
export type SetUpLocation = (setUserLocation: SetUserLocation, setLoadingPosition: SetLoadingPosition, mapRef: MapRef) => void;
export interface ClusterProps {
    count: number;
    position: google.maps.LatLng | google.maps.LatLngLiteral;
  }
  export interface MapProps {
    findLocation: Eatery | null;
}