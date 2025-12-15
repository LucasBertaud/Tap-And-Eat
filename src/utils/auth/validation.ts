import { ValidationResult } from '../validation';

export { ValidationResult };

export const validateEmail = (email: string): ValidationResult => {
  const rules = [
    { test: () => !!email, error: "L'email est requis" },
    {
      test: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      error: "Email invalide",
    },
  ];

  for (const rule of rules) {
    if (!rule.test()) {
      return { isValid: false, error: rule.error };
    }
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  const rules = [
    { test: () => !!password, error: "Le mot de passe est requis" },
    {
      test: () => password.length >= 10,
      error: "Le mot de passe doit contenir au moins 10 caractères",
    },
    {
      test: () => /[A-Z]/.test(password),
      error: "Le mot de passe doit contenir au moins une majuscule",
    },
    {
      test: () => /[a-z]/.test(password),
      error: "Le mot de passe doit contenir au moins une minuscule",
    },
    {
      test: () => /[0-9]/.test(password),
      error: "Le mot de passe doit contenir au moins un chiffre",
    },
    {
      test: () => /[!@#$%^&*(),.?":{}|<>]/.test(password),
      error: "Le mot de passe doit contenir au moins un symbole (!@#$%^&*...)",
    },
  ];

  for (const rule of rules) {
    if (!rule.test()) {
      return { isValid: false, error: rule.error };
    }
  }

  return { isValid: true };
};

export const validateFullName = (name: string): ValidationResult => {
  const rules = [
    { test: () => !!name, error: "Le nom est requis" },
    {
      test: () => name.length >= 2,
      error: "Le nom doit contenir au moins 2 caractères",
    },
  ];

  for (const rule of rules) {
    if (!rule.test()) {
      return { isValid: false, error: rule.error };
    }
  }

  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  const rules = [
    { test: () => !!phone, error: "Le numéro de téléphone est requis" },
    {
      test: () => /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(phone),
      error: "Numéro de téléphone invalide",
    },
  ];

  for (const rule of rules) {
    if (!rule.test()) {
      return { isValid: false, error: rule.error };
    }
  }

  return { isValid: true };
};