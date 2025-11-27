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
  async signUp({ email, password, options }: SignUpCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
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
   * Récupère le profil utilisateur depuis les métadonnées
   */
  async getProfile(userId: string) {
    // Récupérer la session pour accéder aux métadonnées utilisateur
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      throw sessionError
    }

    if (!session?.user) {
      throw new Error('Utilisateur non connecté')
    }

    // Les données sont stockées dans user_metadata
    const { full_name, phone } = session.user.user_metadata || {}

    return {
      id: userId,
      full_name: full_name || null,
      phone: phone || null,
      email: session.user.email,
    }
  }
}

export default new AuthService()
