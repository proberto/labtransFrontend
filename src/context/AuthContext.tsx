import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { login as loginApi, getCurrentUser } from '../api/auth'
import type { LoginPayload, LoginResponse } from '../api/auth'
import { setAuthToken, apiClient } from '../api/client'

interface AuthContextValue {
  user: string | null
  token: string | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'labtrans_auth'
const USE_COOKIES = import.meta.env.VITE_USE_HTTPONLY_COOKIES === 'true'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Verifica autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      if (USE_COOKIES) {
        // Com cookies: verifica autenticação chamando /api/auth/me
        try {
          const currentUser = await getCurrentUser()
          setUser(currentUser.full_name || currentUser.username || currentUser.email)
          setToken('cookie') // Placeholder para indicar que está autenticado via cookie
        } catch {
          // Não autenticado
          setUser(null)
          setToken(null)
        }
      } else {
        // Sem cookies: usa localStorage
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as { user: string; token: string }
            setUser(parsed.user)
            setToken(parsed.token)
            setAuthToken(parsed.token)
          } catch {
            // Dados inválidos
            window.localStorage.removeItem(STORAGE_KEY)
          }
        }
      }
      setLoading(false)
    }
    void checkAuth()
  }, [])

  const persistAuth = (username: string, auth: LoginResponse) => {
    // Só persiste no localStorage se não usar cookies
    if (!USE_COOKIES) {
      const payload = { user: username, token: auth.access_token }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    }
  }

  const handleLogin = useCallback(async (payload: LoginPayload) => {
    const response = await loginApi(payload)
    
    if (USE_COOKIES) {
      // Com cookies: busca dados do usuário após login
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser.full_name || currentUser.username || currentUser.email)
        setToken('cookie')
      } catch {
        setUser(payload.username)
        setToken('cookie')
      }
    } else {
      // Sem cookies: armazena token
      setUser(payload.username)
      setToken(response.access_token)
      setAuthToken(response.access_token)
      persistAuth(payload.username, response)
    }
  }, [])

  const handleLogout = useCallback(async () => {
    if (USE_COOKIES) {
      // Com cookies: chama endpoint de logout do backend (se existir)
      // O backend deve limpar o cookie HttpOnly
      try {
        await apiClient.post('/api/auth/logout', {}, { withCredentials: true })
      } catch {
        // Se endpoint não existir, apenas limpa estado local
        // O cookie expirará naturalmente
      }
    } else {
      // Sem cookies: limpa localStorage
      setAuthToken(null)
      window.localStorage.removeItem(STORAGE_KEY)
    }
    
    setUser(null)
    setToken(null)
  }, [])

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login: handleLogin,
    logout: handleLogout,
  }

  // Evita flash de conteúdo não autenticado durante verificação inicial
  if (loading) {
    return null // ou um componente de loading
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


