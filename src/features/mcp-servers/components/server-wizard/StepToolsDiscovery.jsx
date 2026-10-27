import React from "react";
import {
  ShieldCheck,
  Wrench,
  FileText,
  Trash2,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Badge } from "../../../../shared/components/common/UIComponents";

export function StepToolsDiscovery({
  form,
  setForm,
  editing,
  selectedServerTools = [],
  expandedSchemaFieldIds = {},
  setExpandedSchemaFieldIds,
}) {
  const previewTools =
    editing && selectedServerTools.length > 0
      ? selectedServerTools
      : [
          {
            name: "getCustomer",
            mcpToolId: `${form.mcpId || "mcp"}-get-customer`,
            description: "Retrieve customer details and account status.",
            status: "active",
            inputSchema: { properties: { customerId: { type: "string", description: "Customer unique ID" } } },
            configSchema: {
              properties: {
                includeInactive: { type: "boolean", description: "Include inactive accounts" },
                maxResults: { type: "number", description: "Batch fetch limit" },
              },
            },
          },
          {
            name: "getProduct",
            mcpToolId: `${form.mcpId || "mcp"}-get-product`,
            description: "Query catalog products, inventory levels, and pricing.",
            status: "active",
            inputSchema: { properties: { productCode: { type: "string", description: "Item SKU code" } } },
            configSchema: {
              properties: {
                warehouseId: { type: "string", description: "Target warehouse code" },
                maxResults: { type: "number", description: "Batch fetch limit" },
              },
            },
          },
        ];

  const getToolParams = (toolName, toolObj) => {
    if (form.toolSchemasMap && form.toolSchemasMap[toolName]) {
      return form.toolSchemasMap[toolName];
    }
    const params = [];
    let idx = 1;
    if (toolObj?.inputSchema?.properties) {
      Object.entries(toolObj.inputSchema.properties).forEach(([k, v]) => {
        const rawType = (v.type || "string").toLowerCase();
        const mappedType =
          rawType === "number" || rawType === "integer"
            ? "Number"
            : rawType === "boolean"
            ? "Yes/No"
            : rawType === "date"
            ? "Date"
            : "Text";
        params.push({
          id: `p-${toolName}-${idx++}`,
          name: k,
          type: mappedType,
          required: (toolObj.inputSchema.required || []).includes(k),
          description: v.description || "",
        });
      });
    }
    return params.length > 0
      ? params
      : [
          {
            id: `p-${toolName}-1`,
            name: "query",
            type: "Text",
            required: true,
            description: "Search or query parameter",
          },
        ];
  };

  const updateToolParams = (toolName, updater) => {
    setForm((f) => {
      const current =
        f.toolSchemasMap?.[toolName] ||
        getToolParams(toolName, previewTools.find((x) => x.name === toolName));
      const nextParams = typeof updater === "function" ? updater(current) : updater;
      return {
        ...f,
        toolSchemasMap: {
          ...(f.toolSchemasMap || {}),
          [toolName]: nextParams,
        },
      };
    });
  };

  return (
    <>
      <div className="stepheading">
        <h2>Tools & Discovery</h2>
        <p>
          Tools are discovered automatically from the MCP server endpoint. Review and customize their parameter schemas below.
        </p>
      </div>

      <div
        className="callout"
        style={{ background: "#f0fdf4", borderColor: "#bbf7d0", color: "#166534" }}
      >
        <ShieldCheck />
        <div>
          <b>Automatic Discovery:</b> When this server is registered, the platform probes{" "}
          <code>{form.connection.url || "endpoint"}</code> via MCP protocol to discover available tools and their parameter schemas.
        </div>
      </div>

      <div className="toolstephead">
        <Badge tone="info">{previewTools.length} Discovered Tools</Badge>
        <span className="muted">
          All advertised tools are automatically registered with this MCP server
        </span>
      </div>

      {previewTools.map((t) => {
        const isConfigOpen = form.expandedConfigTool === t.name;
        const toolParams = getToolParams(t.name, t);

        return (
          <div className="wizardtool" key={t.mcpToolId}>
            <div className="wizardtoolhead">
              <div className="toolicon">
                <Wrench />
              </div>
              <div className="toolname">
                <b>{t.name}</b>
                <small>ID: {t.mcpToolId} · {t.description}</small>
              </div>
              <button
                type="button"
                className="btn secondary small"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    expandedConfigTool: f.expandedConfigTool === t.name ? null : t.name,
                  }))
                }
              >
                <FileText size={13} /> {isConfigOpen ? "Close Schema" : "Define Schema"}
              </button>
            </div>

            {isConfigOpen && (
              <div className="schema-builder-panel">
                <div className="schema-builder-head">
                  <div>
                    <h4>Define parameter schema</h4>
                    <p>Define the fields and parameters for this tool</p>
                  </div>
                  <div className="schema-builder-actions">
                    {toolParams.length > 0 && (
                      <button
                        type="button"
                        className="schema-clear-btn"
                        title="Clear all parameters"
                        onClick={() => updateToolParams(t.name, [])}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn primary small"
                      onClick={() =>
                        updateToolParams(t.name, (prev) => [
                          ...prev,
                          {
                            id: `p-${Date.now()}`,
                            name: "",
                            type: "Text",
                            required: false,
                            description: "",
                          },
                        ])
                      }
                    >
                      <Plus size={13} /> Add Parameter
                    </button>
                  </div>
                </div>

                <div className="schema-fields-list">
                  {toolParams.length === 0 ? (
                    <div className="schema-empty-state">
                      <p>No parameters defined yet for this tool.</p>
                      <button
                        type="button"
                        className="btn secondary small"
                        style={{ marginTop: "8px" }}
                        onClick={() =>
                          updateToolParams(t.name, [
                            {
                              id: `p-${Date.now()}`,
                              name: "query",
                              type: "Text",
                              required: true,
                              description: "Search or query parameter",
                            },
                          ])
                        }
                      >
                        <Plus size={13} /> Add First Parameter
                      </button>
                    </div>
                  ) : (
                    toolParams.map((param, pIdx) => {
                      const isRowExpanded = Boolean(expandedSchemaFieldIds[param.id]);
                      return (
                        <div
                          key={param.id || pIdx}
                          className={`schema-field-card ${isRowExpanded ? "expanded" : ""}`}
                        >
                          <div className="schema-field-row">
                            <div className="schema-drag-handle" title="Drag to reorder">
                              <GripVertical size={14} />
                            </div>
                            <div className="schema-idx-pill">{pIdx + 1}</div>
                            <input
                              type="text"
                              className="schema-field-name-input"
                              value={param.name}
                              placeholder="Parameter Name"
                              onChange={(e) => {
                                const val = e.target.value;
                                updateToolParams(t.name, (prev) =>
                                  prev.map((p, i) => (i === pIdx ? { ...p, name: val } : p))
                                );
                              }}
                            />

                            <div className="schema-type-select-wrap">
                              <select
                                className="schema-type-select"
                                value={param.type}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateToolParams(t.name, (prev) =>
                                    prev.map((p, i) => (i === pIdx ? { ...p, type: val } : p))
                                  );
                                }}
                              >
                                <option value="Text">T Text</option>
                                <option value="Number"># Number</option>
                                <option value="Date">📅 Date</option>
                                <option value="Yes/No">👁 Yes/No</option>
                              </select>
                            </div>

                            <label className="schema-required-label">
                              <input
                                type="checkbox"
                                checked={Boolean(param.required)}
                                onChange={() => {
                                  updateToolParams(t.name, (prev) =>
                                    prev.map((p, i) =>
                                      i === pIdx ? { ...p, required: !p.required } : p
                                    )
                                  );
                                }}
                              />
                              <span>Required</span>
                            </label>

                            <button
                              type="button"
                              className="schema-delete-btn"
                              title="Delete parameter"
                              onClick={() =>
                                updateToolParams(t.name, (prev) =>
                                  prev.filter((_, i) => i !== pIdx)
                                )
                              }
                            >
                              <Trash2 size={15} />
                            </button>

                            <button
                              type="button"
                              className="schema-expand-btn"
                              title={isRowExpanded ? "Collapse" : "Expand instructions"}
                              onClick={() =>
                                setExpandedSchemaFieldIds((prev) => ({
                                  ...prev,
                                  [param.id]: !prev[param.id],
                                }))
                              }
                            >
                              {isRowExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          </div>

                          {isRowExpanded && (
                            <div className="schema-field-expanded">
                              <div className="schema-instruction-group">
                                <label className="schema-instruction-label">
                                  PARAMETER INSTRUCTIONS *
                                </label>
                                <textarea
                                  rows="2"
                                  className="schema-instruction-input"
                                  value={param.description || ""}
                                  placeholder={`Enter instructions or description for ${
                                    param.name || "this parameter"
                                  }...`}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateToolParams(t.name, (prev) =>
                                      prev.map((p, i) =>
                                        i === pIdx ? { ...p, description: val } : p
                                      )
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
