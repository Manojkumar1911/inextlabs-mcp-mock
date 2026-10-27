import React from "react";
import { RefreshCw, Search } from "lucide-react";
import { Status } from "../../../../shared/components/common/UIComponents";
import { pretty } from "../../data/seedData";

export function ToolsRegistryTab({
  server,
  serverTools = [],
  toolSearch,
  setToolSearch,
  onSyncTools,
  onSelectTool,
}) {
  return (
    <>
      <div className="panelhead inner">
        <div>
          <h2>Discovered Tools</h2>
          <p>
            Tools advertised by <code>{server.name}</code> with their schemas and operational status.
          </p>
        </div>
        <button className="btn secondary" onClick={onSyncTools}>
          <RefreshCw size={14} /> Re-sync from Endpoint
        </button>
      </div>

      <div className="search toolsearch">
        <Search />
        <input
          value={toolSearch}
          onChange={(e) => setToolSearch(e.target.value)}
          placeholder="Search discovered tools by name or description..."
        />
      </div>

      <div className="tablewrap">
        <table className="tooltable">
          <thead>
            <tr>
              <th>TOOL</th>
              <th>DESCRIPTION</th>
              <th>STATUS</th>
              <th>INPUT SCHEMA</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {serverTools
              .filter((t) =>
                `${t.name} ${t.description} ${t.mcpToolId}`
                  .toLowerCase()
                  .includes(toolSearch.toLowerCase())
              )
              .map((t) => {
                const isUnavailable = t.status === "unavailable";
                const isFlaggedInAllowlist =
                  isUnavailable && t.agentAllowlists && t.agentAllowlists.length > 0;

                return (
                  <tr key={t.mcpToolId}>
                    <td>
                      <b>{t.name}</b>
                      <small className="sub">ID: {t.mcpToolId}</small>
                    </td>
                    <td>
                      <div>{t.description}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <Status value={t.status} prettyFn={pretty} />
                        {isFlaggedInAllowlist && (
                          <span
                            className="allowlist-badge"
                            title={`Tool is unavailable but referenced in agent allowlist: ${t.agentAllowlists.join(
                              ", "
                            )}`}
                          >
                            ⚠️ Allowlist: {t.agentAllowlists.join(", ")}
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Input Schema Preview */}
                    <td>
                      <div className="chips">
                        {Object.entries(t.inputSchema?.properties || {}).map(([k, v]) => (
                          <span key={k} title={v.description || k}>
                            {k} <em>({v.type})</em>
                            {t.inputSchema?.required?.includes(k) && (
                              <b style={{ color: "#dc2626" }}>*</b>
                            )}
                          </span>
                        ))}
                        {!Object.keys(t.inputSchema?.properties || {}).length && (
                          <small style={{ color: "#8a92a0" }}>None</small>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn secondary small"
                        onClick={() => onSelectTool(t)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}
