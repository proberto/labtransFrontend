import { apiClient } from './client'

// Interface da API (campos retornados)
export interface Location {
  id: number
  name: string
  description?: string | null
  is_active: boolean
}

// Interface para criar/atualizar (campos enviados)
export interface LocationPayload {
  name: string
  description?: string | null
  is_active?: boolean
}

export const listLocations = async (): Promise<Location[]> => {
  const { data } = await apiClient.get<Location[]>('/api/locations/')
  return data
}

export const createLocation = async (
  payload: LocationPayload,
): Promise<Location> => {
  const { data } = await apiClient.post<Location>('/api/locations/', payload)
  return data
}

export const updateLocation = async (
  id: number,
  payload: Partial<LocationPayload>,
): Promise<Location> => {
  const { data } = await apiClient.put<Location>(
    `/api/locations/${id}`,
    payload,
  )
  return data
}

export const deleteLocation = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/locations/${id}`)
}

