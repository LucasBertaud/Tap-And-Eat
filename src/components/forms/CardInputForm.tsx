import {
  formatCardNumber,
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
} from "@/src/utils/payment/validation";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { InputForm } from "./InputForm";

interface CardInputFormProps {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderName: string;
  onCardNumberChange: (value: string) => void;
  onExpiryMonthChange: (value: string) => void;
  onExpiryYearChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  onHolderNameChange: (value: string) => void;
  validationErrors: string[];
}

export const CardInputForm = ({
  cardNumber,
  expiryMonth,
  expiryYear,
  cvv,
  holderName,
  onCardNumberChange,
  onExpiryMonthChange,
  onExpiryYearChange,
  onCvvChange,
  onHolderNameChange,
  validationErrors,
}: CardInputFormProps) => {
  const [cardNumberError, setCardNumberError] = useState<string>("");
  const [expiryMonthError, setExpiryMonthError] = useState<string>("");
  const [expiryYearError, setExpiryYearError] = useState<string>("");
  const [cvvError, setCvvError] = useState<string>("");

  // Validation en temps réel du numéro de carte
  useEffect(() => {
    if (cardNumber.length > 0) {
      const cleaned = cardNumber.replace(/\s+/g, "");
      if (cleaned.length > 0 && !/^\d+$/.test(cleaned)) {
        setCardNumberError(
          "Le numéro de carte ne doit contenir que des chiffres"
        );
      } else if (cleaned.length >= 13) {
        const validation = validateCardNumber(cleaned);
        if (!validation.isValid) {
          setCardNumberError(
            validation.errors?.[0] || "Numéro de carte invalide"
          );
        } else {
          setCardNumberError("");
        }
      } else {
        setCardNumberError("");
      }
    } else {
      setCardNumberError("");
    }
  }, [cardNumber]);

  useEffect(() => {
    if (expiryMonth && expiryYear) {
      const validation = validateExpiryDate(expiryMonth, expiryYear);
      if (!validation.isValid) {
        const errors = validation.errors || [];
        const monthErrors = errors.filter(
          (error) =>
            error.toLowerCase().includes("mois") ||
            error.toLowerCase().includes("date d'expiration est requise") ||
            error.toLowerCase().includes("entre 01 et 12")
        );
        const yearErrors = errors.filter(
          (error) =>
            error.toLowerCase().includes("année") ||
            error.toLowerCase().includes("date d'expiration est requise") ||
            !monthErrors.includes(error)
        );

        setExpiryMonthError(monthErrors.length > 0 ? monthErrors[0] : "");
        setExpiryYearError(yearErrors.length > 0 ? yearErrors[0] : "");
      } else {
        setExpiryMonthError("");
        setExpiryYearError("");
      }
    } else {
      setExpiryMonthError("");
      setExpiryYearError("");
    }
  }, [expiryMonth, expiryYear]);

  useEffect(() => {
    if (cvv.length > 0) {
      const validation = validateCVV(cvv);
      if (!validation.isValid) {
        setCvvError(validation.errors?.[0] || "CVV invalide");
      } else {
        setCvvError("");
      }
    } else {
      setCvvError("");
    }
  }, [cvv]);

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    onCardNumberChange(formatted);
  };

  const handleExpiryMonthChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 2);
    onExpiryMonthChange(cleaned);
  };

  const handleExpiryYearChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    onExpiryYearChange(cleaned);
  };

  const handleCvvChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    onCvvChange(cleaned);
  };

  return (
    <View>
      <InputForm
        label="Numéro de carte"
        value={cardNumber}
        onChangeText={handleCardNumberChange}
        placeholder="1234 5678 9012 3456"
        keyboardType="numeric"
        maxLength={19}
        error={cardNumberError}
        required
      />

      <InputForm
        label="Nom du titulaire"
        value={holderName}
        onChangeText={onHolderNameChange}
        placeholder="JOHN DOE"
        autoCapitalize="characters"
        required
      />

      <View className="flex-row gap-4">
        <View className="flex-1">
          <InputForm
            label="Mois"
            value={expiryMonth}
            onChangeText={handleExpiryMonthChange}
            placeholder="MM"
            keyboardType="numeric"
            maxLength={2}
            error={expiryMonthError}
            required
          />
        </View>
        <View className="flex-1">
          <InputForm
            label="Année"
            value={expiryYear}
            onChangeText={handleExpiryYearChange}
            placeholder="YYYY"
            keyboardType="numeric"
            maxLength={4}
            error={expiryYearError}
            required
          />
        </View>
        <View className="flex-1">
          <InputForm
            label="CVV"
            value={cvv}
            onChangeText={handleCvvChange}
            placeholder="123"
            keyboardType="numeric"
            maxLength={4}
            error={cvvError}
            required
          />
        </View>
      </View>

      {validationErrors.length > 0 && (
        <View className="mb-6 rounded-lg border border-error-200 bg-error-50 p-4">
          {validationErrors.map((error, index) => (
            <Text key={index} className="mb-1 text-base text-error-600">
              • {error}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};
