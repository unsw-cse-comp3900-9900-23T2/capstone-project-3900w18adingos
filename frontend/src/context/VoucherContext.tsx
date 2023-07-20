// VoucherContext.tsx
import React, { createContext, useState, useCallback } from "react";
import axios from "axios";
import { Voucher, VoucherContextProps, Props } from "../interface"; // Define these types according to your needs
import { useAuth } from "../hooks/useAuth";

export const VoucherContext = createContext<VoucherContextProps | undefined>(undefined);

export const VoucherProvider: React.FC<Props> = ({ children }) => {
  const [cusomterVouchers, setCusomterVouchers] = useState<Array<Voucher>>([]);
  const [eateryVouchers, setEateryVouchers] = useState<Array<Voucher>>([]);
  const { token } = useAuth();

  const api = axios.create({
    baseURL: 'http://127.0.0.1:5000'
  });

  const fetchVouchers = useCallback(async (customerId: string) => {
    try {
      const response = await api.get(`/get_vouchers_customer/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCusomterVouchers(response.data.vouchers);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const claimVoucher = useCallback(async (voucherId: string, customerId: string) => {
    try {
      const response = await api.post(`/claim_voucher`, {
        voucher_id: voucherId,
        customer_id: customerId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Refresh vouchers after a successful claim
      fetchVouchers(customerId);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [token, fetchVouchers]);

  const fetchVouchersForEatery = useCallback(async (eateryId: string) => {
    try {
      const response = await api.get(`/get_vouchers_eatery/${eateryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEateryVouchers(response.data.vouchers);
    } catch (error) {
      console.error(error);
    }
  }, [token]);


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
