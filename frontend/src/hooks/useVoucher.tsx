import { useContext } from 'react';
import { VoucherContext } from '../context/VoucherContext';

export const useVoucher = () => {
    const context = useContext(VoucherContext);
    if (!context) {
      throw new Error('useEateryContext must be used within a RestaurantProvider');
    }
    return context;
  };