import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '../components/LoginForm'
import { AuthProvider } from '../context/AuthContext'

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<AuthProvider>{ui}</AuthProvider>)
}

describe('LoginForm', () => {
  it('valida fluxo básico de login', async () => {
    renderWithProviders(<LoginForm />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const button = screen.getByRole('button', { name: /entrar/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'secret' } })

    fireEvent.click(button)

    await waitFor(() =>
      expect(button).toHaveTextContent(/entrando/i),
    )
  })
})


