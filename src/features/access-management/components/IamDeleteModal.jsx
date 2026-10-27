import React, { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function IamDeleteModal({
  isOpen,
  onClose,
  title = "Delete item",
  subtitle = "Verify deletion request",
  entityName = "",
  entitySub = "",
  avatarText = "",
  warningText = "This action will permanently remove this record from the system.",
  confirmButtonText = "Delete",
  onConfirm,
}) {
  const [confirmInput, setConfirmInput] = useState("");

  useEffect(() => {
    setConfirmInput("");
  }, [isOpen, entityName]);

  if (!isOpen) return null;

  const initials =
    avatarText ||
    (entityName || "IT")
      .split(/[\s.@_-]+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const isMatch =
    confirmInput.trim().toLowerCase() === entityName.trim().toLowerCase();

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="delete-modal-wrap" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="delete-modal-top">
          <div className="delete-modal-top-left">
            <div className="delete-modal-icon-badge">
              <AlertTriangle size={19} />
            </div>
            <div>
              <h3 className="delete-modal-title">{title}</h3>
              <p className="delete-modal-subtitle">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            className="delete-modal-close-btn"
            onClick={onClose}
            title="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="delete-modal-body">
          {/* Target Entity Card */}
          <div className="delete-server-card">
            <div className="delete-server-avatar">{initials}</div>
            <div className="delete-server-info">
              <span className="delete-server-name">{entityName}</span>
              {entitySub && (
                <span className="delete-server-sub">{entitySub}</span>
              )}
            </div>
          </div>

          {/* Warning Callout Box */}
          <div className="delete-warning-box">
            <div className="delete-warning-header">
              <AlertTriangle size={15} />
              <span>This action cannot be undone.</span>
            </div>
            {warningText && (
              <p
                className="delete-warning-lead"
                style={{ margin: "4px 0 0", fontSize: "11px", fontWeight: 400 }}
              >
                {warningText}
              </p>
            )}
          </div>

          {/* Type to Confirm Field */}
          <div>
            <label className="delete-confirm-prompt">
              To confirm, type{" "}
              <span className="delete-confirm-code">{entityName}</span>
            </label>
            <input
              type="text"
              className="delete-confirm-input"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={`Type "${entityName}" to confirm`}
            />
          </div>
        </div>

        {/* Actions Footer */}
        <div className="delete-modal-actions">
          <button
            type="button"
            className="btn secondary"
            onClick={onClose}
          >
            Back
          </button>
          <button
            type="button"
            className="btn danger"
            disabled={!isMatch}
            style={{
              opacity: isMatch ? 1 : 0.45,
              cursor: isMatch ? "pointer" : "not-allowed",
            }}
            onClick={() => {
              if (isMatch) {
                onConfirm();
                onClose();
              }
            }}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
