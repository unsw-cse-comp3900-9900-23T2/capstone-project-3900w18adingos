// EateryContext.tsx

import axios from "axios";
import React, { createContext, useState, useCallback} from "react";
import { useAuth } from "../useAuth";
import { EateryContextProps, Props } from "../interface";

export const EateryContext = createContext<EateryContextProps | undefined>(undefined);

export const EateryProvider: React.FC<Props> = ({ children }) => {
    const [eateries, setEateries] = useState([]);
    const [eateryImages, setEateryImages] = useState([]);
    const { token } = useAuth();

    const api = axios.create({
        baseURL: 'http://127.0.0.1:5000'
      });

    const fetchEateries = useCallback(async () => {
        try {
          const response = await api.get('/eatery', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setEateries(response.data.eateries); // assuming the response data is an array of eateries
        } catch (error) {
          console.error(error);
        }
    }, [token]);

    const fetchEateryImages = useCallback(async (eateryId: string) => {
        try {
          const response = await api.post('/eatery/get_images', { eatery_id: eateryId }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setEateryImages(response.data.images); // assuming the response data is an array of images
        } catch (error) {
          console.error(error);
        }
    }, [token]);

  
    return (
      <EateryContext.Provider value={{ fetchEateryImages, fetchEateries, eateries, eateryImages, token }}>
        {children}
      </EateryContext.Provider>
    );
  };
  