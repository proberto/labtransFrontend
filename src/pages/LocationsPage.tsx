import { useState } from 'react'
import { createLocation, updateLocation } from '../api/locations'
import type { LocationPayload, Location } from '../api/locations'
import { useAuth } from '../context/AuthContext'
import { LocationForm } from '../components/LocationForm'
import { LocationList } from '../components/LocationList'
import { Navigation } from '../components/Navigation'

export const LocationsPage = () => {
  const { user, logout } = useAuth()
  const [editing, setEditing] = useState<Location | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSubmit = async (payload: LocationPayload) => {
    try {
      setSubmitting(true)
      if (editing) {
        await updateLocation(editing.id, payload)
        setEditing(null)
      } else {
        await createLocation(payload)
        setEditing(null)
      }
      setRefreshKey((k) => k + 1)
    } catch (err: any) {
      console.error('Erro ao salvar local:', err)
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
          <h1>Gerenciar Locais</h1>
          <span>Cadastre e gerencie os locais disponíveis para reservas.</span>
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
        <LocationList
          onEdit={(location) => {
            setEditing(location)
          }}
          refreshTrigger={refreshKey}
        />
        <LocationForm
          key={editing?.id || 'new'}
          initial={editing}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </main>
    </div>
  )
}

