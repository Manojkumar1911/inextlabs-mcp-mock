import React from "react";
import { AlertTriangle, X } from "lucide-react";

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  targetServer,
  deleteConfirmText,
  setDeleteConfirmText,
  onConfirmDelete,
  clients = {},
  toolCount = 0,
}) {
  if (!isOpen || !targetServer) return null;

  const targetName = targetServer?.name || "MCP Server";
  const targetInitials = (targetName || "MC")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const scopeDesc =
    targetServer?.scope?.type === "platform"
      ? "Platform Scope (Shared)"
      : `Client: ${clients[targetServer?.scope?.clientId] || "iTrade"}`;

  const isMatch = deleteConfirmText.trim().toLowerCase() === targetName.trim().toLowerCase();

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
              <h3 className="delete-modal-title">Delete MCP Server</h3>
              <p className="delete-modal-subtitle">Verify deletion request</p>
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
            <div className="delete-server-avatar">{targetInitials}</div>
            <div className="delete-server-info">
              <span className="delete-server-name">{targetName}</span>
              <span className="delete-server-sub">
                {targetServer?.mcpId} · {scopeDesc}
              </span>
            </div>
          </div>

          {/* Warning Callout Box */}
          <div className="delete-warning-box">
            <div className="delete-warning-header">
              <AlertTriangle size={15} />
              <span>This action cannot be undone.</span>
            </div>
            <p className="delete-warning-lead">Deleting this MCP server will:</p>
            <ul className="delete-warning-list">
              <li>Disconnect all agents and client workflows routed through this endpoint</li>
              <li>Remove all {toolCount} discovered tool registrations and parameter schemas</li>
              <li>Permanently erase stored connection URL and authentication tokens</li>
            </ul>
          </div>

          {/* Type to Confirm Field */}
          <div>
            <label className="delete-confirm-prompt">
              To confirm, type <span className="delete-confirm-code">{targetName}</span>
            </label>
            <input
              type="text"
              className="delete-confirm-input"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
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
            onClick={onConfirmDelete}
          >
            Delete this server
          </button>
        </div>
      </div>
    </div>
  );
}
