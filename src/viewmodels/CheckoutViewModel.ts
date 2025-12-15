import { useAppSelector } from "@/src/store/hooks";
import {
  selectCartItemCount,
  selectCartItems,
  selectCartTotal,
} from "@/src/store/slices/cartSlice";
import { useCallback, useState } from "react";

export const useCheckoutViewModel = () => {
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);

  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleOpenScanner = useCallback(() => {
    setShowScanner(true);
  }, []);

  const handleCloseScanner = useCallback(() => {
    setShowScanner(false);
  }, []);

  const handleQRScanned = useCallback((data: string) => {
    const match = data.match(/\d+/);
    if (match) {
      setTableNumber(match[0]);
    } else {
      setTableNumber(data);
    }
    setShowScanner(false);
  }, []);

  const handleResetTable = useCallback(() => {
    setTableNumber(null);
  }, []);

  const canProceedToPayment = cartItems.length > 0 && tableNumber !== null;

  return {
    cartItems,
    totalPrice,
    itemCount,
    tableNumber,
    showScanner,
    canProceedToPayment,

    handleOpenScanner,
    handleCloseScanner,
    handleQRScanned,
    handleResetTable,
  };
};
