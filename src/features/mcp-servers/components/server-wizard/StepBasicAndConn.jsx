import React from "react";
import { Field } from "../../../../shared/components/common/UIComponents";
import { TransportSelect } from "../../../../shared/components/common/CustomSelect";

export function StepBasicInfo({ form, setForm }) {
  return (
    <>
      <div className="stepheading">
        <h2>Basic Information</h2>
        <p>
          Define the MCP server identity and specify whether it is tenant-specific or shared platform-wide.
        </p>
      </div>
      <div className="formgrid">
        <Field label="MCP Server Name" required>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. AutoCount MCP"
          />
        </Field>
        <Field label="MCP ID" required hint="Unique, stable identifier (e.g. mcp-autocount)">
          <input
            value={form.mcpId}
            onChange={(e) => setForm({ ...form, mcpId: e.target.value })}
            placeholder="e.g. mcp-autocount"
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          rows="3"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe the systems and resources this MCP server exposes..."
        />
      </Field>

      <div className="formgrid">
        <Field label="Scope Type" required hint="Tenant vs Shared">
          <select
            value={form.scopeType}
            onChange={(e) => setForm({ ...form, scopeType: e.target.value })}
          >
            <option value="client">Client Scope (Tenant-specific)</option>
            <option value="platform">Platform Scope (Shared)</option>
          </select>
        </Field>

        {form.scopeType === "client" ? (
          <Field label="Client" required hint="Target tenant client">
            <select
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            >
              <option value="client-123">iTrade (client-123)</option>
              <option value="client-001">iNextLabs (client-001)</option>
              <option value="client-456">Client ABC (client-456)</option>
            </select>
          </Field>
        ) : (
          <Field label="Platform Scope Notice">
            <input value="Shared integration (tenant credentials isolated)" disabled />
          </Field>
        )}
      </div>
    </>
  );
}

export function StepConnectionAuth({
  form,
  setForm,
  connectionVerified,
  setConnectionVerified,
}) {
  return (
    <>
      <div className="stepheading">
        <h2>Connection & Authentication</h2>
        <p>Configure transport, endpoint location, and authentication mode.</p>
      </div>

      <div className="subpanel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3>Connection Settings</h3>
          {connectionVerified && (
            <span
              className="badge success"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 8px",
                borderRadius: 9999,
                fontSize: "9px",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#16834a",
                  display: "inline-block",
                }}
              />
              Connected
            </span>
          )}
        </div>
        <Field label="Transport" required>
          <TransportSelect
            value={form.connection.transport}
            onChange={(val) => {
              setForm({
                ...form,
                connection: { ...form.connection, transport: val },
              });
              setConnectionVerified(false);
            }}
          />
        </Field>

        {form.connection.transport !== "stdio" && (
          <Field
            label="Server URL"
            required
            hint="Endpoint URL for the MCP server. Use HTTPS in production."
          >
            <input
              value={form.connection.url}
              onChange={(e) => {
                setForm({
                  ...form,
                  connection: { ...form.connection, url: e.target.value },
                });
                setConnectionVerified(false);
              }}
              placeholder="https://example.com/mcp"
            />
          </Field>
        )}
      </div>

      <div className="subpanel">
        <h3>Authentication</h3>
        <Field label="Authentication Type" required>
          <select
            value={form.authentication.type}
            onChange={(e) =>
              setForm({
                ...form,
                authentication: {
                  ...form.authentication,
                  type: e.target.value,
                  credentialReference: "",
                },
              })
            }
          >
            <option value="oauth2">OAuth 2.0</option>
            <option value="apiKey">API Key</option>
            <option value="bearerToken">Bearer Token</option>
            <option value="none">None</option>
          </select>
        </Field>

        {form.authentication.type === "none" && (
          <div className="callout">
            No authentication selected. Ensure this endpoint is restricted by private network.
          </div>
        )}
      </div>
    </>
  );
}
