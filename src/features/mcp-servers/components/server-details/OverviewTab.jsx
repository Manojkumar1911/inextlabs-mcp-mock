import React from "react";
import { Globe, ShieldCheck, RefreshCw } from "lucide-react";
import { Badge, Info } from "../../../../shared/components/common/UIComponents";
import { pretty, clients } from "../../data/seedData";

export function OverviewTab({ server, serverTools = [], onSyncTools }) {
  return (
    <div className="overview">
      <div className="subpanel">
        <h2>Server Identity & Scope</h2>
        <p className="muted">
          Server registration, scope type, and lifecycle audit metadata.
        </p>
        <Info label="Server Name" value={server.name} />
        <Info label="MCP ID" value={server.mcpId} />
        <Info label="Description" value={server.description} />
        <Info
          label="Scope Type"
          value={
            server.scope.type === "platform" ? (
              <Badge tone="purple">Platform (Shared Integration)</Badge>
            ) : (
              <Badge tone="info">Client Tenant ({server.scope.clientId})</Badge>
            )
          }
        />
        {server.scope.clientId && (
          <Info
            label="Client Name"
            value={clients[server.scope.clientId] || server.scope.clientId}
          />
        )}
        <Info label="Last Discovered" value={server.lastDiscoveredAt || "Never"} />
        <Info label="Created at" value={server.createdAt} />
        <Info label="Updated at" value={server.updatedAt} />
      </div>

      <div className="stack">
        {/* Connection Card */}
        <div className="subpanel">
          <div className="subhead">
            <Globe />
            <div>
              <h2>Connection Settings</h2>
              <p className="muted">
                Transport protocol and endpoint address.
              </p>
            </div>
          </div>
          <Info label="Transport" value={pretty(server.connection.transport)} />
          <Info
            label="URL"
            value={
              server.connection.url ? (
                <code style={{ fontSize: "11px" }}>{server.connection.url}</code>
              ) : (
                "stdio process"
              )
            }
          />
          <Info
            label="Discovered Tools"
            value={`${serverTools.length} tools registered`}
          />
          <button className="btn secondary full" onClick={onSyncTools}>
            <RefreshCw size={14} /> Sync & Discover Tools Now
          </button>
        </div>

        {/* Authentication Card */}
        <div className="subpanel">
          <div className="subhead">
            <ShieldCheck />
            <div>
              <h2>Authentication</h2>
              <p className="muted">
                Security and credentials management.
              </p>
            </div>
          </div>
          <Info label="Auth Type" value={pretty(server.authentication.type)} />
          <Info
            label="Secret Isolation"
            value={
              <Badge tone="success">
                {server.scope.type === "platform"
                  ? "Isolated per client at runtime"
                  : "Tenant isolated"}
              </Badge>
            }
          />
        </div>
      </div>
    </div>
  );
}
