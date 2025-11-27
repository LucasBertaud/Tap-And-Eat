import { supabase } from '@/src/lib/supabase'
import type { LoginCredentials, SignUpCredentials } from '@/src/models/Auth'

/**
 * Auth Service
 * Gère les appels d'authentification avec Supabase
 */
class AuthService {
  /**
   * Connexion avec email et mot de passe
   */
  async signIn({ email, password }: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return data
  }

  /**
   * Inscription avec email et mot de passe
   */
  async signUp({ email, password }: SignUpCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return data
  }

  /**
   * Déconnexion
   */
  async signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  }

  /**
   * Récupère la session actuelle
   */
  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    return session
  }

  /**
   * Récupère le profil utilisateur
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw error
    }

    return data
  }
}

export default new AuthService()
