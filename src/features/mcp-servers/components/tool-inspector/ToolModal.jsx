import React from "react";
import { Tag, AlertCircle, X } from "lucide-react";
import { Badge, Status } from "../../../../shared/components/common/UIComponents";
import { pretty } from "../../data/seedData";

export function ToolModal({ tool, server, onClose }) {
  if (!tool) return null;

  const isUnavailable = tool.status === "unavailable";
  const isFlaggedInAllowlist =
    isUnavailable && tool.agentAllowlists && tool.agentAllowlists.length > 0;
  const paramEntries = Object.entries(tool.inputSchema?.properties || {});
  const requiredList = tool.inputSchema?.required || [];

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="toolmodal"
        style={{ maxWidth: "720px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modalhead">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0 }}>{tool.name}</h2>
              <Status value={tool.status} prettyFn={pretty} />
              {tool.schemaVersion && (
                <Badge tone="neutral">v{tool.schemaVersion}</Badge>
              )}
            </div>
            <p style={{ marginTop: "4px", fontSize: "10.5px", color: "#64748b" }}>
              Tool ID: <code style={{ fontSize: "10.5px" }}>{tool.mcpToolId}</code>
              {server?.name && (
                <>
                  {" "}
                  · Server: <b>{server.name}</b> (
                  <code style={{ fontSize: "10px" }}>{tool.mcpId}</code>)
                </>
              )}
            </p>
          </div>
          <button className="icon" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Tool Description */}
          {tool.description && (
            <div
              style={{
                fontSize: "11.5px",
                color: "#334155",
                lineHeight: "1.55",
                background: "#f8fafc",
                padding: "10px 12px",
                borderRadius: "7px",
                border: "1px solid #e2e8f0",
              }}
            >
              {tool.description}
            </div>
          )}

          {/* Unavailable / Allowlist Flag Warning */}
          {isFlaggedInAllowlist && (
            <div
              className="callout"
              style={{
                background: "#fffbeb",
                borderColor: "#fde68a",
                color: "#92400e",
                margin: 0,
              }}
            >
              <AlertCircle size={16} />
              <div>
                <strong style={{ display: "block", marginBottom: "2px" }}>
                  Tool Unavailable & Referenced in Allowlist
                </strong>
                <span>
                  Referenced by Agent allowlist: <b>{tool.agentAllowlists.join(", ")}</b>. Remove
                  this tool from Agent allowlists to avoid execution runtime errors.
                </span>
              </div>
            </div>
          )}

          {/* Input Schema Parameters Section */}
          <div className="schema-section" style={{ margin: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontSize: "11.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Tag size={14} color="#f4513b" /> Input Parameters
              </h4>
              <span style={{ fontSize: "10px", color: "#64748b" }}>
                {paramEntries.length} parameter{paramEntries.length !== 1 ? "s" : ""}
              </span>
            </div>

            {paramEntries.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {paramEntries.map(([paramName, schema]) => {
                  const isRequired = requiredList.includes(paramName);
                  return (
                    <div
                      key={paramName}
                      style={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "7px",
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                          marginBottom: schema.description ? "4px" : "0",
                        }}
                      >
                        <code style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a" }}>
                          {paramName}
                        </code>
                        <span
                          style={{
                            fontSize: "9.5px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: "#f1f5f9",
                            color: "#475569",
                            fontFamily: "monospace",
                          }}
                        >
                          {schema.type || "string"}
                        </span>
                        {isRequired ? (
                          <span
                            style={{
                              fontSize: "9px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: "#fee2e2",
                              color: "#dc2626",
                              fontWeight: 600,
                            }}
                          >
                            Required
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: "9px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: "#f8fafc",
                              color: "#94a3b8",
                            }}
                          >
                            Optional
                          </span>
                        )}
                      </div>
                      {schema.description && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "10.5px",
                            color: "#64748b",
                            lineHeight: "1.4",
                          }}
                        >
                          {schema.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty" style={{ padding: "18px 12px" }}>
                <p style={{ fontSize: "10.5px", color: "#8a92a0", margin: 0 }}>
                  No input parameters defined for this tool.
                </p>
              </div>
            )}
          </div>

          {/* Agent Allowlist */}
          {tool.agentAllowlists && tool.agentAllowlists.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "10.5px",
              }}
            >
              <span style={{ color: "#64748b" }}>Allowed Agents:</span>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {tool.agentAllowlists.map((ag) => (
                  <span
                    key={ag}
                    style={{
                      background: "#f3e8ff",
                      color: "#6b21a8",
                      padding: "2px 7px",
                      borderRadius: "4px",
                      fontSize: "9.5px",
                      fontWeight: 600,
                    }}
                  >
                    {ag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Audit & Discovery Metadata */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "10px",
              color: "#94a3b8",
              paddingTop: "6px",
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <span>Last Discovered: {tool.lastDiscoveredAt || "Recently"}</span>
            <span>Schema v{tool.schemaVersion || "1.0.0"}</span>
          </div>

          {/* Modal Footer Action */}
          <div className="modalactions" style={{ marginTop: "4px", paddingTop: "10px" }}>
            <span className="grow" />
            <button className="btn secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
