import { FormEvent, useState } from 'react'
import { forgotPassword } from '../api/auth'

interface ForgotPasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export const ForgotPasswordForm = ({ onSuccess, onCancel }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await forgotPassword({ email: email.trim() })
      setSuccess(true)
    } catch (err: any) {
      const errorMessage = 
        err?.response?.data?.detail || 
        (Array.isArray(err?.response?.data?.detail) 
          ? err.response.data.detail.map((item: any) => item.msg || JSON.stringify(item)).join('\n')
          : null) ||
        err?.response?.data?.message ||
        'Erro ao solicitar recuperação de senha. Verifique o email e tente novamente.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card">
        <h2>Email enviado</h2>
        <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
          Se o email <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir sua senha.
        </p>
        {onCancel && (
          <button type="button" className="button primary" onClick={onCancel} style={{ width: '100%' }}>
            Voltar ao login
          </button>
        )}
      </div>
    )
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Esqueceu sua senha?</h2>
      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Digite seu email e enviaremos um link para redefinir sua senha.
      </p>

      <label className="field">
        <span>Email *</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
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
          {loading ? 'Enviando...' : 'Enviar link'}
        </button>
      </div>
    </form>
  )
}

