import { FormEvent, useEffect, useState } from 'react'
import type { Location, LocationPayload } from '../api/locations'

interface LocationFormProps {
  initial?: Location | null
  onSubmit: (payload: LocationPayload) => void
  submitting?: boolean
}

export const LocationForm = ({
  initial,
  onSubmit,
  submitting = false,
}: LocationFormProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setDescription(initial.description || '')
      setIsActive(initial.is_active ?? true)
    } else {
      setName('')
      setDescription('')
      setIsActive(true)
    }
    setError(null)
  }, [initial])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('O nome do local é obrigatório.')
      return
    }

    const payload: LocationPayload = {
      name: name.trim(),
      description: description.trim() || null,
      is_active: isActive,
    }

    onSubmit(payload)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{initial ? 'Editar local' : 'Novo local'}</h2>

      <label className="field">
        <span>Nome do local *</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Sede, Filial 1, Torre 1"
          required
        />
      </label>

      <label className="field">
        <span>Descrição</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição do local (opcional)"
          rows={3}
        />
      </label>

      <label className="field-checkbox">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Local ativo
      </label>

      {error && <p className="error-text">{error}</p>}

      <div className="form-footer">
        <button type="submit" className="button primary" disabled={submitting}>
          {submitting
            ? 'Salvando...'
            : initial
              ? 'Salvar alterações'
              : 'Criar local'}
        </button>
      </div>
    </form>
  )
}

