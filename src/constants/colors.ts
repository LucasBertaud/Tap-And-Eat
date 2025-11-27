/**
 * Couleurs de l'application Tap & Eat
 * Centralisées pour une maintenance facile et cohérence
 */

export const Colors = {
  // Couleurs primaires (orange)
  primary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C', // Principal
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Couleurs secondaires (gris)
  secondary: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280', // Principal secondaire
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Couleurs d'erreur (rouge)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626', // Principal erreur
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Couleurs de succès (vert)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A', // Principal succès
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Couleurs d'avertissement (jaune/orange)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706', // Principal avertissement
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Couleurs neutres
  background: '#FFFFFF',
  surface: '#F9FAFB', // secondary-50

  // Textes
  text: {
    primary: '#374151', // secondary-700
    secondary: '#6B7280', // secondary-500
    tertiary: '#9CA3AF', // secondary-400
    inverse: '#FFFFFF',
  },

  // Bordures
  border: {
    light: '#E5E7EB', // secondary-200
    default: '#D1D5DB', // secondary-300
    dark: '#9CA3AF', // secondary-400
  },
} as const

// Types pour TypeScript
export type ColorScheme = typeof Colors
export type PrimaryColors = typeof Colors.primary
export type SecondaryColors = typeof Colors.secondary
export type ErrorColors = typeof Colors.error
export type SuccessColors = typeof Colors.success
export type WarningColors = typeof Colors.warning
export type TextColors = typeof Colors.text
export type BorderColors = typeof Colors.border