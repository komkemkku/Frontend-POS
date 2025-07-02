import React from 'react';
import './ConfirmDialog.css';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="confirm-bg">
      <div className="confirm-dialog">
        <h4>{title}</h4>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>ยกเลิก</button>
          <button className="confirm-ok" onClick={onConfirm}>ตกลง</button>
        </div>
      </div>
    </div>
  );
}
