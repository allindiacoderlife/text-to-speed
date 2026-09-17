import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function Alert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="alert-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertCircle size={18} />
        <span>{message}</span>
      </div>
      <button
        type="button"
        className="alert-close"
        onClick={onClose}
        title="Dismiss message"
      >
        <X size={16} />
      </button>
    </div>
  );
}
