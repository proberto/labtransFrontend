import { useEffect, useState } from 'react'
import { deleteReservation, listReservations } from '../api/reservations'
import type { Reservation } from '../api/reservations'
import { ConfirmModal } from './ConfirmModal'

interface ReservationListProps {
  onEdit: (reservation: Reservation) => void
}

export const ReservationList = ({ onEdit }: ReservationListProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Reservation | null>(null)
  const [syncing, setSyncing] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listReservations()
      setReservations(data)
    } catch (err) {
      setError('Não foi possível carregar as reservas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  const handleDelete = async () => {
    if (!deleting) return
    try {
      setSyncing(true)
      await deleteReservation(deleting.id)
      setReservations((current) =>
        current.filter((reservation) => reservation.id !== deleting.id),
      )
    } catch (err) {
      setError('Erro ao excluir reserva.')
    } finally {
      setDeleting(null)
      setSyncing(false)
    }
  }

  const formatDateTime = (value: string) => {
    const date = new Date(value)
    return date.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  }

  return (
    <section className="table-card">
      <div className="table-header">
        <div>
          <h2>Reservas de salas</h2>
          <p className="table-helper">
            Visualize, edite ou cancele as reservas existentes.
          </p>
        </div>
        <button
          type="button"
          className="button secondary"
          onClick={() => void fetchData()}
          disabled={loading}
        >
          Atualizar
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <div className="empty-state">Carregando reservas...</div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          Nenhuma reserva cadastrada ainda. Crie a primeira ao lado.
        </div>
      ) : (
        <>
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Local / Sala</th>
                <th>Período</th>
                <th>Responsável</th>
                <th>Café</th>
                <th style={{ width: '120px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>
                    <div>{reservation.location}</div>
                    <div className="badge-muted">{reservation.room}</div>
                  </td>
                  <td>
                    <div>{formatDateTime(reservation.start_datetime)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      até {formatDateTime(reservation.end_datetime)}
                    </div>
                  </td>
                  <td>{reservation.responsible}</td>
                  <td>
                    {reservation.coffee ? (
                      <span className="tag success">Com café</span>
                    ) : (
                      <span className="tag muted">Sem café</span>
                    )}
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => onEdit(reservation)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="button danger"
                        onClick={() => setDeleting(reservation)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="status-bar">
            <span>
              <span className="pill-dot" />
              {reservations.length} reservas encontradas
            </span>
            <span className="pill">
              Operações são validadas no backend (conflitos de horário).
            </span>
          </div>
        </>
      )}

      {deleting && (
        <ConfirmModal
          title="Confirmar exclusão"
          description={
            <p>
              Tem certeza que deseja excluir a reserva da sala{' '}
              <strong>{deleting.room}</strong> em{' '}
              <strong>{deleting.location}</strong>? Esta ação não pode ser
              desfeita.
            </p>
          }
          confirmLabel={syncing ? 'Excluindo...' : 'Excluir'}
          variant="danger"
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  )
}


