import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

// Se o backend usar HttpOnly Cookies, precisamos enviar cookies nas requisições
const USE_COOKIES = import.meta.env.VITE_USE_HTTPONLY_COOKIES === 'true'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Importante: comCredentials permite enviar cookies (HttpOnly) nas requisições
  withCredentials: USE_COOKIES,
})

export const setAuthToken = (token: string | null) => {
  // Se usar cookies, não precisa setar token no header (cookie é enviado automaticamente)
  if (!USE_COOKIES) {
    if (token) {
      apiClient.defaults.headers.Authorization = `Bearer ${token}`
    } else {
      delete apiClient.defaults.headers.Authorization
    }
  }
}


