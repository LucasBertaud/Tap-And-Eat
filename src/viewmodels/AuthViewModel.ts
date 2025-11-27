import type { LoginCredentials, SignUpCredentials } from "@/src/models/Auth";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  clearError,
  signIn,
  signOut as signOutAction,
  signUp,
} from "@/src/store/slices/authSlice";
import { useState } from "react";

export function useAuthViewModel() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const handleSignIn = async (credentials: LoginCredentials) => {
    const result = await dispatch(signIn(credentials));
    return {
      success: !result.type.endsWith("/rejected"),
      error: result.type.endsWith("/rejected")
        ? { message: result.payload as string }
        : undefined,
    };
  };

  const handleSignUp = async (credentials: SignUpCredentials) => {
    const result = await dispatch(signUp(credentials));
    if (result.type.endsWith("/rejected")) {
      return {
        success: false,
        error: { message: result.payload as string },
      };
    }
    return {
      success: true,
      requiresEmailConfirmation: (result.payload as any)
        .requiresEmailConfirmation,
    };
  };

  const handleSignOut = async () => {
    await dispatch(signOutAction());
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    dispatch(clearError());
  };

  return {
    isLoading,
    error: error ? { message: error } : null,
    isSignUpMode,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    toggleMode,
    clearError: () => dispatch(clearError()),
  };
}

export default useAuthViewModel;
