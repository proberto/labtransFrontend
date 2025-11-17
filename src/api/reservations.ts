import { apiClient } from './client'

export interface Reservation {
  id: number
  location: string
  room: string
  start_datetime: string
  end_datetime: string
  responsible: string
  coffee: boolean
  coffee_quantity?: number | null
  coffee_description?: string | null
}

export interface ReservationPayload {
  location: string
  room: string
  start_datetime: string
  end_datetime: string
  responsible: string
  coffee: boolean
  coffee_quantity?: number | null
  coffee_description?: string | null
}

export const listReservations = async (): Promise<Reservation[]> => {
  const { data } = await apiClient.get<Reservation[]>('/reservations')
  return data
}

export const createReservation = async (
  payload: ReservationPayload,
): Promise<Reservation> => {
  const { data } = await apiClient.post<Reservation>('/reservations', payload)
  return data
}

export const updateReservation = async (
  id: number,
  payload: ReservationPayload,
): Promise<Reservation> => {
  const { data } = await apiClient.put<Reservation>(
    `/reservations/${id}`,
    payload,
  )
  return data
}

export const deleteReservation = async (id: number): Promise<void> => {
  await apiClient.delete(`/reservations/${id}`)
}


