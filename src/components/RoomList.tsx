import { useEffect, useState } from 'react'
import { deleteRoom, listRooms } from '../api/rooms'
import type { Room } from '../api/rooms'
import { ConfirmModal } from './ConfirmModal'

interface RoomListProps {
  onEdit: (room: Room) => void
  refreshTrigger?: number
}

export const RoomList = ({ onEdit, refreshTrigger }: RoomListProps) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Room | null>(null)
  const [syncing, setSyncing] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listRooms()
      setRooms(data)
    } catch (err) {
      setError('Não foi possível carregar as salas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      void fetchData()
    }
  }, [refreshTrigger])

  const handleDelete = async () => {
    if (!deleting) return
    try {
      setSyncing(true)
      await deleteRoom(deleting.id)
      await fetchData()
    } catch (err) {
      setError('Erro ao excluir sala.')
    } finally {
      setDeleting(null)
      setSyncing(false)
    }
  }

  return (
    <section className="table-card">
      <div className="table-header">
        <div>
          <h2>Salas cadastradas</h2>
          <p className="table-helper">
            Gerencie as salas disponíveis para reservas.
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
        <div className="empty-state">Carregando salas...</div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          Nenhuma sala cadastrada ainda. Crie a primeira ao lado.
        </div>
      ) : (
        <>
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Sala</th>
                <th>Local</th>
                <th>Capacidade</th>
                <th>Status</th>
                <th style={{ width: '120px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>
                    <div>{room.name}</div>
                    {room.description && (
                      <div className="badge-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        {room.description}
                      </div>
                    )}
                  </td>
                  <td>{room.location?.name || `ID: ${room.location_id}`}</td>
                  <td>{room.capacity ? `${room.capacity} pessoas` : '-'}</td>
                  <td>
                    {room.is_active ? (
                      <span className="tag success">Ativo</span>
                    ) : (
                      <span className="tag muted">Inativo</span>
                    )}
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => onEdit(room)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="button danger"
                        onClick={() => setDeleting(room)}
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
              {rooms.length} sala(s) encontrada(s)
            </span>
          </div>
        </>
      )}

      {deleting && (
        <ConfirmModal
          title="Confirmar exclusão"
          description={
            <p>
              Tem certeza que deseja excluir a sala{' '}
              <strong>{deleting.name}</strong>? Esta ação não pode ser
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

