import type { LoginCredentials, SignUpCredentials } from '@/src/models/Auth'
import AuthService from '@/src/services/AuthService'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Session } from '@supabase/supabase-js'

interface AuthState {
  session: Session | null
  profile: any | null
  isLoading: boolean
  isLoggedIn: boolean
  error: string | null
}

const initialState: AuthState = {
  session: null,
  profile: null,
  isLoading: true,
  isLoggedIn: false,
  error: null,
}

/**
 * Thunk pour récupérer la session initiale
 */
export const fetchSession = createAsyncThunk(
  'auth/fetchSession',
  async () => {
    const session = await AuthService.getSession()
    return session
  }
)

/**
 * Thunk pour récupérer le profil utilisateur
 */
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (userId: string) => {
    const profile = await AuthService.getProfile(userId)
    return profile
  }
)

/**
 * Thunk pour la connexion
 */
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await AuthService.signIn(credentials)
      return data.session
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erreur de connexion')
    }
  }
)

/**
 * Thunk pour l'inscription
 */
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (credentials: SignUpCredentials, { rejectWithValue }) => {
    try {
      const data = await AuthService.signUp(credentials)
      return { session: data.session, requiresEmailConfirmation: !data.session }
    } catch (error: any) {
      return rejectWithValue(error.message || "Erreur d'inscription")
    }
  }
)

/**
 * Thunk pour la déconnexion
 */
export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.signOut()
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erreur de déconnexion')
    }
  }
)

/**
 * Slice Redux pour l'authentification
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload
      state.isLoggedIn = action.payload !== null
      // Réinitialiser le profil si déconnexion
      if (action.payload === null) {
        state.profile = null
      }
    },
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    resetAuth: (state) => {
      state.session = null
      state.profile = null
      state.isLoggedIn = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch session
    builder
      .addCase(fetchSession.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.session = action.payload
        state.isLoggedIn = action.payload !== null
        state.isLoading = false
      })
      .addCase(fetchSession.rejected, (state) => {
        state.isLoading = false
      })

    // Fetch profile
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload
      })

    // Sign in
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.session = action.payload
        state.isLoggedIn = true
        state.isLoading = false
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.payload as string
        state.isLoading = false
      })

    // Sign up
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        if (action.payload.session) {
          state.session = action.payload.session
          state.isLoggedIn = true
        }
        state.isLoading = false
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload as string
        state.isLoading = false
      })

    // Sign out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signOut.fulfilled, (state) => {
        state.session = null
        state.profile = null
        state.isLoggedIn = false
        state.isLoading = false
      })
      .addCase(signOut.rejected, (state, action) => {
        state.error = action.payload as string
        state.isLoading = false
      })
  },
})

export const { setSession, setProfile, clearError, resetAuth } = authSlice.actions
export default authSlice.reducer
