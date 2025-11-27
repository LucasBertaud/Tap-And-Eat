import { ThemedText } from '@/src/components/themed-text'
import { ThemedView } from '@/src/components/themed-view'
import { Colors } from '@/src/constants'
import { useAppSelector } from '@/src/store/hooks'
import { useHomeViewModel } from '@/src/viewmodels/HomeViewModel'
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'

/**
 * HomeView
 * Vue de la page d'accueil
 */
const HomeView = () => {
  const { profile, session } = useAppSelector((state) => state.auth)
  const viewModel = useHomeViewModel()

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Bienvenue ! 👋</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedView style={styles.infoContainer}>
          <ThemedText type="subtitle">Email</ThemedText>
          <ThemedText>{session?.user?.email || 'Non connecté'}</ThemedText>
        </ThemedView>

        {profile && (
          <>
            {profile.username && (
              <ThemedView style={styles.infoContainer}>
                <ThemedText type="subtitle">Nom d'utilisateur</ThemedText>
                <ThemedText>{profile.username}</ThemedText>
              </ThemedView>
            )}
            {profile.full_name && (
              <ThemedView style={styles.infoContainer}>
                <ThemedText type="subtitle">Nom complet</ThemedText>
                <ThemedText>{profile.full_name}</ThemedText>
              </ThemedView>
            )}
          </>
        )}
      </ThemedView>

      <TouchableOpacity
        style={[styles.signOutButton, viewModel.isLoading && styles.buttonDisabled]}
        onPress={viewModel.handleSignOut}
        disabled={viewModel.isLoading}
      >
        {viewModel.isLoading ? (
          <ActivityIndicator color={Colors.text.inverse} />
        ) : (
          <ThemedText style={styles.signOutText}>Se déconnecter</ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 20,
  },
  infoContainer: {
    gap: 8,
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  signOutButton: {
    backgroundColor: Colors.error[600],
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signOutText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
})

export default HomeView
