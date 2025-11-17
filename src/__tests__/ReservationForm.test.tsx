import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { ReservationForm } from '../components/ReservationForm'

describe('ReservationForm', () => {
  it('valida campos obrigatórios antes de enviar', () => {
    const handleSubmit = vi.fn()
    render(<ReservationForm onSubmit={handleSubmit} />)

    const submitButton = screen.getByRole('button', { name: /criar reserva/i })
    fireEvent.click(submitButton)

    expect(
      screen.getByText(/preencha todos os campos obrigatórios/i),
    ).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })
})


