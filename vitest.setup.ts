// vitest.setup.ts
// Configuration Vitest

import { vi } from "vitest";

// Mock Expo modules
vi.mock("expo-font", () => ({
  loadAsync: vi.fn(),
  isLoaded: vi.fn(() => true),
}));

vi.mock("expo-asset", () => ({
  Asset: {
    loadAsync: vi.fn(),
  },
}));

vi.mock("expo-router", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  })),
  useSegments: vi.fn(() => []),
  usePathname: vi.fn(() => "/"),
  Link: "Link",
  Stack: "Stack",
  Tabs: "Tabs",
}));

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    getAllKeys: vi.fn(),
    multiGet: vi.fn(),
    multiSet: vi.fn(),
    multiRemove: vi.fn(),
  },
}));

// Mock Supabase
vi.mock("@/src/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
};
