import { apiClient } from './client'

// Interface da API (campos retornados)
export interface Room {
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

// Interface para criar/atualizar (campos enviados)
export interface RoomPayload {
  name: string
  location_id: number
  description?: string | null
  capacity?: number | null
  is_active?: boolean
}

export const listRooms = async (): Promise<Room[]> => {
  const { data } = await apiClient.get<Room[]>('/api/rooms/')
  return data
}

export const createRoom = async (payload: RoomPayload): Promise<Room> => {
  const { data } = await apiClient.post<Room>('/api/rooms/', payload)
  return data
}

export const updateRoom = async (
  id: number,
  payload: Partial<RoomPayload>,
): Promise<Room> => {
  const { data } = await apiClient.put<Room>(`/api/rooms/${id}`, payload)
  return data
}

export const deleteRoom = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/rooms/${id}`)
}

