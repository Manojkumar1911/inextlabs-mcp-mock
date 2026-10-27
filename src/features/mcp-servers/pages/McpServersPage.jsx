import React, { useState, useMemo } from "react";
import { CircleHelp, X, Bot, Bell, Settings, Menu, ChevronRight } from "lucide-react";
import {
  seedServers,
  seedTools,
  seedToolConfigs,
  clients,
} from "../data/seedData";
import { Sidebar } from "../components/layout/Sidebar";
import { ServersContainer } from "../components/server-list/ServersContainer";
import { ServerDetailsContainer } from "../components/server-details/ServerDetailsContainer";
import { WizardContainer } from "../components/server-wizard/WizardContainer";
import { ToolModal } from "../components/tool-inspector/ToolModal";
import { DeleteConfirmationModal } from "../../../shared/components/common/DeleteConfirmationModal";
import { AccessManagementContainer } from "../../access-management/AccessManagementContainer";

export function McpServersPage() {
  const [servers, setServers] = useState(seedServers);
  const [tools, setTools] = useState(seedTools);
  const [toolConfigs, setToolConfigs] = useState(seedToolConfigs);

  const [selectedId, setSelectedId] = useState("mcp-001");
  const [page, setPage] = useState("list"); // "list" | "details" | "wizard"
  const [tab, setTab] = useState("Overview");

  // Filters
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [transport, setTransport] = useState("all");
  const [view] = useState("cards");

  const [nav, setNav] = useState(false);
  const [activeNav, setActiveNav] = useState("roles"); // "roles" | "permissions" | "assignments" | "mcp-servers"
  const [accessManagementOpen, setAccessManagementOpen] = useState(true);
  const [aiServicesOpen, setAiServicesOpen] = useState(true);
  const [notice, setNotice] = useState("");

  // Activity logs
  const [activity, setActivity] = useState([
    {
      id: "act-1",
      title: "Tools Schema Synchronized",
      detail: "Discovered 3 tools from endpoint https://example.com/mcp",
      time: "Oct 13, 2026 · 09:00 AM",
    },
    {
      id: "act-2",
      title: "Agent Override Created",
      detail: "Configured maxResults: 25 for sales-agent on getCustomer",
      time: "Oct 13, 2026 · 09:02 AM",
    },
    {
      id: "act-3",
      title: "Server Registered",
      detail: "AutoCount MCP server registered under client-123 (iTrade)",
      time: "Oct 08, 2026 · 10:00 AM",
    },
  ]);

  const log = (title, detail) => {
    setActivity((prev) => [
      { id: `act-${Date.now()}`, title, detail, time: "Just now" },
      ...prev,
    ]);
  };

  const blankServer = () => ({
    name: "",
    mcpId: "",
    description: "",
    scopeType: "client",
    clientId: "client-123",
    status: "active",
    version: "1",
    connection: { transport: "streamableHttp", url: "https://example.com/mcp" },
    authentication: { type: "oauth2", credentialReference: "" },
    selectedToolIds: ["getCustomer", "getProduct"],
    toolConfigsMap: {
      getCustomer: { includeInactive: false, maxResults: 100 },
      getProduct: { warehouseId: "WH-NORTH", maxResults: 50 },
    },
    toolSchemasMap: {
      getCustomer: [
        { id: "f-1", name: "customerId", type: "Text", required: true, description: "Unique customer identifier" },
        { id: "f-2", name: "includeInactive", type: "Yes/No", required: false, description: "Include inactive accounts" },
        { id: "f-3", name: "maxResults", type: "Number", required: false, description: "Batch fetch limit" },
      ],
      getProduct: [
        { id: "f-4", name: "productCode", type: "Text", required: true, description: "SKU or product code" },
        { id: "f-5", name: "warehouseId", type: "Text", required: false, description: "Target warehouse code" },
        { id: "f-6", name: "maxResults", type: "Number", required: false, description: "Batch fetch limit" },
      ],
      searchAccounts: [
        { id: "f-7", name: "query", type: "Text", required: true, description: "Account name or domain search query" },
        { id: "f-8", name: "maxResults", type: "Number", required: false, description: "Maximum accounts returned" },
      ],
    },
    expandedConfigTool: null,
  });

  const [form, setForm] = useState(blankServer());
  const [expandedSchemaFieldIds, setExpandedSchemaFieldIds] = useState({});
  const [step, setStep] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [connectionVerified, setConnectionVerified] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Tool Modal
  const [selectedTool, setSelectedTool] = useState(null);
  const [toolSearch, setToolSearch] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const openDeleteModal = (target = null) => {
    setDeleteConfirmText("");
    if (target) {
      setDeleteTarget(target);
    } else {
      setConfirm(true);
    }
  };

  const closeDeleteModal = () => {
    setConfirm(false);
    setDeleteTarget(null);
    setDeleteConfirmText("");
  };

  const toggleServerStatus = (id) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s._id === id) {
          const nextStatus = s.status === "active" ? "inactive" : "active";
          setNotice(`MCP Server "${s.name}" is now ${nextStatus}.`);
          log(`Server ${nextStatus === "active" ? "Activated" : "Deactivated"}`, `${s.name} status changed to ${nextStatus}.`);
          return { ...s, status: nextStatus, updatedAt: "Just now" };
        }
        return s;
      })
    );
  };

  const selected = servers.find((s) => s._id === selectedId) || servers[0] || {};
  const selectedServerTools = tools.filter((t) => t.mcpId === selected?.mcpId);

  const filtered = useMemo(() => {
    return servers.filter((s) => {
      const q = search.trim().toLowerCase();
      const clientName = (clients[s.scope.clientId] || "").toLowerCase();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.mcpId.toLowerCase().includes(q) ||
        (s.connection.url || "").toLowerCase().includes(q) ||
        clientName.includes(q);

      const matchesScope =
        scopeFilter === "all" ||
        (scopeFilter === "platform" && s.scope.type === "platform") ||
        (scopeFilter !== "platform" && s.scope.clientId === scopeFilter);

      const matchesStatus = status === "all" || s.status === status;
      const matchesTransport = transport === "all" || s.connection.transport === transport;

      return matchesSearch && matchesScope && matchesStatus && matchesTransport;
    });
  }, [servers, search, scopeFilter, status, transport]);

  const details = (id) => {
    setSelectedId(id);
    setTab("Overview");
    setPage("details");
    setNotice("");
  };

  const create = () => {
    setForm(blankServer());
    setEditing(false);
    setEditId(null);
    setStep(0);
    setConnectionVerified(false);
    setIsTesting(false);
    setPage("wizard");
    setNotice("");
  };

  const edit = (s) => {
    s = s || selected;
    const serverTools = tools.filter((t) => t.mcpId === s.mcpId);
    const configsMap = {};
    const schemasMap = {};
    const enabledIds = [];
    serverTools.forEach((t) => {
      const cfg = toolConfigs.find((c) => c.mcpToolId === t.mcpToolId);
      if (t.status === "active") enabledIds.push(t.name);
      configsMap[t.name] = cfg?.config ? { ...cfg.config } : {};

      const existingParams = [];
      let idx = 1;
      if (t.inputSchema?.properties) {
        Object.entries(t.inputSchema.properties).forEach(([propKey, propVal]) => {
          const rawType = (propVal.type || "string").toLowerCase();
          const mappedType =
            rawType === "number" || rawType === "integer"
              ? "Number"
              : rawType === "boolean"
              ? "Yes/No"
              : rawType === "date"
              ? "Date"
              : "Text";
          existingParams.push({
            id: `p-${t.name}-${idx++}`,
            name: propKey,
            type: mappedType,
            required: (t.inputSchema.required || []).includes(propKey),
            description: propVal.description || "",
          });
        });
      }
      schemasMap[t.name] =
        existingParams.length > 0
          ? existingParams
          : [
              {
                id: `p-${t.name}-1`,
                name: "query",
                type: "Text",
                required: true,
                description: "Search or query parameter",
              },
            ];
    });

    setForm({
      name: s.name,
      mcpId: s.mcpId,
      description: s.description,
      scopeType: s.scope.type,
      clientId: s.scope.clientId || "client-123",
      status: s.status,
      version: String(s.version),
      connection: { ...s.connection },
      authentication: { ...s.authentication },
      selectedToolIds: enabledIds.length > 0 ? enabledIds : serverTools.map((t) => t.name),
      toolConfigsMap: configsMap,
      toolSchemasMap: schemasMap,
      expandedConfigTool: null,
    });
    setEditing(true);
    setEditId(s._id);
    setStep(0);
    setConnectionVerified(false);
    setIsTesting(false);
    setPage("wizard");
    setNotice("");
  };

  const testConnection = () => {
    if (
      form.connection.transport !== "stdio" &&
      !/^https?:\/\/.+/.test(form.connection.url)
    ) {
      return setNotice("Enter a valid HTTP or HTTPS connection URL before testing.");
    }
    setNotice("");
    setIsTesting(true);

    setTimeout(() => {
      setIsTesting(false);
      setConnectionVerified(true);
      setNotice("Connection test successful! Endpoint verified and tools discovered.");
      setStep(2);
    }, 900);
  };

  const next = () => {
    if (step === 0 && (!form.name.trim() || !form.mcpId.trim())) {
      return setNotice("MCP server name and MCP ID are required.");
    }
    if (
      step === 1 &&
      form.connection.transport !== "stdio" &&
      !/^https?:\/\/.+/.test(form.connection.url)
    ) {
      return setNotice("Enter a valid HTTP or HTTPS connection URL.");
    }
    setNotice("");
    setStep((s) => Math.min(3, s + 1));
  };

  const save = () => {
    if (!form.name.trim() || !form.mcpId.trim()) {
      setNotice("MCP server name and MCP ID are required.");
      setStep(0);
      return;
    }
    if (servers.some((s) => s.mcpId.toLowerCase() === form.mcpId.toLowerCase() && s._id !== editId)) {
      setNotice("MCP ID must be unique across the platform.");
      setStep(0);
      return;
    }
    if (form.connection.transport !== "stdio" && !/^https?:\/\/.+/.test(form.connection.url)) {
      setNotice("Enter a valid connection URL.");
      setStep(1);
      return;
    }

    const s = {
      _id: editId || `mcp-${Date.now()}`,
      mcpId: form.mcpId,
      name: form.name,
      description: form.description,
      version: Number(form.version) || 1,
      scope:
        form.scopeType === "platform"
          ? { type: "platform" }
          : { type: "client", clientId: form.clientId },
      status: form.status,
      connection: { ...form.connection },
      authentication: { ...form.authentication },
      lastDiscoveredAt: editing
        ? servers.find((x) => x._id === editId)?.lastDiscoveredAt || "Never"
        : "Just now",
      createdAt: editing
        ? servers.find((x) => x._id === editId)?.createdAt || "Just now"
        : "Just now",
      updatedAt: "Just now",
    };

    setServers((old) => (editing ? old.map((x) => (x._id === editId ? s : x)) : [s, ...old]));

    setSelectedId(s._id);
    setPage("details");
    setTab("Overview");
    setNotice(editing ? "MCP server updated." : "MCP server registered in mock mode.");
    log(
      editing ? "MCP server updated" : "MCP server registered",
      `${s.name} (${s.mcpId}) registered with ${(form.selectedToolIds || []).length} enabled tools.`
    );
  };

  const syncTools = () => {
    const timeStr = "Just now";
    setServers((old) =>
      old.map((s) => (s._id === selectedId ? { ...s, lastDiscoveredAt: timeStr } : s))
    );
    setTools((old) =>
      old.map((t) => (t.mcpId === selected.mcpId ? { ...t, lastDiscoveredAt: timeStr } : t))
    );
    setNotice(`Discovered ${selectedServerTools.length} advertised tools from ${selected.connection.url}.`);
    log(
      "Tools Discovered",
      `Queried ${selected.name} endpoint; synced ${selectedServerTools.length} tool definitions.`
    );
  };

  const tabs = ["Overview", "Tools Registry", "Connection & Auth", "Activity", "Settings"];
  const steps = [
    "Basic Information",
    "Connection & Authentication",
    "Tools & Discovery",
    "Review & Create",
  ];

  return (
    <div className="shell" onClick={() => openMenuId && setOpenMenuId(null)}>
      {/* Top Header */}
      <header className="top">
        <button className="icon mobile" onClick={() => setNav(!nav)}>
          <Menu />
        </button>
        <div className="brand">
          <Bot size={22} />
        </div>
        <b className="brandname">iNextLabs</b>
        <span className="sep" />
        <b className="portal">Management Portal</b>
        <div className="topright">
          <button className="icon">
            <CircleHelp />
          </button>
          <button className="icon">
            <Bell />
          </button>
          <button className="icon">
            <Settings />
          </button>
          <div className="avatar">MS</div>
          <div className="profile">
            <b>Manoj Kumar S</b>
            <small>Admin</small>
          </div>
        </div>
      </header>

      <div className="body">
        {/* Sidebar */}
        <Sidebar
          navOpen={nav}
          aiServicesOpen={aiServicesOpen}
          setAiServicesOpen={setAiServicesOpen}
          accessManagementOpen={accessManagementOpen}
          setAccessManagementOpen={setAccessManagementOpen}
          activeView={activeNav}
          onNavigate={(target) => {
            setActiveNav(target);
            if (target === "mcp-servers") {
              setPage("list");
              setNotice("");
            }
          }}
        />

        {/* Main Content Area */}
        <main className="main">
          {activeNav === "mcp-servers" ? (
            <>
              {/* Breadcrumb matching previous commit exactly */}
              <div className="crumb">
            Home <ChevronRight /> AI Services <ChevronRight /> MCP Servers <ChevronRight />{" "}
            <b>
              {page === "list"
                ? "Registry"
                : page === "wizard"
                ? editing
                  ? "Edit MCP Server"
                  : "Register MCP Server"
                : selected.name}
            </b>
          </div>

          {notice && (
            <div className="notice">
              <span>
                <CircleHelp size={15} />
                {notice}
              </span>
              <button onClick={() => setNotice("")}>
                <X size={14} />
              </button>
            </div>
          )}

          {page === "list" && (
            <ServersContainer
              servers={servers}
              filteredServers={filtered}
              tools={tools}
              toolConfigs={toolConfigs}
              view={view}
              search={search}
              setSearch={setSearch}
              scopeFilter={scopeFilter}
              setScopeFilter={setScopeFilter}
              status={status}
              setStatus={setStatus}
              transport={transport}
              setTransport={setTransport}
              onResetFilters={() => {
                setSearch("");
                setScopeFilter("all");
                setStatus("all");
                setTransport("all");
              }}
              onCreate={create}
              onDetails={details}
              onEdit={edit}
              onDelete={openDeleteModal}
              onToggleStatus={toggleServerStatus}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
            />
          )}

          {page === "details" && (
            <ServerDetailsContainer
              server={selected}
              tab={tab}
              setTab={setTab}
              tabs={tabs}
              serverTools={selectedServerTools}
              toolSearch={toolSearch}
              setToolSearch={setToolSearch}
              activity={activity}
              onBack={() => setPage("list")}
              onToggleStatus={toggleServerStatus}
              onEdit={edit}
              onDelete={openDeleteModal}
              onSyncTools={syncTools}
              onSelectTool={(t) => setSelectedTool(t)}
              onUpdateConnection={(field, val) =>
                setServers((old) =>
                  old.map((s) =>
                    s._id === selectedId
                      ? { ...s, connection: { ...s.connection, [field]: val } }
                      : s
                  )
                )
              }
              onUpdateAuth={(field, val) =>
                setServers((old) =>
                  old.map((s) =>
                    s._id === selectedId
                      ? { ...s, authentication: { ...s.authentication, [field]: val } }
                      : s
                  )
                )
              }
              onTestConnection={() => setNotice("Connection check simulated successfully.")}
              onSaveConnectionSettings={() => setNotice("Connection & auth settings saved locally.")}
            />
          )}

              {page === "wizard" && (
                <WizardContainer
                  editing={editing}
                  step={step}
                  setStep={setStep}
                  steps={steps}
                  form={form}
                  setForm={setForm}
                  connectionVerified={connectionVerified}
                  setConnectionVerified={setConnectionVerified}
                  isTesting={isTesting}
                  testConnection={testConnection}
                  selectedServerTools={selectedServerTools}
                  expandedSchemaFieldIds={expandedSchemaFieldIds}
                  setExpandedSchemaFieldIds={setExpandedSchemaFieldIds}
                  onCancel={() => setPage(editing ? "details" : "list")}
                  onNext={next}
                  onSave={save}
                />
              )}
            </>
          ) : (
            <AccessManagementContainer
              page={activeNav}
              onPage={setActiveNav}
            />
          )}
        </main>
      </div>

      {/* Tool Modal (Inspector) */}
      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          server={selected}
          onClose={() => setSelectedTool(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {(confirm || deleteTarget) && (
        <DeleteConfirmationModal
          isOpen={Boolean(confirm || deleteTarget)}
          onClose={closeDeleteModal}
          targetServer={deleteTarget || selected}
          deleteConfirmText={deleteConfirmText}
          setDeleteConfirmText={setDeleteConfirmText}
          clients={clients}
          toolCount={tools.filter((t) => t.mcpId === (deleteTarget || selected)?.mcpId).length || 3}
          onConfirmDelete={() => {
            const target = deleteTarget || selected;
            const targetId = target?._id;
            const targetName = target?.name || "MCP Server";
            setServers((old) => old.filter((s) => s._id !== targetId));
            closeDeleteModal();
            if (page === "details" && selectedId === targetId) {
              setPage("list");
            }
            setNotice(`MCP Server "${targetName}" removed from registry.`);
          }}
        />
      )}
    </div>
  );
}
