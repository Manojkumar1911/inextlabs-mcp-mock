import React from "react";
import { Plug, Plus, Server, CheckCircle2, Wrench, Settings } from "lucide-react";

export function ServersHeader({ onCreate }) {
  return (
    <div className="pagehead">
      <div className="headicon">
        <Plug />
      </div>
      <div>
        <h1>MCP Server Registry</h1>
        <p>
          Manage Model Context Protocol server endpoints, discovered tools, and client runtime configs.
        </p>
      </div>
      <button className="btn primary push" onClick={onCreate}>
        <Plus /> Register MCP Server
      </button>
    </div>
  );
}

export function ServerStats({ servers = [], tools = [], toolConfigs = [] }) {
  const activeCount = servers.filter((s) => s.status === "active").length;
  const activeTools = tools.filter((t) => t.status === "active").length;
  const unavailTools = tools.filter((t) => t.status === "unavailable").length;

  const statItems = [
    [Server, "Total MCP Servers", servers.length, "Registered integrations", "orange"],
    [CheckCircle2, "Active Servers", activeCount, "Enabled endpoints", "green"],
    [
      Wrench,
      "Discovered Tools",
      tools.length,
      `${activeTools} active · ${unavailTools} unavailable`,
      "blue",
    ],
    [Settings, "Runtime Configs", toolConfigs.length, "Scoped client/agent overrides", "orange"],
  ];

  return (
    <div className="stats">
      {statItems.map(([I, l, v, sub, c]) => (
        <div className="stat" key={l}>
          <div>
            {l}
            <span className={"staticon " + c}>
              <I />
            </span>
          </div>
          <strong>{v}</strong>
          <small>{sub}</small>
        </div>
      ))}
    </div>
  );
}
