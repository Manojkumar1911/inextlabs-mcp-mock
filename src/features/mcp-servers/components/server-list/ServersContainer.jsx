import React from "react";
import { Search } from "lucide-react";
import { ServersHeader, ServerStats } from "./ServerStats";
import { ServerFilters } from "./ServerFilters";
import { ServerCard } from "./ServerCard";
import { ServersTable } from "./ServersTable";

export function ServersContainer({
  servers = [],
  filteredServers = [],
  tools = [],
  toolConfigs = [],
  view = "cards",
  search,
  setSearch,
  scopeFilter,
  setScopeFilter,
  status,
  setStatus,
  transport,
  setTransport,
  onResetFilters,
  onCreate,
  onDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  openMenuId,
  setOpenMenuId,
}) {
  return (
    <section className="page">
      <ServersHeader onCreate={onCreate} />

      <ServerStats servers={servers} tools={tools} toolConfigs={toolConfigs} />

      <div className="panel">
        <ServerFilters
          search={search}
          setSearch={setSearch}
          scopeFilter={scopeFilter}
          setScopeFilter={setScopeFilter}
          status={status}
          setStatus={setStatus}
          transport={transport}
          setTransport={setTransport}
          onReset={onResetFilters}
        />

        {view === "cards" ? (
          <div className="cards">
            {filteredServers.map((s) => (
              <ServerCard
                key={s._id}
                server={s}
                serverTools={tools.filter((t) => t.mcpId === s.mcpId)}
                onDetails={onDetails}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <ServersTable
            servers={filteredServers}
            tools={tools}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            onDetails={onDetails}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        )}

        {!filteredServers.length && (
          <div className="empty">
            <Search />
            <b>No MCP servers found</b>
            <p>Try changing your search or filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}
