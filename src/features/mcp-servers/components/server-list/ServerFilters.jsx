import React from "react";
import { Search, RefreshCw } from "lucide-react";

export function ServerFilters({
  search,
  setSearch,
  scopeFilter,
  setScopeFilter,
  status,
  setStatus,
  transport,
  setTransport,
  onReset,
}) {
  return (
    <>
      <div className="panelhead">
        <div>
          <h2>MCP Server Endpoints</h2>
          <p>Search, filter and inspect connection parameters and tool discovery status.</p>
        </div>
        <button className="btn subtle" onClick={onReset}>
          <RefreshCw /> Reset filters
        </button>
      </div>

      <div className="filters">
        <div className="search">
          <Search />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by server name, MCP ID, client scope, or URL..."
          />
        </div>
        <select value={scopeFilter} onChange={(e) => setScopeFilter(e.target.value)}>
          <option value="all">All scopes</option>
          <option value="platform">Platform (Shared)</option>
          <option value="client-123">iTrade (client-123)</option>
          <option value="client-001">iNextLabs (client-001)</option>
          <option value="client-456">Client ABC (client-456)</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select value={transport} onChange={(e) => setTransport(e.target.value)}>
          <option value="all">All transports</option>
          <option value="streamableHttp">Streamable HTTP</option>
          <option value="sse">SSE</option>
          <option value="stdio">STDIO</option>
        </select>
      </div>
    </>
  );
}
