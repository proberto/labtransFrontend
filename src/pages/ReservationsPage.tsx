import { useState } from 'react'
import { createReservation, updateReservation } from '../api/reservations'
import type { ReservationPayload, Reservation } from '../api/reservations'
import { useAuth } from '../context/AuthContext'
import { ReservationForm } from '../components/ReservationForm'
import { ReservationList } from '../components/ReservationList'

export const ReservationsPage = () => {
  const { user, logout } = useAuth()
  const [editing, setEditing] = useState<Reservation | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (payload: ReservationPayload) => {
    try {
      setSubmitting(true)
      if (editing) {
        await updateReservation(editing.id, payload)
      } else {
        await createReservation(payload)
      }
      setEditing(null)
    } catch (err: any) {
      if (err?.response?.status === 409) {
        alert('Conflito de horário detectado. Já existe uma reserva nesse período para esta sala.')
      } else {
        alert('Ocorreu um erro ao salvar a reserva.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const initials = user
    ? user
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    : '?'

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title">
          <h1>Reservas de salas</h1>
          <span>Gerencie as reservas de reuniões da organização.</span>
        </div>
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <span>{user}</span>
          <button type="button" className="button secondary" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <main className="page-layout">
        <ReservationList onEdit={setEditing} />
        <ReservationForm
          initial={editing}
          onSubmit={handleSubmit as any}
          submitting={submitting}
        />
      </main>
    </div>
  )
}


