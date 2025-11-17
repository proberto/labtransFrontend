import { useEffect, useState } from 'react'
import { deleteReservation, listReservations } from '../api/reservations'
import type { Reservation } from '../api/reservations'
import { ConfirmModal } from './ConfirmModal'

interface ReservationListProps {
  onEdit: (reservation: Reservation) => void
  refreshTrigger?: number
}

export const ReservationList = ({ onEdit, refreshTrigger }: ReservationListProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Reservation | null>(null)
  const [syncing, setSyncing] = useState(false)
  
  // Estado de paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10) // Itens por página
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchData = async (page: number = currentPage) => {
    setLoading(true)
    setError(null)
    try {
      const paginatedData = await listReservations({ page, size: pageSize })
      
      console.log('Dados paginados recebidos:', paginatedData)
      console.log('Total de páginas:', paginatedData.pages)
      console.log('Total de itens:', paginatedData.total)
      
      // Endpoint sempre retorna dados paginados
      setReservations(paginatedData.items)
      setTotalItems(paginatedData.total)
      
      // Calcula o número de páginas se a API não retornar
      const calculatedPages = paginatedData.pages || Math.ceil(paginatedData.total / pageSize)
      console.log('Páginas calculadas:', calculatedPages)
      
      setTotalPages(calculatedPages)
      setCurrentPage(paginatedData.page)
    } catch (err) {
      console.error('Erro ao carregar reservas:', err)
      setError('Não foi possível carregar as reservas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData(currentPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  // Recarrega quando o refreshTrigger mudar (após criar/editar reserva)
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      void fetchData(currentPage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger])

  const handleDelete = async () => {
    if (!deleting) return
    try {
      setSyncing(true)
      await deleteReservation(deleting.id)
      // Se a página atual ficar vazia após deletar, volta para a página anterior
      if (reservations.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1)
      } else {
        // Recarrega a lista para garantir sincronização
        await fetchData(currentPage)
      }
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
          onClick={() => void fetchData(currentPage)}
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
              {reservations.map((reservation) => {
                // Extrai local e sala do objeto room ou dos campos legados
                const locationName = reservation.room?.location?.name || reservation.local || 'N/A'
                const roomName = reservation.room?.name || reservation.sala || 'N/A'
                
                return (
                <tr key={reservation.id}>
                  <td>
                    <div>{locationName}</div>
                    <div className="badge-muted">{roomName}</div>
                  </td>
                  <td>
                    <div>{formatDateTime(reservation.data_inicio)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      até {formatDateTime(reservation.data_fim)}
                    </div>
                  </td>
                  <td>
                    {reservation.responsible?.full_name || reservation.responsible?.username || 'N/A'}
                  </td>
                  <td>
                    {reservation.cafe ? (
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
              )})}
            </tbody>
          </table>

          <div className="status-bar">
            <span>
              <span className="pill-dot" />
              {totalItems} reserva(s) encontrada(s)
              {totalPages > 1 && ` (Página ${currentPage} de ${totalPages})`}
            </span>
          </div>

          {/* Controles de paginação */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="button secondary"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
              >
                Anterior
              </button>
              
              <div className="pagination-info">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`button ${currentPage === pageNum ? 'primary' : 'secondary'}`}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={loading}
                      style={{
                        minWidth: '40px',
                        padding: '0.5rem',
                      }}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                className="button secondary"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || loading}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}

      {deleting && (
        <ConfirmModal
          title="Confirmar exclusão"
          description={
            <p>
              Tem certeza que deseja excluir a reserva da sala{' '}
              <strong>{deleting.room?.name || deleting.sala || 'N/A'}</strong> em{' '}
              <strong>{deleting.room?.location?.name || deleting.local || 'N/A'}</strong>? Esta ação não pode ser
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


