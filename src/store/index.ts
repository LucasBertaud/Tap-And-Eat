import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import menuReducer from "./slices/menuSlice";

/**
 * Store Redux de l'application
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les actions et chemins qui contiennent des valeurs non-sérialisables
        ignoredActions: ["auth/fetchSession/fulfilled", "auth/setSession"],
        ignoredPaths: ["auth.session"],
      },
    }),
});

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
