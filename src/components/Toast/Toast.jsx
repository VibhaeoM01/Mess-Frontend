import React, { useEffect } from 'react';
import './Toast.scss';

const Toast = ({ 
  message, 
  type = 'info', 
  isVisible, 
  onClose, 
  duration = 4000,
  actionButton = null 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast toast--${type} ${isVisible ? 'toast--visible' : ''}`}>
      <div className="toast__content">
        <div className="toast__icon">
          {type === 'info' && '📢'}
          {type === 'warning' && '⚠️'}
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
        </div>
        <div className="toast__message">
          {message}
        </div>
        {actionButton && (
          <div className="toast__action">
            {actionButton}
          </div>
        )}
      </div>
      <button 
        className="toast__close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
