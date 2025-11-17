import { useState } from 'react'
import { createRoom, updateRoom } from '../api/rooms'
import type { RoomPayload, Room } from '../api/rooms'
import { useAuth } from '../context/AuthContext'
import { RoomForm } from '../components/RoomForm'
import { RoomList } from '../components/RoomList'
import { Navigation } from '../components/Navigation'

export const RoomsPage = () => {
  const { user, logout } = useAuth()
  const [editing, setEditing] = useState<Room | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSubmit = async (payload: RoomPayload) => {
    try {
      setSubmitting(true)
      if (editing) {
        await updateRoom(editing.id, payload)
        setEditing(null)
      } else {
        await createRoom(payload)
        setEditing(null)
      }
      setRefreshKey((k) => k + 1)
    } catch (err: any) {
      console.error('Erro ao salvar sala:', err)
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
      <Navigation />
      <header className="app-header">
        <div className="app-title">
          <h1>Gerenciar Salas</h1>
          <span>Cadastre e gerencie as salas disponíveis para reservas.</span>
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
        <RoomList
          onEdit={(room) => {
            setEditing(room)
          }}
          refreshTrigger={refreshKey}
        />
        <RoomForm
          key={editing?.id || 'new'}
          initial={editing}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </main>
    </div>
  )
}

