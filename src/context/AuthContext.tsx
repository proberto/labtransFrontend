import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { login as loginApi } from '../api/auth'
import type { LoginPayload, LoginResponse } from '../api/auth'
import { setAuthToken } from '../api/client'

interface AuthContextValue {
  user: string | null
  token: string | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'labtrans_auth'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { user: string; token: string }
      setUser(parsed.user)
      setToken(parsed.token)
      setAuthToken(parsed.token)
    }
  }, [])

  const persistAuth = (username: string, auth: LoginResponse) => {
    const payload = { user: username, token: auth.access_token }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }

  const handleLogin = useCallback(async (payload: LoginPayload) => {
    const response = await loginApi(payload)
    setUser(payload.username)
    setToken(response.access_token)
    setAuthToken(response.access_token)
    persistAuth(payload.username, response)
  }, [])

  const handleLogout = useCallback(() => {
    setUser(null)
    setToken(null)
    setAuthToken(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login: handleLogin,
    logout: handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}


