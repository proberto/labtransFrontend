import { ReactNode } from 'react'

interface ConfirmModalProps {
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmModal = ({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal card">
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">{description}</div>
        <div className="modal-footer">
          <button
            type="button"
            className="button secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`button ${variant === 'danger' ? 'danger' : 'primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}


