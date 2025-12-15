import { ValidationResult } from '../validation';

export { ValidationResult };

export const validateCardNumber = (cardNumber: string): ValidationResult => {
  const cleaned = cardNumber.replace(/\s+/g, '');

  if (!cleaned) {
    return { isValid: false, errors: ['Le numéro de carte est requis'] };
  }

  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, errors: ['Le numéro de carte ne doit contenir que des chiffres'] };
  }

  if (cleaned.length !== 16) {
    return { isValid: false, errors: ['Le numéro de carte doit contenir exactement 16 chiffres'] };
  }

  return { isValid: true, errors: [] };
};

export const validateExpiryDate = (month: string, year: string): ValidationResult => {
  const errors: string[] = [];

  if (!month || !year) {
    errors.push('La date d\'expiration est requise');
    return { isValid: false, errors };
  }

  if (month.length < 1 || month.length > 2) {
    errors.push('Le mois doit être composé de 1 ou 2 chiffres (ex: 1, 01, 12)');
  }

  if (year.length !== 4) {
    errors.push('L\'année doit être composée de 4 chiffres (ex: 2025)');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);

  if (isNaN(expMonth) || expMonth < 1 || expMonth > 12) {
    errors.push('Le mois doit être entre 01 et 12');
  }

  if (isNaN(expYear)) {
    errors.push('L\'année doit être un nombre valide');
  } else if (expYear < currentYear) {
    errors.push('L\'année d\'expiration est invalide');
  } else if (expYear === currentYear && expMonth < currentMonth) {
    errors.push('La carte est expirée');
  } else if (expYear > currentYear + 20) {
    errors.push('L\'année d\'expiration semble trop éloignée');
  }

  return { isValid: errors.length === 0, errors };
};

export const validateCVV = (cvv: string): ValidationResult => {
  if (!cvv) {
    return { isValid: false, errors: ['Le CVV est requis'] };
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    return { isValid: false, errors: ['Le CVV doit contenir 3 ou 4 chiffres'] };
  }

  return { isValid: true, errors: [] };
};

export const validateCardHolderName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return { isValid: false, errors: ['Le nom du titulaire est requis'] };
  }

  if (name.trim().length < 2) {
    return { isValid: false, errors: ['Le nom du titulaire doit contenir au moins 2 caractères'] };
  }

  if (!/[a-zA-Z]/.test(name)) {
    return { isValid: false, errors: ['Le nom du titulaire doit contenir des lettres'] };
  }

  return { isValid: true, errors: [] };
};

export const validateCreditCardInfo = (cardInfo: {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderName: string;
}): ValidationResult => {
  const allErrors: string[] = [];

  const cardValidation = validateCardNumber(cardInfo.number);
  allErrors.push(...(cardValidation.errors || []));

  const expiryValidation = validateExpiryDate(cardInfo.expiryMonth, cardInfo.expiryYear);
  allErrors.push(...(expiryValidation.errors || []));

  const cvvValidation = validateCVV(cardInfo.cvv);
  allErrors.push(...(cvvValidation.errors || []));

  const nameValidation = validateCardHolderName(cardInfo.holderName);
  allErrors.push(...(nameValidation.errors || []));

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s+/g, '');
  const match = cleaned.match(/.{1,4}/g);
  return match ? match.join(' ') : cleaned;
};

export const getCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s+/g, '');

  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';

  return 'Unknown';
};