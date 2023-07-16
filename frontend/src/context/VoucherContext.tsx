// VoucherContext.tsx
import React, { createContext, useState, useCallback } from "react";
import axios from "axios";
import { Voucher, VoucherContextProps, Props } from "../interface"; // Define these types according to your needs
import { useAuth } from "../hooks/useAuth";

export const VoucherContext = createContext<VoucherContextProps | undefined>(undefined);

export const VoucherProvider: React.FC<Props> = ({ children }) => {
  const [vouchers, setVouchers] = useState<Array<Voucher>>([]);
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
      setVouchers(response.data.vouchers);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  return (
    <VoucherContext.Provider value={{ vouchers, fetchVouchers }}>
      {children}
    </VoucherContext.Provider>
  );
};
