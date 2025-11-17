import { FormEvent, useState } from 'react'
import { register } from '../api/auth'
import type { RegisterPayload } from '../api/auth'

interface RegisterFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export const RegisterForm = ({ onSuccess, onCancel }: RegisterFormProps) => {
  console.log('RegisterForm renderizado')
  
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  console.log('RegisterForm estado:', { email, username, loading, error })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    console.log('RegisterForm: handleSubmit chamado')
    setError(null)

    console.log('Validando senhas...')
    if (password !== confirmPassword) {
      console.log('Senhas não coincidem')
      setError('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      console.log('Senha muito curta')
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    console.log('Validações passaram, iniciando cadastro...')

    setLoading(true)
    try {
      const payload: RegisterPayload = {
        email: email.trim(),
        username: username.trim(),
        password,
        full_name: fullName.trim() || null,
      }
      console.log('Tentando cadastrar usuário com payload:', payload)
      const result = await register(payload)
      console.log('Usuário cadastrado com sucesso:', result)
      console.log('Chamando onSuccess callback')
      onSuccess?.()
      console.log('onSuccess chamado')
    } catch (err: any) {
      console.error('Erro ao cadastrar usuário:', err)
      console.error('Response:', err?.response)
      console.error('Response data:', err?.response?.data)
      console.error('Response status:', err?.response?.status)
      
      const errorMessage = 
        err?.response?.data?.detail || 
        (Array.isArray(err?.response?.data?.detail) 
          ? err.response.data.detail.map((item: any) => item.msg || JSON.stringify(item)).join('\n')
          : null) ||
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao cadastrar usuário. Verifique os dados e tente novamente.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Cadastrar novo usuário</h2>

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

      <label className="field">
        <span>Nome de usuário *</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="nomeusuario"
          required
        />
      </label>

      <label className="field">
        <span>Nome completo</span>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Seu nome completo"
        />
      </label>

      <label className="field">
        <span>Senha *</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
        />
      </label>

      <label className="field">
        <span>Confirmar senha *</span>
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

      <div className="form-footer" style={{ display: 'flex', gap: '0.5rem' }}>
        {onCancel && (
          <button type="button" className="button secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
        )}
        <button className="button primary" type="submit" disabled={loading} style={{ flex: 1 }}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </div>
    </form>
  )
}

