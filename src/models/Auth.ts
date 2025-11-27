/**
 * Auth Models
 * Interfaces TypeScript pour typer les données d'authentification
 */

export interface AuthUser {
  id: string
  email: string
  username?: string
  full_name?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
}

export interface AuthError {
  message: string
  code?: string
}
