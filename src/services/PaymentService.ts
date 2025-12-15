import type { CreditCardInfo, PaymentResult } from "@/src/models/Payment";
import {
  validateCreditCardInfo,
  ValidationResult,
} from "@/src/utils/payment/validation";

class PaymentService {
  async processPayment(
    cardInfo: CreditCardInfo,
    amount: number
  ): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isSuccess = Math.random() < 0.8;

    if (isSuccess) {
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const orderNumber = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      return {
        success: true,
        transactionId,
        orderNumber,
        amount,
      };
    } else {
      const errors = [
        "Carte expirée",
        "Fonds insuffisants",
        "Carte bloquée",
        "Erreur de communication avec la banque",
        "CVV incorrect",
      ];
      const randomError = errors[Math.floor(Math.random() * errors.length)];

      return {
        success: false,
        errorMessage: randomError,
        amount,
      };
    }
  }

  validateCardInfo(cardInfo: CreditCardInfo): ValidationResult {
    return validateCreditCardInfo(cardInfo);
  }
}

export const paymentService = new PaymentService();
