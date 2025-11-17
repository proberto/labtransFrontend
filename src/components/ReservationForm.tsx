import { FormEvent, useEffect, useState } from 'react'
import type { Reservation, ReservationPayload } from '../api/reservations'
import { listLocations } from '../api/locations'
import type { Location } from '../api/locations'
import { listRooms } from '../api/rooms'
import type { Room } from '../api/rooms'

interface ReservationFormProps {
  initial?: Reservation | null
  onSubmit: (payload: ReservationPayload) => void
  submitting?: boolean
  onReset?: () => void
}

const toLocalInput = (iso: string | undefined) => {
  if (!iso) return ''
  return iso.slice(0, 16)
}

export const ReservationForm = ({
  initial,
  onSubmit,
  submitting = false,
  onReset,
}: ReservationFormProps) => {
  const [location, setLocation] = useState('')
  const [room, setRoom] = useState('')
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [coffee, setCoffee] = useState(false)
  const [coffeeQuantity, setCoffeeQuantity] = useState<string>('')
  const [coffeeDescription, setCoffeeDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loadingData, setLoadingData] = useState(false)

  // Carrega locais e salas do backend
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true)
      try {
        const [locationsData, roomsData] = await Promise.all([
          listLocations(),
          listRooms(),
        ])
        setLocations(locationsData)
        setRooms(roomsData)
      } catch (err) {
        console.error('Erro ao carregar locais e salas:', err)
      } finally {
        setLoadingData(false)
      }
    }
    void fetchData()
  }, [])

  // Função auxiliar para obter salas de um local específico
  const getRoomsByLocation = (locationName: string): Room[] => {
    const location = locations.find((loc) => loc.name === locationName)
    if (!location) return []
    return rooms.filter((room) => room.location_id === location.id)
  }

  // Atualiza o room_id quando a sala é selecionada
  useEffect(() => {
    if (location && room) {
      const availableRooms = getRoomsByLocation(location)
      const selectedRoom = availableRooms.find((r) => r.name === room)
      if (selectedRoom) {
        setSelectedRoomId(selectedRoom.id)
      } else {
        setSelectedRoomId(null)
      }
    } else {
      setSelectedRoomId(null)
    }
  }, [location, room, locations, rooms])

  // Função para resetar o formulário
  const resetForm = () => {
    setLocation('')
    setRoom('')
    setSelectedRoomId(null)
    setStart('')
    setEnd('')
    setCoffee(false)
    setCoffeeQuantity('')
    setCoffeeDescription('')
    setError(null)
  }

  useEffect(() => {
    if (initial) {
      // Extrai local e sala do objeto room ou dos campos legados
      const locationName = initial.room?.location?.name || initial.local || ''
      const roomName = initial.room?.name || initial.sala || ''
      setLocation(locationName)
      setRoom(roomName)
      setStart(toLocalInput(initial.data_inicio))
      setEnd(toLocalInput(initial.data_fim))
      setCoffee(initial.cafe)
      setCoffeeQuantity(
        initial.quantidade_cafe != null ? String(initial.quantidade_cafe) : '',
      )
      setCoffeeDescription(initial.descricao_cafe ?? '')
    } else {
      // Reset form when no initial data (quando initial é null/undefined)
      // Limpa todos os campos do formulário
      setLocation('')
      setRoom('')
      setSelectedRoomId(null)
      setStart('')
      setEnd('')
      setCoffee(false)
      setCoffeeQuantity('')
      setCoffeeDescription('')
      setError(null)
    }
  }, [initial])

  // Verifica se o local atual está na lista do backend
  const isLocationInList = locations.some((loc) => loc.name === location)
  // Verifica se a sala atual está na lista de salas do local selecionado
  const availableRooms = location ? getRoomsByLocation(location) : []
  const isRoomInList = location
    ? availableRooms.some((r) => r.name === room)
    : false

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!location || !room || !start || !end) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    if (!selectedRoomId) {
      setError('Selecione uma sala válida.')
      return
    }

    if (new Date(start) >= new Date(end)) {
      setError('A data/hora final deve ser maior que a inicial.')
      return
    }

    const payload: ReservationPayload = {
      room_id: selectedRoomId,
      data_inicio: new Date(start).toISOString(),
      data_fim: new Date(end).toISOString(),
      cafe: coffee,
      quantidade_cafe: coffee
        ? coffeeQuantity
          ? Number(coffeeQuantity)
          : null
        : null,
      descricao_cafe: coffee ? coffeeDescription || null : null,
    }

    onSubmit(payload)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{initial ? 'Editar reserva' : 'Nova reserva'}</h2>

      <div className="field-row">
        <label className="field">
          <span>Local *</span>
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value)
              // Limpa a sala quando mudar o local, pois as salas são específicas de cada local
              setRoom('')
            }}
            required
          >
            <option value="">
              {loadingData ? 'Carregando...' : 'Selecione um local'}
            </option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
            {/* Permite editar reservas com locais que não estão na lista pré-cadastrada */}
            {initial && !isLocationInList && (
              <option value={initial.local}>{initial.local} (atual)</option>
            )}
          </select>
        </label>

        <label className="field">
          <span>Sala *</span>
          {isLocationInList ? (
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              disabled={!location}
              required
            >
              <option value="">
                {location
                  ? loadingData
                    ? 'Carregando...'
                    : 'Selecione uma sala'
                  : 'Primeiro selecione um local'}
              </option>
              {location &&
                availableRooms.map((roomItem) => (
                  <option key={roomItem.id} value={roomItem.name}>
                    {roomItem.name}
                  </option>
                ))}
              {/* Permite editar reservas com salas que não estão na lista pré-cadastrada */}
              {initial && location === initial.local && !isRoomInList && (
                <option value={initial.sala}>{initial.sala} (atual)</option>
              )}
            </select>
          ) : (
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Digite o nome da sala"
              required
            />
          )}
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


