import { useEffect, useState } from 'react'
import { deleteLocation, listLocations } from '../api/locations'
import type { Location } from '../api/locations'
import { ConfirmModal } from './ConfirmModal'

interface LocationListProps {
  onEdit: (location: Location) => void
  refreshTrigger?: number
}

export const LocationList = ({ onEdit, refreshTrigger }: LocationListProps) => {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Location | null>(null)
  const [syncing, setSyncing] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listLocations()
      setLocations(data)
    } catch (err) {
      setError('Não foi possível carregar os locais.')
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
      await deleteLocation(deleting.id)
      await fetchData()
    } catch (err) {
      setError('Erro ao excluir local.')
    } finally {
      setDeleting(null)
      setSyncing(false)
    }
  }

  return (
    <section className="table-card">
      <div className="table-header">
        <div>
          <h2>Locais cadastrados</h2>
          <p className="table-helper">
            Gerencie os locais disponíveis para reservas.
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
        <div className="empty-state">Carregando locais...</div>
      ) : locations.length === 0 ? (
        <div className="empty-state">
          Nenhum local cadastrado ainda. Crie o primeiro ao lado.
        </div>
      ) : (
        <>
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Status</th>
                <th style={{ width: '120px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id}>
                  <td>{location.name}</td>
                  <td>{location.description || '-'}</td>
                  <td>
                    {location.is_active ? (
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
                        onClick={() => onEdit(location)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="button danger"
                        onClick={() => setDeleting(location)}
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
              {locations.length} local(is) encontrado(s)
            </span>
          </div>
        </>
      )}

      {deleting && (
        <ConfirmModal
          title="Confirmar exclusão"
          description={
            <p>
              Tem certeza que deseja excluir o local{' '}
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

