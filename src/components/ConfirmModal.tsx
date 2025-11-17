import { ReactNode } from 'react'

interface ConfirmModalProps {
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default' | 'error'
  onConfirm: () => void
  onCancel: () => void
  showCancel?: boolean // Para modais de erro que só precisam de OK
}

export const ConfirmModal = ({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel,
  showCancel = true,
}: ConfirmModalProps) => {
  console.log('ConfirmModal renderizado:', { title, variant, showCancel })
  
  // Fecha modal ao clicar no backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  // Fecha modal com ESC
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 99999,
        backdropFilter: 'blur(2px)',
        margin: 0,
      }}
    >
      <div 
        className="modal card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '420px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          zIndex: 100000,
        }}
      >
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">{description}</div>
        <div className="modal-footer">
          {showCancel && (
            <button
              type="button"
              className="button secondary"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            className={`button ${
              variant === 'danger' || variant === 'error' 
                ? 'danger' 
                : 'primary'
            }`}
            onClick={variant === 'error' ? onCancel : onConfirm}
          >
            {variant === 'error' ? 'Entendi' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}


