import { apiClient } from './client'

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface UserResponse {
  id: number
  username: string
  email: string
  full_name?: string | null
  is_active: boolean
}

export interface RegisterPayload {
  email: string
  username: string
  password: string
  full_name?: string | null
}

export interface RegisterResponse {
  id: number
  email: string
  username: string
  full_name?: string | null
  is_active: boolean
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  new_password: string
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  // FastAPI OAuth2PasswordBearer espera form-urlencoded
  const params = new URLSearchParams()
  params.append('username', payload.username)
  params.append('password', payload.password)
  params.append('grant_type', 'password')
  
  const USE_COOKIES = import.meta.env.VITE_USE_HTTPONLY_COOKIES === 'true'
  
  const { data } = await apiClient.post<LoginResponse>(
    '/api/auth/login',
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Se usar cookies, precisa enviar credentials
      withCredentials: USE_COOKIES,
    }
  )
  return data
}

// Endpoint para verificar usuário autenticado (útil quando usar cookies)
export const getCurrentUser = async (): Promise<UserResponse> => {
  const { data } = await apiClient.get<UserResponse>('/api/auth/me')
  return data
}

// Endpoint para cadastrar novo usuário
export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const { data } = await apiClient.post<RegisterResponse>('/api/auth/register', payload)
  return data
}

// Endpoint para alterar senha
export const changePassword = async (payload: ChangePasswordPayload): Promise<void> => {
  await apiClient.put('/api/auth/change-password', payload)
}

// Endpoint para solicitar reset de senha (esqueceu senha)
export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<void> => {
  await apiClient.post('/api/auth/forgot-password', payload)
}

// Endpoint para resetar senha com token
export const resetPassword = async (payload: ResetPasswordPayload): Promise<void> => {
  await apiClient.post('/api/auth/reset-password', payload)
}


