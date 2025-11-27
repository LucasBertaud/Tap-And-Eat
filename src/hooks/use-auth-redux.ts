import { supabase } from "@/src/lib/supabase";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchProfile,
  fetchSession,
  setSession,
} from "@/src/store/slices/authSlice";
import { useEffect } from "react";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { session, profile, isLoading, isLoggedIn, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(fetchSession());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", { event: _event, session });
      dispatch(setSession(session));

      if (session?.user?.id) {
        dispatch(fetchProfile(session.user.id));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(fetchProfile(session.user.id));
    }
  }, [session, dispatch]);

  return {
    session,
    profile,
    isLoading,
    isLoggedIn,
    error,
  };
}
