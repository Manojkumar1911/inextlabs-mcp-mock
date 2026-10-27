import React from "react";
import { Check } from "lucide-react";
import { Field } from "../../../../shared/components/common/UIComponents";
import { CustomSelect } from "../../../../shared/components/common/CustomSelect";

export function ConnectionAuthTab({
  server,
  onUpdateConnection,
  onUpdateAuth,
  onTestConnection,
  onSave,
}) {
  return (
    <div className="formpanel">
      <h2>Connection Settings</h2>
      <p className="muted">Configure endpoint details and authentication mode.</p>

      <Field label="Transport Type" hint="Transport protocol for this MCP server.">
        <CustomSelect
          value={server.connection.transport}
          onChange={(val) => onUpdateConnection("transport", val)}
        />
      </Field>

      {server.connection.transport !== "stdio" && (
        <Field label="Connection URL" hint="Endpoint advertised by the MCP server.">
          <input
            value={server.connection.url}
            onChange={(e) => onUpdateConnection("url", e.target.value)}
          />
        </Field>
      )}

      <Field label="Authentication Type">
        <select
          value={server.authentication.type}
          onChange={(e) => onUpdateAuth("type", e.target.value)}
        >
          <option value="oauth2">OAuth 2.0</option>
          <option value="apiKey">API Key</option>
          <option value="bearerToken">Bearer Token</option>
          <option value="none">None</option>
        </select>
      </Field>

      <div className="actions">
        <button className="btn secondary" onClick={onTestConnection}>
          Test Connection
        </button>
        <button className="btn primary" onClick={onSave}>
          Save Connection Settings
        </button>
      </div>
    </div>
  );
}

export function ActivityTab({ activity = [] }) {
  return (
    <div className="formpanel">
      <h2>Discovery & Config Activity</h2>
      <p className="muted">Recent schema synchronization and scope modifications.</p>
      {activity.map((a) => (
        <div className="activityrow" key={a.id}>
          <div className="activitydot">
            <Check />
          </div>
          <div>
            <b>{a.title}</b>
            <p>{a.detail}</p>
            <small>{a.time}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SettingsTab({ onDelete }) {
  return (
    <div className="formpanel">
      <h2>Server Settings</h2>
      <p className="muted">Server lifecycle, maintenance, and administrative actions.</p>

      <div className="dangerzone" style={{ marginTop: "1.25rem" }}>
        <h3>Danger Zone</h3>
        <p className="muted">
          Permanently remove this MCP server registration and its tool discovery links.
        </p>
        <button className="btn dangeroutline" onClick={onDelete}>
          Delete MCP Server
        </button>
      </div>
    </div>
  );
}
