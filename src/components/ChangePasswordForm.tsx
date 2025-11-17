import { FormEvent, useState } from 'react'
import { changePassword } from '../api/auth'
import type { ChangePasswordPayload } from '../api/auth'

interface ChangePasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export const ChangePasswordForm = ({ onSuccess, onCancel }: ChangePasswordFormProps) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem.')
      return
    }

    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const payload: ChangePasswordPayload = {
        current_password: currentPassword,
        new_password: newPassword,
      }
      await changePassword(payload)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      onSuccess?.()
    } catch (err: any) {
      const errorMessage = 
        err?.response?.data?.detail || 
        (Array.isArray(err?.response?.data?.detail) 
          ? err.response.data.detail.map((item: any) => item.msg || JSON.stringify(item)).join('\n')
          : null) ||
        err?.response?.data?.message ||
        'Erro ao alterar senha. Verifique os dados e tente novamente.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Alterar senha</h2>

      <label className="field">
        <span>Senha atual *</span>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Digite sua senha atual"
          required
        />
      </label>

      <label className="field">
        <span>Nova senha *</span>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
        />
      </label>

      <label className="field">
        <span>Confirmar nova senha *</span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Digite a nova senha novamente"
          required
          minLength={6}
        />
      </label>

      {error && <p className="error-text" style={{ whiteSpace: 'pre-line' }}>{error}</p>}

      <div className="form-footer" style={{ display: 'flex', gap: '0.5rem' }}>
        {onCancel && (
          <button type="button" className="button secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
        )}
        <button className="button primary" type="submit" disabled={loading} style={{ flex: 1 }}>
          {loading ? 'Alterando...' : 'Alterar senha'}
        </button>
      </div>
    </form>
  )
}

