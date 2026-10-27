import React from "react";
import { ShieldCheck, Globe, Wrench, Users, Clock, Settings, Trash2 } from "lucide-react";
import { pretty, clients } from "../../data/seedData";

export function ServerCard({
  server,
  serverTools = [],
  onDetails,
  onDelete,
}) {
  const hasUnavailable = serverTools.some((t) => t.status === "unavailable");

  return (
    <div className="servercard">
      {/* Header Line */}
      <div className="serverline">
        <div className="servericon">{server.name.slice(0, 2).toUpperCase()}</div>
        <div className="serverlabel">
          <button className="link" onClick={() => onDetails(server._id)}>
            {server.name}
          </button>
          <div className="servercard-sub">
            <ShieldCheck size={12} />
            <span>{server.mcpId}</span>
          </div>
        </div>
        <span className={`status-live-pill ${server.status === "active" ? "live" : "inactive"}`}>
          <span className="live-dot" />
          {server.status === "active" ? "LIVE" : "INACTIVE"}
        </span>
      </div>

      {/* Description */}
      <p className="servercard-desc">{server.description || "—"}</p>

      {/* 3-Capsule Metadata Grid */}
      <div className="card-capsules-grid">
        <div className="card-capsule">
          <div className="card-capsule-head">
            <Globe size={11} />
            <span>Transport</span>
          </div>
          <span className="card-capsule-value" title={pretty(server.connection.transport)}>
            {pretty(server.connection.transport)}
          </span>
        </div>

        <div className="card-capsule">
          <div className="card-capsule-head">
            <Wrench size={11} />
            <span>Tools</span>
          </div>
          <span className="card-capsule-value">
            {serverTools.length} {serverTools.length === 1 ? "tool" : "tools"}
            {hasUnavailable && (
              <span style={{ color: "#b42318", marginLeft: "4px" }} title="Has unavailable tools">
                ⚠️
              </span>
            )}
          </span>
        </div>

        <div className="card-capsule">
          <div className="card-capsule-head">
            <Users size={11} />
            <span>Scope</span>
          </div>
          <span
            className="card-capsule-value"
            title={
              server.scope.type === "platform"
                ? "Platform Scope"
                : clients[server.scope.clientId] || server.scope.clientId
            }
          >
            {server.scope.type === "platform"
              ? "Platform"
              : clients[server.scope.clientId] || server.scope.clientId}
          </span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="card-timestamp">
        <Clock size={12} />
        <span>Last synced: {server.lastDiscoveredAt || server.updatedAt || server.createdAt}</span>
      </div>

      {/* Actions */}
      <div className="card-actions-row">
        <button
          type="button"
          className="card-configure-btn"
          onClick={() => onDetails(server._id)}
        >
          <Settings size={14} />
          <span>Configure</span>
        </button>
        <button
          type="button"
          className="card-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(server);
          }}
          title="Delete Server"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
