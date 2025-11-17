import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ForgotPasswordForm } from './ForgotPasswordForm'

interface LoginFormProps {
  onSuccess?: () => void
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ username, password })
      onSuccess?.()
    } catch (err) {
      setError('Falha na autenticação. Verifique email e senha.')
    } finally {
      setLoading(false)
    }
  }

  // Se mostrar esqueceu senha, renderiza apenas esse formulário
  if (showForgotPassword) {
    return (
      <div>
        <ForgotPasswordForm
          onSuccess={() => {
            setShowForgotPassword(false)
            setError(null)
          }}
          onCancel={() => {
            setShowForgotPassword(false)
            setError(null)
          }}
        />
      </div>
    )
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Acesso ao sistema</h2>
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="seu@email.com"
          required
        />
      </label>

      <label className="field">
        <span>Senha</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {error && <p className="error-text">{error}</p>}

      <button className="button primary" type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <div style={{ marginTop: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          type="button"
          className="button secondary"
          onClick={() => setShowForgotPassword(true)}
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem', background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer' }}
        >
          Esqueceu sua senha?
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => navigate('/register')}
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        >
          Não tem conta? Cadastre-se
        </button>
      </div>
    </form>
  )
}


