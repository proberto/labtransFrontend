import { FormEvent, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../api/auth'

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError('Token de recuperação não encontrado. Verifique o link enviado por email.')
    }
  }, [searchParams])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!token) {
      setError('Token de recuperação não encontrado.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      await resetPassword({
        token,
        new_password: newPassword,
      })
      setSuccess(true)
    } catch (err: any) {
      const errorMessage = 
        err?.response?.data?.detail || 
        (Array.isArray(err?.response?.data?.detail) 
          ? err.response.data.detail.map((item: any) => item.msg || JSON.stringify(item)).join('\n')
          : null) ||
        err?.response?.data?.message ||
        'Erro ao redefinir senha. Verifique o token e tente novamente.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card">
        <h2>Senha redefinida com sucesso!</h2>
        <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
          Sua senha foi alterada. Agora você pode fazer login com a nova senha.
        </p>
        <button 
          type="button" 
          className="button primary" 
          onClick={() => navigate('/login')} 
          style={{ width: '100%' }}
        >
          Ir para login
        </button>
      </div>
    )
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Redefinir senha</h2>
      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Digite sua nova senha abaixo.
      </p>

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
          placeholder="Digite a senha novamente"
          required
          minLength={6}
        />
      </label>

      {error && <p className="error-text" style={{ whiteSpace: 'pre-line' }}>{error}</p>}

      <div className="form-footer">
        <button className="button primary" type="submit" disabled={loading || !token} style={{ width: '100%' }}>
          {loading ? 'Redefinindo...' : 'Redefinir senha'}
        </button>
      </div>
    </form>
  )
}

