import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import { signOut } from '@/src/store/slices/authSlice'

/**
 * HomeViewModel
 * Gère la logique métier de la page d'accueil
 */
export function useHomeViewModel() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  /**
   * Déconnexion de l'utilisateur
   */
  const handleSignOut = async () => {
    await dispatch(signOut())
  }

  return {
    isLoading,
    error,
    handleSignOut,
  }
}

export default useHomeViewModel
