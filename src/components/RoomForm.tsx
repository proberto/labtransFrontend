import { FormEvent, useEffect, useState } from 'react'
import type { Room, RoomPayload } from '../api/rooms'
import type { Location } from '../api/locations'
import { listLocations } from '../api/locations'

interface RoomFormProps {
  initial?: Room | null
  onSubmit: (payload: RoomPayload) => void
  submitting?: boolean
}

export const RoomForm = ({
  initial,
  onSubmit,
  submitting = false,
}: RoomFormProps) => {
  const [name, setName] = useState('')
  const [locationId, setLocationId] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [capacity, setCapacity] = useState<string>('')
  const [isActive, setIsActive] = useState(true)
  const [locations, setLocations] = useState<Location[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingLocations, setLoadingLocations] = useState(false)

  useEffect(() => {
    const fetchLocations = async () => {
      setLoadingLocations(true)
      try {
        const data = await listLocations()
        setLocations(data)
      } catch (err) {
        setError('Não foi possível carregar os locais.')
      } finally {
        setLoadingLocations(false)
      }
    }
    void fetchLocations()
  }, [])

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setLocationId(initial.location_id)
      setDescription(initial.description || '')
      setCapacity(initial.capacity != null ? String(initial.capacity) : '')
      setIsActive(initial.is_active ?? true)
    } else {
      setName('')
      setLocationId('')
      setDescription('')
      setCapacity('')
      setIsActive(true)
    }
    setError(null)
  }, [initial])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('O nome da sala é obrigatório.')
      return
    }

    if (!locationId) {
      setError('Selecione um local.')
      return
    }

    const payload: RoomPayload = {
      name: name.trim(),
      location_id: Number(locationId),
      description: description.trim() || null,
      capacity: capacity ? Number(capacity) : null,
      is_active: isActive,
    }

    onSubmit(payload)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{initial ? 'Editar sala' : 'Nova sala'}</h2>

      <label className="field">
        <span>Local *</span>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value ? Number(e.target.value) : '')}
          required
          disabled={loadingLocations}
        >
          <option value="">Selecione um local</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Nome da sala *</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Sala 101, Reunião A, Auditório"
          required
        />
      </label>

      <label className="field">
        <span>Descrição</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição da sala (opcional)"
          rows={3}
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Capacidade</span>
          <input
            type="number"
            min={0}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Número de pessoas"
          />
        </label>

        <label className="field-checkbox" style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Sala ativa
        </label>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="form-footer">
        <button type="submit" className="button primary" disabled={submitting}>
          {submitting
            ? 'Salvando...'
            : initial
              ? 'Salvar alterações'
              : 'Criar sala'}
        </button>
      </div>
    </form>
  )
}

