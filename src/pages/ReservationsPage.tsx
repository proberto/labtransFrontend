import { useState, useEffect } from 'react'
import { createReservation, updateReservation } from '../api/reservations'
import type { ReservationPayload, Reservation } from '../api/reservations'
import { useAuth } from '../context/AuthContext'
import { ReservationForm } from '../components/ReservationForm'
import { ReservationList } from '../components/ReservationList'
import { ConfirmModal } from '../components/ConfirmModal'
import { Navigation } from '../components/Navigation'
import { ChangePasswordForm } from '../components/ChangePasswordForm'

export const ReservationsPage = () => {
  const { user, logout } = useAuth()
  const [editing, setEditing] = useState<Reservation | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [showChangePassword, setShowChangePassword] = useState(false)

  const [conflictError, setConflictError] = useState<string | null>(null)

  // Monitora mudanças no conflictError para debug
  useEffect(() => {
    if (conflictError) {
      console.log('✅ conflictError foi setado:', conflictError)
    } else {
      console.log('❌ conflictError foi limpo')
    }
  }, [conflictError])

  const handleSubmit = async (payload: ReservationPayload) => {
    setConflictError(null)
    try {
      setSubmitting(true)
      if (editing) {
        await updateReservation(editing.id, payload)
        setEditing(null)
      } else {
        await createReservation(payload)
        // Limpa o formulário após criar nova reserva com sucesso
        setEditing(null)
        // Força atualização da lista após sucesso
        setRefreshKey((k) => k + 1)
      }
      // Limpa qualquer erro anterior após sucesso
      setConflictError(null)
    } catch (err: any) {
      // Pega o status HTTP
      const status = err?.response?.status
      console.log('Status HTTP do erro:', status)
      console.log('Dados do erro:', err?.response?.data)
      
      // Função auxiliar para extrair mensagem de erro do FastAPI
      const extractErrorMessage = (errorData: any): string => {
        if (!errorData) {
          return 'Ocorreu um erro ao salvar a reserva. Verifique os dados e tente novamente.'
        }

        // Se detail é uma string, retorna diretamente
        if (typeof errorData.detail === 'string') {
          return errorData.detail
        }

        // Se detail é um array (erros de validação do FastAPI/Pydantic)
        if (Array.isArray(errorData.detail)) {
          const messages = errorData.detail.map((item: any) => {
            // Formato padrão do FastAPI: { loc: ['field'], msg: 'message', type: 'type' }
            const field = Array.isArray(item.loc) ? item.loc.slice(1).join('.') : item.loc
            const msg = item.msg || 'Erro de validação'
            return field ? `${field}: ${msg}` : msg
          })
          return messages.join('\n')
        }

        // Se detail é um objeto, tenta extrair mensagem
        if (typeof errorData.detail === 'object') {
          return errorData.detail.msg || errorData.detail.message || JSON.stringify(errorData.detail)
        }

        // Outros formatos
        if (typeof errorData === 'string') {
          return errorData
        }

        if (errorData.message) {
          return errorData.message
        }

        return 'Ocorreu um erro ao salvar a reserva. Verifique os dados e tente novamente.'
      }

      const errorMessage = extractErrorMessage(err?.response?.data)
      
      console.log('Mensagem de erro extraída:', errorMessage)
      
      // Para erros 400, 409 ou 422, sempre mostra o modal de erro
      if (status === 400 || status === 409 || status === 422) {
        console.log('É erro de validação/conflito! Setando conflictError:', errorMessage)
        setConflictError(errorMessage)
      } else {
        // Para outros erros, também mostra
        console.log('Erro diferente, mas setando conflictError:', errorMessage)
        setConflictError(errorMessage)
      }
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
          <h1>Reservas de salas</h1>
          <span>Gerencie as reservas de reuniões da organização.</span>
        </div>
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <span>{user}</span>
          <button 
            type="button" 
            className="button secondary" 
            onClick={() => setShowChangePassword(true)}
            style={{ fontSize: '0.85rem' }}
          >
            Alterar senha
          </button>
          <button type="button" className="button secondary" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <main className="page-layout">
        <ReservationList 
          onEdit={(reservation) => {
            setConflictError(null) // Limpa erro ao editar
            setEditing(reservation)
          }} 
          refreshTrigger={refreshKey} 
        />
        <ReservationForm
          key={editing ? `edit-${editing.id}` : `new-${refreshKey}`} // Force re-render quando mudar entre editar/criar ou após criar
          initial={editing}
          onSubmit={handleSubmit}
          submitting={submitting}
        />

      </main>

      {/* Modal de erro para conflito de horário - mesma abordagem do modal de exclusão */}
      {conflictError && (
        <ConfirmModal
          title="⚠️ Conflito de Horário"
          description={
            <div>
              <div style={{ whiteSpace: 'pre-line' }}>
                {conflictError}
              </div>
              {conflictError && (
                conflictError.toLowerCase().includes('conflito') ||
                conflictError.toLowerCase().includes('reserva') ||
                conflictError.toLowerCase().includes('horário')
              ) ? (
                <p style={{ 
                  marginTop: '0.75rem',
                  fontSize: '0.9rem', 
                  color: '#6b7280',
                  fontStyle: 'italic'
                }}>
                  Por favor, escolha outro horário ou outra sala para sua reserva.
                </p>
              ) : null}
            </div>
          }
          variant="error"
          showCancel={false}
          onCancel={() => {
            console.log('Fechando modal de erro')
            setConflictError(null)
          }}
          onConfirm={() => {}} // Não usado quando showCancel=false
        />
      )}

      {/* Modal para alterar senha */}
      {showChangePassword && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 99999,
            backdropFilter: 'blur(2px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowChangePassword(false)
            }
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ChangePasswordForm
              onSuccess={() => {
                setShowChangePassword(false)
                alert('Senha alterada com sucesso!')
              }}
              onCancel={() => setShowChangePassword(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}


