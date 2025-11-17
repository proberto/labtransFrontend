import { ResetPasswordForm } from '../components/ResetPasswordForm'

export const ResetPasswordPage = () => {
  return (
    <div className="app-shell">
      <header className="app-header app-header--center">
        <div className="app-title app-title--center">
          <h1>LabTrans – Reservas</h1>
          <span>Sistema de reserva de salas de reuniões</span>
        </div>
      </header>
      <main className="page-layout-single">
        <ResetPasswordForm />
      </main>
    </div>
  )
}

