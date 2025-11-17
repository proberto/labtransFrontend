import { FormEvent, useEffect, useState } from 'react'
import type { Reservation, ReservationPayload } from '../api/reservations'

interface ReservationFormProps {
  initial?: Reservation | null
  onSubmit: (payload: ReservationPayload) => void
  submitting?: boolean
}

const toLocalInput = (iso: string | undefined) => {
  if (!iso) return ''
  return iso.slice(0, 16)
}

export const ReservationForm = ({
  initial,
  onSubmit,
  submitting = false,
}: ReservationFormProps) => {
  const [location, setLocation] = useState('')
  const [room, setRoom] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [responsible, setResponsible] = useState('')
  const [coffee, setCoffee] = useState(false)
  const [coffeeQuantity, setCoffeeQuantity] = useState<string>('')
  const [coffeeDescription, setCoffeeDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initial) {
      setLocation(initial.location)
      setRoom(initial.room)
      setStart(toLocalInput(initial.start_datetime))
      setEnd(toLocalInput(initial.end_datetime))
      setResponsible(initial.responsible)
      setCoffee(initial.coffee)
      setCoffeeQuantity(
        initial.coffee_quantity != null ? String(initial.coffee_quantity) : '',
      )
      setCoffeeDescription(initial.coffee_description ?? '')
    }
  }, [initial])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!location || !room || !start || !end || !responsible) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    if (new Date(start) >= new Date(end)) {
      setError('A data/hora final deve ser maior que a inicial.')
      return
    }

    const payload: ReservationPayload = {
      location,
      room,
      start_datetime: new Date(start).toISOString(),
      end_datetime: new Date(end).toISOString(),
      responsible,
      coffee,
      coffee_quantity: coffee
        ? coffeeQuantity
          ? Number(coffeeQuantity)
          : null
        : null,
      coffee_description: coffee ? coffeeDescription || null : null,
    }

    onSubmit(payload)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{initial ? 'Editar reserva' : 'Nova reserva'}</h2>

      <div className="field-row">
        <label className="field">
          <span>Local *</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Sede, Filial, Torre 1"
          />
        </label>

        <label className="field">
          <span>Sala *</span>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Ex: Sala 101, Reunião A"
          />
        </label>
      </div>

      <div className="field-row">
        <label className="field">
          <span>Início *</span>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Término *</span>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>
      </div>

      <label className="field">
        <span>Responsável *</span>
        <input
          value={responsible}
          onChange={(e) => setResponsible(e.target.value)}
          placeholder="Nome completo"
        />
      </label>

      <label className="field-checkbox">
        <input
          type="checkbox"
          checked={coffee}
          onChange={(e) => setCoffee(e.target.checked)}
        />
        Solicitar café para a reunião
      </label>

      {coffee && (
        <div className="field-row">
          <label className="field">
            <span>Quantidade de pessoas (café)</span>
            <input
              type="number"
              min={0}
              value={coffeeQuantity}
              onChange={(e) => setCoffeeQuantity(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Descrição do café</span>
            <input
              value={coffeeDescription}
              onChange={(e) => setCoffeeDescription(e.target.value)}
              placeholder="Ex: coffee break simples, sem lactose..."
            />
          </label>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      <div className="form-footer">
        <button type="submit" className="button primary" disabled={submitting}>
          {submitting
            ? 'Salvando...'
            : initial
              ? 'Salvar alterações'
              : 'Criar reserva'}
        </button>
      </div>
    </form>
  )
}


