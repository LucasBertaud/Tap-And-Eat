import { supabase } from '@/src/lib/supabase'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import { fetchProfile, fetchSession, setSession } from '@/src/store/slices/authSlice'
import { useEffect } from 'react'

/**
 * Hook pour gérer l'authentification avec Redux
 * Remplace l'ancien useAuth qui utilisait useState local
 */
export function useAuth() {
  const dispatch = useAppDispatch()
  const { session, profile, isLoading, isLoggedIn, error } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Récupérer la session initiale
    dispatch(fetchSession())

    // Écouter les changements d'authentification de Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', { event: _event, session })
      dispatch(setSession(session))
      
      // Récupérer le profil si connecté
      if (session?.user?.id) {
        dispatch(fetchProfile(session.user.id))
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  // Récupérer le profil quand la session change
  useEffect(() => {
    if (session?.user?.id) {
      dispatch(fetchProfile(session.user.id))
    }
  }, [session, dispatch])

  return {
    session,
    profile,
    isLoading,
    isLoggedIn,
    error,
  }
}
