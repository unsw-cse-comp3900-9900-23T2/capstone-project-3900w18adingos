// EateryContext.tsx

import axios from "axios";
import React, { createContext, useState, useCallback} from "react";

import { Eatery, EateryContextProps, Images, Props, Review } from "../interface";
import { useAuth } from "../hooks/useAuth";

export const EateryContext = createContext<EateryContextProps | undefined>(undefined);

export const EateryProvider: React.FC<Props> = ({ children }) => {
    const [eateries, setEateries] = useState<Array<Eatery>>([]);
    const [eatery, setEatery] = useState<Eatery | null>(null);
    const [review, setReview] = useState<Review | null>(null);
    const [allReviews, setallReviews] = useState<Array<Review>>([]);
    const [eateryImages, setEateryImages] = useState<Images | null>(null);
    const { token } = useAuth()

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
          setEateries(response.data); 
        } catch (error) {
          console.error(error);
        }
    }, [token]);

    const fetchEatery = useCallback(async (id: string) => {
      try {
        const response = await api.get(`/eatery/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEatery(response.data)
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
          setEateryImages(response.data.images);
        } catch (error) {
          console.error(error);
        }
    }, [token]);

  
    const getReview = useCallback(async (eateryId: string) => {
      try {
        const response = await api.post('/get_review', { eatery_id: eateryId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReview(response.data)
        return response.data
      } catch (error) {
        console.error(error);
      }
    }, [token]);
  
    const getAllReviews = useCallback(async (eateryId: string) => {
      try {
        const response = await api.post('/get_all_reviews', { eatery_id: eateryId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setallReviews(response.data.reviews)
        return response.data.reviews
      } catch (error) {
        console.error(error);
      }
    }, [token]);
  
    const addReview = useCallback(async (eateryId: string, rating: string, reviewText: string) => {
      try {
        const response = await api.post('/add_review', { 
          eatery_id: eateryId,
          rating,
          review_text: reviewText 
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.success; // return the success status
      } catch (error) {
        console.error(error);
      }
    }, [token]);
  
    const deleteReview = useCallback(async (reviewId: string) => {
      try {
        const response = await api.delete(`/delete_review/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.success; // return the success status
      } catch (error) {
        console.error(error);
      }
    }, [token]);
  
    return (
      <EateryContext.Provider value={{
        fetchEateryImages, 
        fetchEateries, 
        eateries, 
        fetchEatery,
        eatery,
        eateryImages, 
        token,
        review, 
        allReviews,
        getReview,
        getAllReviews,
        addReview,
        deleteReview,
      }}>
        {children}
      </EateryContext.Provider>
    );
  };