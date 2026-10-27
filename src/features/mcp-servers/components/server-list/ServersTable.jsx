import React from "react";
import { Ellipsis, Eye, Pencil, Power, Trash2 } from "lucide-react";
import { Badge, Status } from "../../../../shared/components/common/UIComponents";
import { pretty, clients } from "../../data/seedData";

export function ServersTable({
  servers = [],
  tools = [],
  openMenuId,
  setOpenMenuId,
  onDetails,
  onEdit,
  onToggleStatus,
  onDelete,
}) {
  return (
    <div className="tablewrap">
      <table>
        <thead>
          <tr>
            <th>MCP SERVER</th>
            <th>SCOPE</th>
            <th>TRANSPORT</th>
            <th>ENDPOINT URL</th>
            <th>DISCOVERED TOOLS</th>
            <th>STATUS</th>
            <th>UPDATED</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {servers.map((s) => {
            const serverTools = tools.filter((t) => t.mcpId === s.mcpId);
            const unavail = serverTools.filter((t) => t.status === "unavailable").length;

            return (
              <tr key={s._id}>
                <td>
                  <button className="link" onClick={() => onDetails(s._id)}>
                    {s.name}
                  </button>
                  <small className="sub">{s.mcpId}</small>
                </td>
                <td>
                  {s.scope.type === "platform" ? (
                    <Badge tone="purple">Platform</Badge>
                  ) : (
                    `${clients[s.scope.clientId] || s.scope.clientId}`
                  )}
                </td>
                <td>{pretty(s.connection.transport)}</td>
                <td>
                  <small style={{ fontFamily: "monospace", color: "#475162" }}>
                    {s.connection.url || "stdio"}
                  </small>
                </td>
                <td>
                  <Badge tone={unavail > 0 ? "warning" : "info"}>
                    {serverTools.length} tools {unavail > 0 && `(${unavail} unavailable)`}
                  </Badge>
                </td>
                <td>
                  <Status value={s.status} prettyFn={pretty} />
                </td>
                <td>{s.updatedAt}</td>
                <td>
                  <div className="action-menu-wrap">
                    <button
                      className="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === s._id ? null : s._id);
                      }}
                      title="Server options"
                    >
                      <Ellipsis />
                    </button>
                    {openMenuId === s._id && (
                      <div className="action-dropdown" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="action-dropdown-item"
                          onClick={() => {
                            setOpenMenuId(null);
                            onDetails(s._id);
                          }}
                        >
                          <Eye size={14} /> View Details
                        </button>
                        <button
                          className="action-dropdown-item"
                          onClick={() => {
                            setOpenMenuId(null);
                            onEdit(s);
                          }}
                        >
                          <Pencil size={14} /> Edit Configuration
                        </button>
                        <button
                          className="action-dropdown-item"
                          onClick={() => onToggleStatus(s._id)}
                        >
                          <Power size={14} />
                          {s.status === "active" ? "Deactivate Server" : "Activate Server"}
                        </button>
                        <div className="action-dropdown-sep" />
                        <button
                          className="action-dropdown-item danger"
                          onClick={() => {
                            setOpenMenuId(null);
                            onDelete(s);
                          }}
                        >
                          <Trash2 size={14} /> Delete Server
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
