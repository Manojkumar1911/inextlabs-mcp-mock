import React from "react";
import { ArrowLeft, Power, Pencil, Trash2 } from "lucide-react";
import { Status } from "../../../../shared/components/common/UIComponents";
import { clients } from "../../data/seedData";

export function DetailsHeader({
  server,
  onBack,
  onToggleStatus,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <div className="backline">
        <button onClick={onBack}>
          <ArrowLeft /> All MCP Servers
        </button>
        <span>/ {server.mcpId}</span>
      </div>

      <div className="pagehead detailhead">
        <div className="servericon big">{server.name.slice(0, 2).toUpperCase()}</div>
        <div className="grow">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
            <h1 style={{ margin: 0 }}>{server.name}</h1>
            <Status value={server.status} />
          </div>
          <p>
            {server.mcpId} · Version {server.version} ·{" "}
            {server.scope.type === "platform"
              ? "Platform Shared Scope"
              : `Client: ${clients[server.scope.clientId] || server.scope.clientId}`}
          </p>
        </div>
        <button
          className={"btn " + (server.status === "active" ? "secondary" : "primary")}
          onClick={() => onToggleStatus(server._id)}
          title={server.status === "active" ? "Deactivate this server" : "Activate this server"}
        >
          <Power size={14} />
          {server.status === "active" ? "Deactivate Server" : "Activate Server"}
        </button>
        <button className="btn secondary" onClick={() => onEdit(server)}>
          <Pencil size={14} /> Edit
        </button>
        <button
          className="btn dangeroutline"
          onClick={() => onDelete(server)}
          title="Delete Server"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </>
  );
}
