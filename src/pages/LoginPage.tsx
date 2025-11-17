import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'

export const LoginPage = () => {
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <header className="app-header app-header--center">
        <div className="app-title app-title--center">
          <h1>LabTrans – Reservas</h1>
          <span>Sistema de reserva de salas de reuniões</span>
        </div>
      </header>
      <main className="page-layout-single">
        <LoginForm onSuccess={() => navigate('/reservations')} />
      </main>
    </div>
  )
}


