import type { CreditCardInfo, PaymentResult } from "@/src/models/Payment";
import { paymentService } from "@/src/services";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { clearCart, selectCartTotal } from "@/src/store/slices/cartSlice";
import { useCallback, useState } from "react";

export const usePaymentViewModel = () => {
  const dispatch = useAppDispatch();
  const totalAmount = useAppSelector(selectCartTotal);

  const [cardInfo, setCardInfo] = useState<CreditCardInfo>({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<PaymentResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const updateCardInfo = useCallback((field: keyof CreditCardInfo, value: string) => {
    setCardInfo(prev => ({ ...prev, [field]: value }));

    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [validationErrors.length]);

  const validateForm = useCallback((): boolean => {
    const validation = paymentService.validateCardInfo(cardInfo);
    const errors = validation.errors || [];
    setValidationErrors(errors);
    return validation.isValid;
  }, [cardInfo]);

  const handlePayment = useCallback(async (): Promise<PaymentResult> => {
    const isValid = validateForm();

    if (!isValid) {
      return {
        success: false,
        errorMessage: 'Veuillez corriger les erreurs du formulaire',
        amount: totalAmount,
      };
    }

    setIsProcessing(true);
    setLastResult(null);

    try {
      const result = await paymentService.processPayment(cardInfo, totalAmount);
      setLastResult(result);

      if (result.success) {
        dispatch(clearCart());
      }

      return result;
    } catch (error) {
      const errorResult: PaymentResult = {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
        amount: totalAmount,
      };
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  }, [cardInfo, totalAmount, validateForm, dispatch]);

  const resetPayment = useCallback(() => {
    setCardInfo({
      number: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      holderName: '',
    });
    setIsProcessing(false);
    setLastResult(null);
    setValidationErrors([]);
  }, []);

  return {
    cardInfo,
    totalAmount,
    isProcessing,
    lastResult,
    validationErrors,

    updateCardInfo,
    handlePayment,
    resetPayment,
    validateForm,
  };
};