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
    baseURL: 'http://127.0.0.1:5000',
    withCredentials: true
  });

  const fetchEateries = useCallback(async () => {
    try {
      const response = await api.get('/eatery');
      setEateries(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchEatery = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/eatery/${id}`);
      setEatery(response.data)
      return response.data
    } catch (error) {
      console.error(error);
      return null
    }
  }, []);

  const fetchEateryImages = useCallback(async (eateryId: string) => {
    try {
      const response = await api.post('/get_images', { eatery_id: eateryId });
      setEateryImages(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getReview = useCallback(async (eateryId: string) => {
    try {
      const response = await api.post('/get_review', { eatery_id: eateryId });
      setReview(response.data)
      return response.data
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getAllReviews = useCallback(async (eateryId: string) => {
    try {
      const response = await api.post('/get_all_reviews', { eatery_id: eateryId });
      setallReviews(response.data.reviews)
      return response.data.reviews
    } catch (error) {
      console.error(error);
    }
  }, []);

  const addReview = useCallback(async (eateryId: string, rating: string, reviewText: string) => {
    try {
      const response = await api.post('/add_review', {
        eatery_id: eateryId,
        rating,
        review_text: reviewText
      });
      return response.data; // return the success status
    } catch (error) {
      console.error(error);
    }
  }, []);

  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      const response = await api.delete(`/delete_review/${reviewId}`);
      return response.data.success; // return the success status
    } catch (error) {
      console.error(error + " ASSS");
    }
  }, []);
    
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