import { apiClient } from './client'

// Interface da API (campos retornados)
export interface Reservation {
  id: number
  room_id: number
  data_inicio: string
  data_fim: string
  cafe: boolean
  quantidade_cafe?: number | null
  descricao_cafe?: string | null
  responsavel_id: number
  created_at: string
  updated_at?: string | null
  responsible: {
    id: number
    username: string
    email: string
    full_name?: string | null
    is_active: boolean
  }
  room?: {
    id: number
    name: string
    location_id: number
    description?: string | null
    capacity?: number | null
    is_active: boolean
    location?: {
      id: number
      name: string
      description?: string | null
      is_active: boolean
    }
  }
  // Campos legados para compatibilidade (se a API ainda retornar)
  local?: string
  sala?: string
}

// Interface para criar/atualizar (campos enviados)
export interface ReservationPayload {
  room_id: number
  data_inicio: string
  data_fim: string
  cafe: boolean
  quantidade_cafe?: number | null
  descricao_cafe?: string | null
}

// Interface para resposta paginada
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

// Parâmetros de paginação
export interface PaginationParams {
  page?: number
  size?: number
}

export const listReservations = async (
  params?: PaginationParams,
): Promise<PaginatedResponse<Reservation>> => {
  const queryParams = new URLSearchParams()
  // Sempre envia parâmetros de paginação (endpoint agora é paginado)
  queryParams.append('page', String(params?.page || 1))
  queryParams.append('size', String(params?.size || 10))

  const url = `/api/reservations/?${queryParams.toString()}`
  
  const { data } = await apiClient.get<PaginatedResponse<Reservation>>(url)
  return data
}

export const createReservation = async (
  payload: ReservationPayload,
): Promise<Reservation> => {
  const { data } = await apiClient.post<Reservation>('/api/reservations/', payload)
  return data
}

export const updateReservation = async (
  id: number,
  payload: Partial<ReservationPayload>,
): Promise<Reservation> => {
  const { data } = await apiClient.put<Reservation>(
    `/api/reservations/${id}`,
    payload,
  )
  return data
}

export const deleteReservation = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/reservations/${id}`)
}


