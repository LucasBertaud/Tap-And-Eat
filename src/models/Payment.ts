export interface CreditCardInfo {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderName: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  orderNumber?: string;
  errorMessage?: string;
  amount: number;
}

export interface PaymentState {
  isProcessing: boolean;
  lastResult: PaymentResult | null;
}

export function formatCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s+/g, '');
  const match = cleaned.match(/.{1,4}/g);
  return match ? match.join(' ') : cleaned;
}