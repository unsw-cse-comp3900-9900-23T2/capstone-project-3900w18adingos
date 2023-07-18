// VoucherContext.tsx
import React, { createContext, useState, useCallback } from "react";
import axios from "axios";
import { Voucher, VoucherContextProps, Props } from "../interface";

export const VoucherContext = createContext<VoucherContextProps | undefined>(undefined);

export const VoucherProvider: React.FC<Props> = ({ children }) => {
  const [cusomterVouchers, setCusomterVouchers] = useState<Array<Voucher>>([]);
  const [eateryVouchers, setEateryVouchers] = useState<Array<Voucher>>([]);

  const api = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    withCredentials: true
  });

  const fetchVouchers = useCallback(async (customerId: string) => {
    console.log(`Fetching vouchers for customer: ${customerId}`);
    try {
      const response = await api.get(`/get_vouchers_customer/${customerId}`);
      setCusomterVouchers(response.data.vouchers);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const claimVoucher = useCallback(async (voucherId: string, customerId: string) => {
    try {
      const response = await api.post(`/claim_voucher`, {
        voucher_id: voucherId,
        customer_id: customerId,
      });
      
      // Refresh vouchers after a successful claim
      fetchVouchers(customerId);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [fetchVouchers]);

  const fetchVouchersForEatery = useCallback(async (eateryId: string) => {
    try {
      const response = await api.get(`/get_vouchers_eatery/${eateryId}`);
      setEateryVouchers(response.data.vouchers);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <VoucherContext.Provider value={{ 
        cusomterVouchers, 
        fetchVouchers, 
        claimVoucher, 
        fetchVouchersForEatery,
        eateryVouchers
      }}>
      {children}
    </VoucherContext.Provider>
  );
};