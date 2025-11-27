import { supabase } from "@/src/lib/supabase";
import type { LoginCredentials, SignUpCredentials } from "@/src/models/Auth";

class AuthService {
  async signIn({ email, password }: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async signUp({ email, password, options }: SignUpCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }

  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return session;
  }

  async getProfile(userId: string) {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!session?.user) {
      throw new Error("Utilisateur non connecté");
    }

    const { full_name, phone } = session.user.user_metadata || {};

    return {
      id: userId,
      full_name: full_name || null,
      phone: phone || null,
      email: session.user.email,
    };
  }
}

export default new AuthService();
