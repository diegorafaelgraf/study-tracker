import React from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  modalToClose?: () => void; // Nueva prop para cerrar otro modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, modalToClose }) => {
  if (!isOpen) return null;

  if (modalToClose) {
    modalToClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;