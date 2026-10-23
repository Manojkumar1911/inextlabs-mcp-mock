import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock,
  Database,
  Ellipsis,
  Eye,
  FileText,
  Filter,
  Globe,
  GripVertical,
  Info as InfoIcon,
  LayoutDashboard,
  Link2,
  Menu,
  Pencil,
  Plug,
  Plus,
  Power,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Tag,
  Trash2,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";

// 8. platformDb.mcpServer
const seedServers = [
  {
    _id: "mcp-001",
    mcpId: "mcp-autocount",
    name: "AutoCount MCP",
    description: "MCP server for AutoCount integration.",
    version: 1,
    scope: { type: "client", clientId: "client-123" },
    status: "active",
    connection: { transport: "streamableHttp", url: "https://example.com/mcp" },
    authentication: { type: "oauth2", credentialReference: "secret-autocount-prod" },
    lastDiscoveredAt: "Oct 13, 2026 · 09:00 AM",
    createdAt: "Oct 08, 2026 · 10:00 AM",
    updatedAt: "Oct 13, 2026 · 09:00 AM",
  },
  {
    _id: "mcp-002",
    mcpId: "mcp-salesforce",
    name: "Salesforce MCP",
    description: "Salesforce CRM integration.",
    version: 1,
    scope: { type: "client", clientId: "client-456" },
    status: "active",
    connection: { transport: "streamableHttp", url: "https://salesforce.example.com/mcp" },
    authentication: { type: "oauth2", credentialReference: "secret-salesforce-prod" },
    lastDiscoveredAt: "Oct 12, 2026 · 02:30 PM",
    createdAt: "Oct 07, 2026 · 10:00 AM",
    updatedAt: "Oct 12, 2026 · 02:30 PM",
  },
  {
    _id: "mcp-003",
    mcpId: "mcp-github",
    name: "GitHub MCP",
    description: "GitHub repository and issue integration.",
    version: 2,
    scope: { type: "platform" },
    status: "inactive",
    connection: { transport: "sse", url: "https://github.example.com/sse" },
    authentication: { type: "apiKey", credentialReference: "secret-github-token" },
    lastDiscoveredAt: "Oct 10, 2026 · 11:00 AM",
    createdAt: "Oct 02, 2026 · 08:00 AM",
    updatedAt: "Oct 10, 2026 · 11:00 AM",
  },
  {
    _id: "mcp-004",
    mcpId: "mcp-slack",
    name: "Slack MCP",
    description: "Slack workspace messaging integration.",
    version: 1,
    scope: { type: "client", clientId: "client-001" },
    status: "active",
    connection: { transport: "streamableHttp", url: "https://slack.example.com/mcp" },
    authentication: { type: "oauth2", credentialReference: "secret-slack-prod" },
    lastDiscoveredAt: "Oct 14, 2026 · 08:00 AM",
    createdAt: "Sep 29, 2026 · 11:00 AM",
    updatedAt: "Oct 14, 2026 · 08:00 AM",
  },
];

// 9. platformDb.mcptools
const seedTools = [
  {
    _id: "mcptool-001",
    mcpToolId: "autocount-get-customer",
    mcpId: "mcp-autocount",
    name: "getCustomer",
    description: "Retrieve customer information from AutoCount.",
    status: "active",
    schemaVersion: 1,
    inputSchema: {
      type: "object",
      properties: {
        customerId: { type: "string", description: "Unique customer identifier" },
      },
      required: ["customerId"],
      additionalProperties: false,
    },
    configSchema: {
      type: "object",
      properties: {
        includeInactive: { type: "boolean", description: "Include inactive accounts" },
        maxResults: { type: "number", description: "Maximum records returned" },
      },
      required: ["includeInactive", "maxResults"],
      additionalProperties: false,
    },
    lastDiscoveredAt: "Oct 13, 2026 · 09:00 AM",
    createdAt: "Oct 08, 2026",
    updatedAt: "Oct 13, 2026",
    agentAllowlists: ["sales-agent", "support-bot"],
  },
  {
    _id: "mcptool-002",
    mcpToolId: "autocount-get-product",
    mcpId: "mcp-autocount",
    name: "getProduct",
    description: "Retrieve product details from AutoCount.",
    status: "active",
    schemaVersion: 1,
    inputSchema: {
      type: "object",
      properties: {
        productCode: { type: "string", description: "SKU or product code" },
      },
      required: ["productCode"],
      additionalProperties: false,
    },
    configSchema: {
      type: "object",
      properties: {
        warehouseId: { type: "string", description: "Target warehouse code" },
        maxResults: { type: "number", description: "Batch fetch limit" },
      },
      required: ["maxResults"],
      additionalProperties: false,
    },
    lastDiscoveredAt: "Oct 13, 2026 · 09:00 AM",
    createdAt: "Oct 08, 2026",
    updatedAt: "Oct 13, 2026",
    agentAllowlists: ["catalog-agent"],
  },
  {
    _id: "mcptool-003",
    mcpToolId: "autocount-create-invoice",
    mcpId: "mcp-autocount",
    name: "createInvoice",
    description: "Generate a draft invoice in AutoCount.",
    status: "unavailable", // Upstream removed or broken
    schemaVersion: 1,
    inputSchema: {
      type: "object",
      properties: {
        customerId: { type: "string", description: "Customer account ID" },
        amount: { type: "number", description: "Total billing amount" },
      },
      required: ["customerId", "amount"],
      additionalProperties: false,
    },
    configSchema: {
      type: "object",
      properties: {
        autoApprove: { type: "boolean", description: "Auto-approve generated invoice" },
      },
      required: [],
      additionalProperties: false,
    },
    lastDiscoveredAt: "Oct 11, 2026 · 09:00 AM",
    createdAt: "Oct 01, 2026",
    updatedAt: "Oct 13, 2026",
    agentAllowlists: ["sales-agent"], // FLAGGED: Agent still references an unavailable tool!
  },
  {
    _id: "mcptool-004",
    mcpToolId: "salesforce-search-accounts",
    mcpId: "mcp-salesforce",
    name: "searchAccounts",
    description: "Search Salesforce CRM accounts and contacts.",
    status: "active",
    schemaVersion: 1,
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Account name or domain" },
      },
      required: ["query"],
      additionalProperties: false,
    },
    configSchema: {
      type: "object",
      properties: {
        maxResults: { type: "number", description: "Result cap" },
      },
      required: ["maxResults"],
      additionalProperties: false,
    },
    lastDiscoveredAt: "Oct 12, 2026 · 02:30 PM",
    createdAt: "Oct 07, 2026",
    updatedAt: "Oct 12, 2026",
    agentAllowlists: ["crm-agent"],
  },
  {
    _id: "mcptool-005",
    mcpToolId: "github-search-repos",
    mcpId: "mcp-github",
    name: "searchRepositories",
    description: "Search GitHub public and private repositories.",
    status: "active",
    schemaVersion: 1,
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Repository search query" },
      },
      required: ["query"],
      additionalProperties: false,
    },
    configSchema: {
      type: "object",
      properties: {
        maxResults: { type: "number", description: "Max results" },
      },
      required: ["maxResults"],
      additionalProperties: false,
    },
    lastDiscoveredAt: "Oct 10, 2026 · 11:00 AM",
    createdAt: "Oct 02, 2026",
    updatedAt: "Oct 10, 2026",
    agentAllowlists: ["dev-assistant"],
  },
  {
    _id: "mcptool-006",
    mcpToolId: "slack-send-message",
    mcpId: "mcp-slack",
    name: "sendMessage",
    description: "Send formatted messages to a designated Slack channel.",
    status: "active",
    schemaVersion: 1,
    inputSchema: {
      type: "object",
      properties: {
        channel: { type: "string", description: "Channel name or ID" },
        text: { type: "string", description: "Markdown text payload" },
      },
      required: ["channel", "text"],
      additionalProperties: false,
    },
    configSchema: {
      type: "object",
      properties: {
        requireApproval: { type: "boolean", description: "Require human admin approval" },
      },
      required: ["requireApproval"],
      additionalProperties: false,
    },
    lastDiscoveredAt: "Oct 14, 2026 · 08:00 AM",
    createdAt: "Sep 29, 2026",
    updatedAt: "Oct 14, 2026",
    agentAllowlists: ["alert-bot"],
  },
];

// 10. clientConfigDb.mcptoolconfigs
const seedToolConfigs = [
  {
    _id: "mcptoolconfig-001",
    mcpToolConfigId: "autocount-customer-client-123",
    mcpId: "mcp-autocount",
    mcpToolId: "autocount-get-customer",
    scope: { type: "client", clientId: "client-123" },
    schemaVersion: 1,
    version: 1,
    config: { includeInactive: false, maxResults: 100 },
    status: "active",
    createdAt: "2026-10-13T09:00:00Z",
    updatedAt: "2026-10-13T09:00:00Z",
  },
  {
    _id: "mcptoolconfig-002",
    mcpToolConfigId: "autocount-customer-sales-agent",
    mcpId: "mcp-autocount",
    mcpToolId: "autocount-get-customer",
    scope: {
      type: "agent",
      clientId: "client-123",
      botId: "sales-bot",
      agentId: "sales-agent",
    },
    schemaVersion: 1,
    version: 1,
    config: { includeInactive: true, maxResults: 25 },
    status: "active",
    createdAt: "2026-10-13T09:00:00Z",
    updatedAt: "2026-10-13T09:00:00Z",
  },
  {
    _id: "mcptoolconfig-003",
    mcpToolConfigId: "autocount-product-client-123",
    mcpId: "mcp-autocount",
    mcpToolId: "autocount-get-product",
    scope: { type: "client", clientId: "client-123" },
    schemaVersion: 1,
    version: 1,
    config: { warehouseId: "WH-NORTH", maxResults: 50 },
    status: "active",
    createdAt: "2026-10-13T09:00:00Z",
    updatedAt: "2026-10-13T09:00:00Z",
  },
  {
    _id: "mcptoolconfig-004",
    mcpToolConfigId: "salesforce-accounts-client-456",
    mcpId: "mcp-salesforce",
    mcpToolId: "salesforce-search-accounts",
    scope: { type: "client", clientId: "client-456" },
    schemaVersion: 1,
    version: 1,
    config: { maxResults: 50 },
    status: "active",
    createdAt: "2026-10-12T14:30:00Z",
    updatedAt: "2026-10-12T14:30:00Z",
  },
  {
    _id: "mcptoolconfig-005",
    mcpToolConfigId: "github-repos-platform",
    mcpId: "mcp-github",
    mcpToolId: "github-search-repos",
    scope: { type: "platform" },
    schemaVersion: 1,
    version: 1,
    config: { maxResults: 30 },
    status: "active",
    createdAt: "2026-10-10T11:00:00Z",
    updatedAt: "2026-10-10T11:00:00Z",
  },
  {
    _id: "mcptoolconfig-006",
    mcpToolConfigId: "slack-msg-client-001",
    mcpId: "mcp-slack",
    mcpToolId: "slack-send-message",
    scope: { type: "client", clientId: "client-001" },
    schemaVersion: 1,
    version: 1,
    config: { requireApproval: true },
    status: "active",
    createdAt: "2026-10-14T08:00:00Z",
    updatedAt: "2026-10-14T08:00:00Z",
  },
];

const clients = {
  "client-123": "iTrade",
  "client-001": "iNextLabs",
  "client-456": "Client ABC",
};

const pretty = (v) =>
  ({
    active: "Active",
    inactive: "Inactive",
    unavailable: "Unavailable",
    streamableHttp: "Streamable HTTP",
    sse: "SSE",
    stdio: "STDIO",
    oauth2: "OAuth 2.0",
    apiKey: "API Key",
    bearerToken: "Bearer Token",
    none: "None",
    client: "Client Scope",
    platform: "Platform Scope",
  }[v] || v);

function Badge({ children, tone = "neutral" }) {
  return <span className={"badge badge-" + tone}>{children}</span>;
}

function Field({ label, children, hint, required }) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <b className="req"> *</b>}
      </span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={"toggle " + (checked ? "on" : "")}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

function Status({ value }) {
  return (
    <Badge
      tone={
        value === "active"
          ? "success"
          : value === "unavailable"
          ? "danger"
          : value === "inactive"
          ? "danger"
          : "info"
      }
    >
      {pretty(value)}
    </Badge>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value ?? "—"}</strong>
    </div>
  );
}

function TransportSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const options = [
    { value: "streamableHttp", label: "Streamable HTTP", disabled: false },
    { value: "sse", label: "Server-Sent Events (SSE)", disabled: true, tag: "Coming Soon" },
    { value: "stdio", label: "STDIO", disabled: true, tag: "Coming Soon" },
  ];

  const currentOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className={`custom-select-wrap ${open ? "is-open" : ""}`} ref={containerRef}>
      <button
        type="button"
        className={`custom-select-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{currentOption.label}</span>
        <ChevronDown
          style={{
            width: 15,
            height: 15,
            color: "#7b8492",
            transition: "transform .2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <div className="custom-select-menu" role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                className={`custom-select-option ${opt.disabled ? "disabled" : ""} ${
                  isSelected ? "selected" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!opt.disabled) {
                    onChange(opt.value);
                    setOpen(false);
                  }
                }}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
              >
                <span>{opt.label}</span>
                {opt.tag ? (
                  <span className="coming-soon-tag">{opt.tag}</span>
                ) : isSelected ? (
                  <Check style={{ width: 14, height: 14, color: "#f4513b", flexShrink: 0 }} />
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Review({ title, rows, onEdit }) {
  return (
    <div className="review">
      <div className="review-head">
        <b>{title}</b>
        <button className="text-action" onClick={onEdit}>
          <Pencil size={13} /> Edit
        </button>
      </div>
      {rows.map(([a, b]) => (
        <Info key={a} label={a} value={b} />
      ))}
    </div>
  );
}

export default function App() {
  const [servers, setServers] = useState(seedServers);
  const [tools, setTools] = useState(seedTools);
  const [toolConfigs, setToolConfigs] = useState(seedToolConfigs);

  const [selectedId, setSelectedId] = useState("mcp-001");
  const [page, setPage] = useState("list");
  const [tab, setTab] = useState("Overview");

  // Filters
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [transport, setTransport] = useState("all");
  const [view, setView] = useState("cards");

  const [nav, setNav] = useState(false);
  const [aiServicesOpen, setAiServicesOpen] = useState(true);
  const [notice, setNotice] = useState("");

  // Server Wizard Form
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

  // Tool Modal
  const [selectedTool, setSelectedTool] = useState(null);
  const [toolModalTab, setToolModalTab] = useState("schemas"); // "schemas" or "config"
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
          return {
            ...s,
            status: nextStatus,
            updatedAt: "Just now",
          };
        }
        return s;
      })
    );
    setOpenMenuId(null);
  };

  const [activity, setActivity] = useState([
    {
      id: 1,
      time: "Oct 13, 2026 · 09:00 AM",
      title: "Tools Discovered",
      detail: "Endpoint discovered 3 advertised tools from AutoCount MCP.",
    },
    {
      id: 2,
      time: "Oct 08, 2026 · 10:05 AM",
      title: "Configuration Saved",
      detail: "Client-level runtime config initialized for iTrade.",
    },
  ]);

  const selected = servers.find((s) => s._id === selectedId) || servers[0];
  const selectedServerTools = useMemo(
    () => tools.filter((t) => t.mcpId === selected?.mcpId),
    [tools, selected]
  );

  const log = (title, detail) =>
    setActivity((a) => [{ id: Date.now(), time: "Just now", title, detail }, ...a]);

  // Filtered servers
  const filtered = useMemo(() => {
    return servers.filter((s) => {
      const scopeName = s.scope.type === "platform" ? "Platform" : clients[s.scope.clientId] || "";
      const matchesSearch = `${s.name} ${s.mcpId} ${s.description} ${scopeName}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesScope =
        scopeFilter === "all" ||
        (scopeFilter === "platform" && s.scope.type === "platform") ||
        (s.scope.type === "client" && s.scope.clientId === scopeFilter);

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
      if (t.configSchema?.properties) {
        Object.entries(t.configSchema.properties).forEach(([propKey, propVal]) => {
          if (!existingParams.some((p) => p.name === propKey)) {
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
              required: (t.configSchema.required || []).includes(propKey),
              description: propVal.description || "",
            });
          }
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
    setPage("wizard");
    setNotice("");
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

    // Persist runtime configs for all tools
    const newConfigs = [...toolConfigs];
    const registeredToolNames =
      Object.keys(form.toolSchemasMap || {}).length > 0
        ? Object.keys(form.toolSchemasMap)
        : ["getCustomer", "getProduct", "createInvoice"];
    registeredToolNames.forEach((toolName) => {
      const toolRecord = tools.find((t) => t.name === toolName);
      const mcpToolId = toolRecord ? toolRecord.mcpToolId : `${s.mcpId}-${toolName.toLowerCase()}`;
      const existingIdx = newConfigs.findIndex(
        (c) => c.mcpToolId === mcpToolId && c.scope.type === form.scopeType
      );
      const confData = form.toolConfigsMap?.[toolName] || {};
      const cfgRecord = {
        _id: existingIdx >= 0 ? newConfigs[existingIdx]._id : `mcptoolconfig-${Date.now()}-${toolName}`,
        mcpToolConfigId: `${mcpToolId}-${form.clientId || "default"}`,
        mcpId: s.mcpId,
        mcpToolId,
        scope: form.scopeType === "platform" ? { type: "platform" } : { type: "client", clientId: form.clientId },
        schemaVersion: 1,
        version: 1,
        config: confData,
        status: "active",
        createdAt: "Just now",
        updatedAt: "Just now",
      };
      if (existingIdx >= 0) newConfigs[existingIdx] = cfgRecord;
      else newConfigs.push(cfgRecord);
    });
    setToolConfigs(newConfigs);

    setSelectedId(s._id);
    setPage("details");
    setTab("Overview");
    setNotice(editing ? "MCP server updated." : "MCP server registered in mock mode.");
    log(
      editing ? "MCP server updated" : "MCP server registered",
      `${s.name} (${s.mcpId}) registered with ${(form.selectedToolIds || []).length} enabled tools.`
    );
  };

  // Discover tools simulation
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

  const noticeUI = notice && (
    <div className="notice">
      <span>
        <CircleHelp size={15} />
        {notice}
      </span>
      <button onClick={() => setNotice("")}>
        <X size={14} />
      </button>
    </div>
  );

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
        <aside className={"sidebar " + (nav ? "open" : "")}>
          <button className="navitem" title="Dashboard">
            <LayoutDashboard />
            <span>Dashboard</span>
          </button>
          <div className="navlabel">
            PLATFORM <ChevronDown />
          </div>
          <button className="navitem" title="Client Account">
            <Users />
            <span>Client Account</span>
          </button>
          <button className="navitem" title="Client Teams">
            <Users />
            <span>Client Teams</span>
          </button>
          <button className="navitem" title="AI Resource Catalog">
            <Database />
            <span>AI Resource Catalog</span>
          </button>
          <button className="navitem" title="Infra Resources">
            <Server />
            <span>Infra Resources</span>
          </button>
          <div className="navgroup">
            <button
              className={"navitem navparent " + (aiServicesOpen ? "open active" : "")}
              onClick={() => setAiServicesOpen(!aiServicesOpen)}
              title="AI Services"
            >
              <Bot />
              <span>AI Services</span>
              <ChevronDown size={14} className={"caret " + (aiServicesOpen ? "open" : "")} />
            </button>
            {aiServicesOpen && (
              <div className="navsub">
                <button
                  className="navitem sub selected"
                  onClick={() => {
                    setPage("list");
                    setNotice("");
                  }}
                  title="MCP Servers"
                >
                  <Plug />
                  <span>MCP Servers</span>
                </button>
                <button className="navitem sub" title="Agent Skills">
                  <Bot />
                  <span>Agent Skills</span>
                </button>
                <button className="navitem sub" title="Model Registry">
                  <Zap />
                  <span>Model Registry</span>
                </button>
                <button className="navitem sub" title="Docs AI">
                  <FileText />
                  <span>Docs AI</span>
                </button>
                <button className="navitem sub" title="Insights AI">
                  <Activity />
                  <span>Insights AI</span>
                </button>
              </div>
            )}
          </div>
          <button className="navitem" title="Activity Logs">
            <Activity />
            <span>Activity Logs</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="main">
          {/* Breadcrumb */}
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

          {noticeUI}

          {/* PAGE 1: LIST VIEW */}
          {page === "list" && (
            <section className="page">
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
                <button className="btn primary push" onClick={create}>
                  <Plus /> Register MCP Server
                </button>
              </div>

              {/* Stats */}
              <div className="stats">
                {[
                  [Server, "Total MCP Servers", servers.length, "Registered integrations", "orange"],
                  [
                    CheckCircle2,
                    "Active Servers",
                    servers.filter((s) => s.status === "active").length,
                    "Enabled endpoints",
                    "green",
                  ],
                  [
                    Wrench,
                    "Discovered Tools",
                    tools.length,
                    `${tools.filter((t) => t.status === "active").length} active · ${
                      tools.filter((t) => t.status === "unavailable").length
                    } unavailable`,
                    "blue",
                  ],
                  [
                    Settings,
                    "Runtime Configs",
                    toolConfigs.length,
                    "Scoped client/agent overrides",
                    "orange",
                  ],
                ].map(([I, l, v, sub, c]) => (
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

              {/* Panel */}
              <div className="panel">
                <div className="panelhead">
                  <div>
                    <h2>MCP Server Endpoints</h2>
                    <p>Search, filter and inspect connection parameters and tool discovery status.</p>
                  </div>
                  <button
                    className="btn subtle"
                    onClick={() => {
                      setSearch("");
                      setScopeFilter("all");
                      setStatus("all");
                      setTransport("all");
                    }}
                  >
                    <RefreshCw /> Reset filters
                  </button>
                </div>

                {/* Filters */}
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

                {/* Cards View */}
                {view === "cards" ? (
                  <div className="cards">
                    {filtered.map((s) => {
                      const serverTools = tools.filter((t) => t.mcpId === s.mcpId);
                      const activeTools = serverTools.filter((t) => t.status === "active").length;
                      const hasUnavailable = serverTools.some((t) => t.status === "unavailable");

                      return (
                        <div className="servercard" key={s._id}>
                          {/* Header Line */}
                          <div className="serverline">
                            <div className="servericon">{s.name.slice(0, 2).toUpperCase()}</div>
                            <div className="serverlabel">
                              <button className="link" onClick={() => details(s._id)}>
                                {s.name}
                              </button>
                              <div className="servercard-sub">
                                <ShieldCheck size={12} />
                                <span>{s.mcpId}</span>
                              </div>
                            </div>
                            <span className={`status-live-pill ${s.status === "active" ? "live" : "inactive"}`}>
                              <span className="live-dot" />
                              {s.status === "active" ? "LIVE" : "INACTIVE"}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="servercard-desc">{s.description || "—"}</p>

                          {/* 3-Capsule Metadata Grid */}
                          <div className="card-capsules-grid">
                            <div className="card-capsule">
                              <div className="card-capsule-head">
                                <Globe size={11} />
                                <span>Transport</span>
                              </div>
                              <span className="card-capsule-value" title={pretty(s.connection.transport)}>
                                {pretty(s.connection.transport)}
                              </span>
                            </div>

                            <div className="card-capsule">
                              <div className="card-capsule-head">
                                <Wrench size={11} />
                                <span>Tools</span>
                              </div>
                              <span className="card-capsule-value">
                                {serverTools.length} {serverTools.length === 1 ? "tool" : "tools"}
                                {hasUnavailable && (
                                  <span style={{ color: "#b42318", marginLeft: "4px" }} title="Has unavailable tools">⚠️</span>
                                )}
                              </span>
                            </div>

                            <div className="card-capsule">
                              <div className="card-capsule-head">
                                <Users size={11} />
                                <span>Scope</span>
                              </div>
                              <span
                                className="card-capsule-value"
                                title={s.scope.type === "platform" ? "Platform Scope" : (clients[s.scope.clientId] || s.scope.clientId)}
                              >
                                {s.scope.type === "platform"
                                  ? "Platform"
                                  : (clients[s.scope.clientId] || s.scope.clientId)}
                              </span>
                            </div>
                          </div>

                          {/* Timestamp */}
                          <div className="card-timestamp">
                            <Clock size={12} />
                            <span>Last synced: {s.lastDiscoveredAt || s.updatedAt || s.createdAt}</span>
                          </div>

                          {/* Actions: Configure (flex: 1) and Delete Button */}
                          <div className="card-actions-row">
                            <button
                              type="button"
                              className="card-configure-btn"
                              onClick={() => details(s._id)}
                            >
                              <Settings size={14} />
                              <span>Configure</span>
                            </button>
                            <button
                              type="button"
                              className="card-delete-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(s);
                              }}
                              title="Delete Server"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Table View */
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
                        {filtered.map((s) => {
                          const serverTools = tools.filter((t) => t.mcpId === s.mcpId);
                          const unavail = serverTools.filter((t) => t.status === "unavailable").length;

                          return (
                            <tr key={s._id}>
                              <td>
                                <button className="link" onClick={() => details(s._id)}>
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
                                <Status value={s.status} />
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
                                          details(s._id);
                                        }}
                                      >
                                        <Eye size={14} /> View Details
                                      </button>
                                      <button
                                        className="action-dropdown-item"
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          edit(s);
                                        }}
                                      >
                                        <Pencil size={14} /> Edit Configuration
                                      </button>
                                      <button
                                        className="action-dropdown-item"
                                        onClick={() => toggleServerStatus(s._id)}
                                      >
                                        <Power size={14} />
                                        {s.status === "active" ? "Deactivate Server" : "Activate Server"}
                                      </button>
                                      <div className="action-dropdown-sep" />
                                      <button
                                        className="action-dropdown-item danger"
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          openDeleteModal(s);
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
                )}

                {!filtered.length && (
                  <div className="empty">
                    <Search />
                    <b>No MCP servers found</b>
                    <p>Try changing your search or filters.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* PAGE 2: DETAILS VIEW */}
          {page === "details" && (
            <section className="page">
              <div className="backline">
                <button onClick={() => setPage("list")}>
                  <ArrowLeft /> All MCP Servers
                </button>
                <span>/ {selected.mcpId}</span>
              </div>

              {/* Detail Header */}
              <div className="pagehead detailhead">
                <div className="servericon big">{selected.name.slice(0, 2).toUpperCase()}</div>
                <div className="grow">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                    <h1 style={{ margin: 0 }}>{selected.name}</h1>
                    <Status value={selected.status} />
                  </div>
                  <p>
                    {selected.mcpId} · Version {selected.version} ·{" "}
                    {selected.scope.type === "platform"
                      ? "Platform Shared Scope"
                      : `Client: ${clients[selected.scope.clientId] || selected.scope.clientId}`}
                  </p>
                </div>
                <button
                  className={"btn " + (selected.status === "active" ? "secondary" : "primary")}
                  onClick={() => toggleServerStatus(selected._id)}
                  title={selected.status === "active" ? "Deactivate this server" : "Activate this server"}
                >
                  <Power size={14} />
                  {selected.status === "active" ? "Deactivate Server" : "Activate Server"}
                </button>
                <button className="btn secondary" onClick={() => edit()}>
                  <Pencil size={14} /> Edit
                </button>
                <button
                  className="btn dangeroutline"
                  onClick={() => openDeleteModal(selected)}
                  title="Delete Server"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Tabs Panel */}
              <div className="panel">
                <div className="tabs">
                  {tabs.map((t) => (
                    <button
                      key={t}
                      className={tab === t ? "active" : ""}
                      onClick={() => setTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="tabbody">
                  {/* TAB 1: OVERVIEW */}
                  {tab === "Overview" && (
                    <div className="overview">
                      <div className="subpanel">
                        <h2>Server Identity & Scope</h2>
                        <p className="muted">
                          Server registration, scope type, and lifecycle audit metadata.
                        </p>
                        <Info label="Server Name" value={selected.name} />
                        <Info label="MCP ID" value={selected.mcpId} />
                        <Info label="Description" value={selected.description} />
                        <Info
                          label="Scope Type"
                          value={
                            selected.scope.type === "platform" ? (
                              <Badge tone="purple">Platform (Shared Integration)</Badge>
                            ) : (
                              <Badge tone="info">Client Tenant ({selected.scope.clientId})</Badge>
                            )
                          }
                        />
                        {selected.scope.clientId && (
                          <Info
                            label="Client Name"
                            value={clients[selected.scope.clientId] || selected.scope.clientId}
                          />
                        )}
                        <Info label="Last Discovered" value={selected.lastDiscoveredAt || "Never"} />
                        <Info label="Created at" value={selected.createdAt} />
                        <Info label="Updated at" value={selected.updatedAt} />
                      </div>

                      <div className="stack">
                        {/* Connection Card */}
                        <div className="subpanel">
                          <div className="subhead">
                            <Globe />
                            <div>
                              <h2>Connection Settings</h2>
                              <p className="muted">
                                Transport protocol and endpoint address.
                              </p>
                            </div>
                          </div>
                          <Info label="Transport" value={pretty(selected.connection.transport)} />
                          <Info
                            label="URL"
                            value={
                              selected.connection.url ? (
                                <code style={{ fontSize: "11px" }}>{selected.connection.url}</code>
                              ) : (
                                "stdio process"
                              )
                            }
                          />
                          <Info
                            label="Discovered Tools"
                            value={`${selectedServerTools.length} tools registered`}
                          />
                          <button className="btn secondary full" onClick={syncTools}>
                            <RefreshCw size={14} /> Sync & Discover Tools Now
                          </button>
                        </div>

                        {/* Authentication Card */}
                        <div className="subpanel">
                          <div className="subhead">
                            <ShieldCheck />
                            <div>
                              <h2>Authentication</h2>
                              <p className="muted">
                                Security and credentials management.
                              </p>
                            </div>
                          </div>
                          <Info label="Auth Type" value={pretty(selected.authentication.type)} />
                          <Info
                            label="Secret Isolation"
                            value={
                              <Badge tone="success">
                                {selected.scope.type === "platform"
                                  ? "Isolated per client at runtime"
                                  : "Tenant isolated"}
                              </Badge>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: TOOLS REGISTRY (UPDATED SCHEMA & DISCOVERY) */}
                  {tab === "Tools Registry" && (
                    <>
                      <div className="panelhead inner">
                        <div>
                          <h2>Discovered Tools</h2>
                          <p>
                            Tools advertised by <code>{selected.name}</code>. Tools define input parameters, and runtime settings can be customized per client or agent.
                          </p>
                        </div>
                        <button className="btn secondary" onClick={syncTools}>
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
                              <th>CONFIG SCHEMA</th>
                              <th>ACTIVE CONFIG SCOPES</th>
                              <th>ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedServerTools
                              .filter((t) =>
                                `${t.name} ${t.description} ${t.mcpToolId}`
                                  .toLowerCase()
                                  .includes(toolSearch.toLowerCase())
                              )
                              .map((t) => {
                                const configs = toolConfigs.filter((c) => c.mcpToolId === t.mcpToolId);
                                const agentOverrides = configs.filter((c) => c.scope.type === "agent");
                                const clientConfigs = configs.filter((c) => c.scope.type === "client");

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
                                        <Status value={t.status} />
                                        {isFlaggedInAllowlist && (
                                          <span
                                            className="allowlist-badge"
                                            title={`Tool is unavailable but referenced in agent allowlist: ${t.agentAllowlists.join(", ")}`}
                                          >
                                            ⚠️ Allowlist: {t.agentAllowlists.join(", ")}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    {/* Input Schema Preview */}
                                    <td>
                                      <div className="chips">
                                        {Object.entries(t.inputSchema.properties || {}).map(
                                          ([k, v]) => (
                                            <span key={k} title={v.description || k}>
                                              {k} <em>({v.type})</em>
                                              {t.inputSchema.required?.includes(k) && (
                                                <b style={{ color: "#dc2626" }}>*</b>
                                              )}
                                            </span>
                                          )
                                        )}
                                        {!Object.keys(t.inputSchema.properties || {}).length && (
                                          <small style={{ color: "#8a92a0" }}>None</small>
                                        )}
                                      </div>
                                    </td>
                                    {/* Config Schema Preview */}
                                    <td>
                                      <div className="chips">
                                        {Object.entries(t.configSchema.properties || {}).map(
                                          ([k, v]) => (
                                            <span key={k} title={v.description || k}>
                                              {k} <em>({v.type})</em>
                                            </span>
                                          )
                                        )}
                                        {!Object.keys(t.configSchema.properties || {}).length && (
                                          <small style={{ color: "#8a92a0" }}>None</small>
                                        )}
                                      </div>
                                    </td>
                                    {/* Runtime Config Scopes */}
                                    <td>
                                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                        {clientConfigs.length > 0 && (
                                          <span style={{ fontSize: "9.5px", color: "#166534" }}>
                                            ✓ Client Default ({clientConfigs[0].scope.clientId})
                                          </span>
                                        )}
                                        {agentOverrides.length > 0 ? (
                                          <Badge tone="purple">
                                            {agentOverrides.length} Agent Override
                                            {agentOverrides.length > 1 ? "s" : ""}
                                          </Badge>
                                        ) : (
                                          <span style={{ fontSize: "9px", color: "#8a92a0" }}>
                                            No agent override
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      <button
                                        className="btn secondary small"
                                        onClick={() => {
                                          setSelectedTool(t);
                                          setToolModalTab("schemas");
                                        }}
                                      >
                                        View Details & Configure
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {/* TAB 3: CONNECTION & AUTH */}
                  {tab === "Connection & Auth" && (
                    <div className="formpanel">
                      <h2>Connection & Authentication</h2>
                      <p className="muted">
                        Manage endpoint connection settings and authentication type.
                      </p>
                      <Field label="Transport">
                        <TransportSelect
                          value={selected.connection.transport}
                          onChange={(val) =>
                            setServers((old) =>
                              old.map((s) =>
                                s._id === selectedId
                                  ? {
                                      ...s,
                                      connection: { ...s.connection, transport: val },
                                    }
                                  : s
                              )
                            )
                          }
                        />
                      </Field>

                      {selected.connection.transport !== "stdio" && (
                        <Field label="Connection URL" hint="Endpoint advertised by the MCP server.">
                          <input
                            value={selected.connection.url}
                            onChange={(e) =>
                              setServers((old) =>
                                old.map((s) =>
                                  s._id === selectedId
                                    ? {
                                        ...s,
                                        connection: { ...s.connection, url: e.target.value },
                                      }
                                    : s
                                )
                              )
                            }
                          />
                        </Field>
                      )}

                      <Field label="Authentication Type">
                        <select
                          value={selected.authentication.type}
                          onChange={(e) =>
                            setServers((old) =>
                              old.map((s) =>
                                s._id === selectedId
                                  ? {
                                      ...s,
                                      authentication: {
                                        ...s.authentication,
                                        type: e.target.value,
                                      },
                                    }
                                  : s
                              )
                            )
                          }
                        >
                          <option value="oauth2">OAuth 2.0</option>
                          <option value="apiKey">API Key</option>
                          <option value="bearerToken">Bearer Token</option>
                          <option value="none">None</option>
                        </select>
                      </Field>

                      <div className="actions">
                        <button
                          className="btn secondary"
                          onClick={() => setNotice("Connection check simulated successfully.")}
                        >
                          Test Connection
                        </button>
                        <button
                          className="btn primary"
                          onClick={() => setNotice("Connection & auth settings saved locally.")}
                        >
                          Save Connection Settings
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: ACTIVITY */}
                  {tab === "Activity" && (
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
                  )}

                  {/* TAB 5: SETTINGS */}
                  {tab === "Settings" && (
                    <div className="formpanel">
                      <h2>Server Settings</h2>
                      <p className="muted">Server lifecycle, maintenance, and administrative actions.</p>

                      <div className="dangerzone" style={{ marginTop: "1.25rem" }}>
                        <h3>Danger Zone</h3>
                        <p className="muted">
                          Permanently remove this MCP server registration and its tool discovery links.
                        </p>
                        <button className="btn dangeroutline" onClick={() => openDeleteModal()}>
                          Delete MCP Server
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* PAGE 3: CREATE / EDIT WIZARD */}
          {page === "wizard" && (
            <section className="page wizardpage">
              <div className="pagehead">
                <button
                  className="backcircle"
                  onClick={() => setPage(editing ? "details" : "list")}
                >
                  <ArrowLeft />
                </button>
                <div>
                  <h1>{editing ? "Edit MCP Server" : "Register MCP Server"}</h1>
                  <p>
                    Configure server endpoint and authentication references. Step {step + 1} of 4.
                  </p>
                </div>
              </div>

              <div className="wizardlayout">
                {/* Steps Navigator */}
                <aside className="steps">
                  <div className="wizard-sidehead">
                    <h3>{editing ? "Edit Server" : "New MCP Server"}</h3>
                    <div className="wizard-sidebadge">
                      <span className="draft-dot" />
                      <span>DRAFT v{form.version || 1}</span>
                    </div>
                  </div>
                  {steps.map((s, i) => (
                    <button
                      key={s}
                      className={(step === i ? "current " : "") + (step > i ? "done" : "")}
                      onClick={() => i < step && setStep(i)}
                    >
                      <span className="stepnum">{step > i ? <Check /> : i + 1}</span>
                      <span>
                        <b>{s}</b>
                        <small>
                          {
                            [
                              "Identity and client/platform scope",
                              "Transport and connection settings",
                              "Discovered tools overview",
                              "Confirm and register server",
                            ][i]
                          }
                        </small>
                      </span>
                    </button>
                  ))}
                </aside>

                {/* Wizard Form Content */}
                <div className="wizardform">
                  {/* STEP 0: BASIC INFORMATION */}
                  {step === 0 && (
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
                  )}

                  {/* STEP 1: CONNECTION & AUTH */}
                  {step === 1 && (
                    <>
                      <div className="stepheading">
                        <h2>Connection & Authentication</h2>
                        <p>Configure transport, endpoint location, and authentication mode.</p>
                      </div>

                      <div className="subpanel">
                        <h3>Connection Settings</h3>
                        <Field label="Transport" required>
                          <TransportSelect
                            value={form.connection.transport}
                            onChange={(val) =>
                              setForm({
                                ...form,
                                connection: { ...form.connection, transport: val },
                              })
                            }
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
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  connection: { ...form.connection, url: e.target.value },
                                })
                              }
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
                  )}

                  {/* STEP 2: TOOLS & DISCOVERY */}
                  {step === 2 && (() => {
                    const previewTools = editing && selectedServerTools.length > 0
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
                      if (toolObj?.configSchema?.properties) {
                        Object.entries(toolObj.configSchema.properties).forEach(([k, v]) => {
                          if (!params.some((p) => p.name === k)) {
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
                              required: (toolObj.configSchema.required || []).includes(k),
                              description: v.description || "",
                            });
                          }
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

                        <div className="callout" style={{ background: "#f0fdf4", borderColor: "#bbf7d0", color: "#166534" }}>
                          <ShieldCheck />
                          <div>
                            <b>Automatic Discovery:</b> When this server is registered, the platform probes <code>{form.connection.url || "endpoint"}</code> via MCP protocol to discover available tools and their parameter schemas.
                          </div>
                        </div>

                        <div className="toolstephead">
                          <Badge tone="info">
                            {previewTools.length} Discovered Tools
                          </Badge>
                          <span className="muted">
                            All advertised tools are automatically registered with this MCP server
                          </span>
                        </div>

                        {previewTools.map((t) => {
                          const isConfigOpen = form.expandedConfigTool === t.name;
                          const toolParams = getToolParams(t.name, t);

                          return (
                            <div
                              className="wizardtool"
                              key={t.mcpToolId}
                            >
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
                                      expandedConfigTool:
                                        f.expandedConfigTool === t.name ? null : t.name,
                                    }))
                                  }
                                >
                                  <FileText size={13} />{" "}
                                  {isConfigOpen ? "Close Schema" : "Define Schema"}
                                </button>
                              </div>

                              {/* Inline Expandable Schema Builder Panel (DocsAI inspired) */}
                              {isConfigOpen && (
                                <div className="schema-builder-panel">
                                  {/* Header */}
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

                                  {/* Parameter Rows List */}
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
                                            {/* Row Header */}
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

                                              {/* Type Dropdown */}
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

                                              {/* Required Checkbox */}
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

                                              {/* Delete parameter */}
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

                                              {/* Expand / Collapse Chevron */}
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

                                            {/* Inline Expanded Drawer (Instructions only, no constraints) */}
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
                                                    placeholder={`Enter instructions or description for ${param.name || "this parameter"}...`}
                                                    onChange={(e) => {
                                                      const val = e.target.value;
                                                      updateToolParams(t.name, (prev) =>
                                                        prev.map((p, i) => (i === pIdx ? { ...p, description: val } : p))
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
                  })()}

                  {/* STEP 3: REVIEW & CREATE */}
                  {step === 3 && (
                    <>
                      <div className="stepheading">
                        <h2>Review & Create</h2>
                        <p>Review the configuration before registering the server.</p>
                      </div>

                      <Review
                        title="Server Identity & Scope"
                        rows={[
                          ["Name", form.name],
                          ["MCP ID", form.mcpId],
                          ["Description", form.description || "—"],
                          [
                            "Scope",
                            form.scopeType === "platform"
                              ? "Platform (Shared)"
                              : `${clients[form.clientId]} (${form.clientId})`,
                          ],
                        ]}
                        onEdit={() => setStep(0)}
                      />

                      <Review
                        title="Connection & Authentication"
                        rows={[
                          ["Transport", pretty(form.connection.transport)],
                          ["URL", form.connection.transport === "stdio" ? "Not applicable (stdio)" : form.connection.url],
                          ["Authentication Type", pretty(form.authentication.type)],
                        ]}
                        onEdit={() => setStep(1)}
                      />

                      <Review
                        title="Tools & Discovery"
                        rows={[
                          [
                            "Discovered Tools",
                            `${Object.keys(form.toolSchemasMap || {}).length || 3} tools registered`,
                          ],
                          [
                            "Defined Tool Schemas",
                            Object.keys(form.toolSchemasMap || {}).length > 0
                              ? Object.entries(form.toolSchemasMap)
                                  .map(([n, params]) => {
                                    const pNames = params.map((p) => p.name).filter(Boolean).join(", ");
                                    return `${n} (${pNames || "standard parameters"})`;
                                  })
                                  .join(" · ")
                              : "Standard discovered schemas",
                          ],
                          ["Discovery Handshake", "Automatic endpoint discovery enabled"],
                        ]}
                        onEdit={() => setStep(2)}
                      />

                      <div className="callout">
                        <ShieldCheck /> Mock prototype: Stores mock state in memory. No network connection is initiated.
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  <div className="wizardactions">
                    <button
                      className="btn secondary"
                      onClick={() =>
                        step === 0 ? setPage(editing ? "details" : "list") : setStep(step - 1)
                      }
                    >
                      {step === 0 ? "Cancel" : <><ChevronLeft /> Previous</>}
                    </button>
                    <span className="grow" />
                    <small>Step {step + 1} of 4</small>
                    {step < 3 ? (
                      <button className="btn primary" onClick={next}>
                        Save & Continue <ArrowRight />
                      </button>
                    ) : (
                      <button className="btn primary" onClick={save}>
                        {editing ? "Save Changes" : "Register MCP Server"} <Check />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* MODAL 1: TOOL DETAILS & RUNTIME CONFIGURE MODAL (MAJOR UPDATE) */}
      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          server={selected}
          toolConfigs={toolConfigs}
          setToolConfigs={setToolConfigs}
          activeTab={toolModalTab}
          setActiveTab={setToolModalTab}
          onClose={() => setSelectedTool(null)}
          onNotice={(msg) => setNotice(msg)}
          onLog={log}
        />
      )}

      {/* MODAL 2: DELETE CONFIRMATION (DocsAI Inspired) */}
      {(confirm || deleteTarget) && (() => {
        const targetServer = deleteTarget || selected;
        const targetId = targetServer?._id;
        const targetName = targetServer?.name || "MCP Server";
        const targetInitials = (targetName || "MC")
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        const serverToolCount = tools.filter((t) => t.mcpId === targetServer?.mcpId).length || 3;
        const scopeDesc =
          targetServer?.scope?.type === "platform"
            ? "Platform Scope (Shared)"
            : `Client: ${clients[targetServer?.scope?.clientId] || "iTrade"}`;
        const isMatch = deleteConfirmText.trim().toLowerCase() === targetName.trim().toLowerCase();

        return (
          <div className="backdrop" onClick={closeDeleteModal}>
            <div className="delete-modal-wrap" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="delete-modal-top">
                <div className="delete-modal-top-left">
                  <div className="delete-modal-icon-badge">
                    <AlertTriangle size={19} />
                  </div>
                  <div>
                    <h3 className="delete-modal-title">Delete MCP Server</h3>
                    <p className="delete-modal-subtitle">Verify deletion request</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="delete-modal-close-btn"
                  onClick={closeDeleteModal}
                  title="Close"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Body */}
              <div className="delete-modal-body">
                {/* Target Entity Card */}
                <div className="delete-server-card">
                  <div className="delete-server-avatar">{targetInitials}</div>
                  <div className="delete-server-info">
                    <span className="delete-server-name">{targetName}</span>
                    <span className="delete-server-sub">
                      {targetServer?.mcpId} · {scopeDesc}
                    </span>
                  </div>
                </div>

                {/* Warning Callout Box */}
                <div className="delete-warning-box">
                  <div className="delete-warning-header">
                    <AlertTriangle size={15} />
                    <span>This action cannot be undone.</span>
                  </div>
                  <p className="delete-warning-lead">Deleting this MCP server will:</p>
                  <ul className="delete-warning-list">
                    <li>Disconnect all agents and client workflows routed through this endpoint</li>
                    <li>Remove all {serverToolCount} discovered tool registrations and parameter schemas</li>
                    <li>Permanently erase stored connection URL and authentication tokens</li>
                  </ul>
                </div>

                {/* Type to Confirm Field */}
                <div>
                  <label className="delete-confirm-prompt">
                    To confirm, type <span className="delete-confirm-code">{targetName}</span>
                  </label>
                  <input
                    type="text"
                    className="delete-confirm-input"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="delete-modal-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={closeDeleteModal}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn danger"
                  disabled={!isMatch}
                  style={{
                    opacity: isMatch ? 1 : 0.45,
                    cursor: isMatch ? "pointer" : "not-allowed",
                  }}
                  onClick={() => {
                    if (!isMatch) return;
                    setServers((old) => old.filter((s) => s._id !== targetId));
                    closeDeleteModal();
                    if (page === "details" && selectedId === targetId) {
                      setPage("list");
                    }
                    setNotice(`MCP Server "${targetName}" removed from registry.`);
                  }}
                >
                  Delete this server
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// -----------------------------------------------------------------------------------------
// COMPONENT: ToolModal (Updated for InputSchema vs ConfigSchema & Scoped mcptoolconfigs)
// -----------------------------------------------------------------------------------------
function ToolModal({
  tool,
  server,
  toolConfigs,
  setToolConfigs,
  activeTab,
  setActiveTab,
  onClose,
  onNotice,
  onLog,
}) {
  // Existing configs for this tool
  const existingClientConfig = toolConfigs.find(
    (c) => c.mcpToolId === tool.mcpToolId && c.scope.type === "client"
  );
  const existingAgentConfig = toolConfigs.find(
    (c) => c.mcpToolId === tool.mcpToolId && c.scope.type === "agent"
  );

  // Scope picker inside modal: "client", "agent"
  const [selectedScope, setSelectedScope] = useState(existingAgentConfig ? "agent" : "client");

  // State for config fields being edited
  const getInitialValues = (scopeType) => {
    const target = scopeType === "agent" ? existingAgentConfig : existingClientConfig;
    if (target?.config) return { ...target.config };
    // fallback to defaults from configSchema
    const def = {};
    Object.entries(tool.configSchema.properties || {}).forEach(([k, s]) => {
      def[k] = s.type === "boolean" ? false : s.type === "number" ? 50 : "";
    });
    return def;
  };

  const [formConfig, setFormConfig] = useState(() => getInitialValues("client"));

  // Switch scope
  const handleScopeChange = (newScope) => {
    setSelectedScope(newScope);
    setFormConfig(getInitialValues(newScope));
  };

  // Save runtime config for the chosen scope
  const handleSaveConfig = () => {
    const isAgent = selectedScope === "agent";
    const configId = isAgent
      ? existingAgentConfig?._id || `mcptoolconfig-${Date.now()}`
      : existingClientConfig?._id || `mcptoolconfig-${Date.now()}`;

    const newRecord = {
      _id: configId,
      mcpToolConfigId: isAgent
        ? `${tool.mcpToolId}-sales-agent`
        : `${tool.mcpToolId}-${server.scope.clientId || "client-123"}`,
      mcpId: tool.mcpId,
      mcpToolId: tool.mcpToolId,
      scope: isAgent
        ? {
            type: "agent",
            clientId: server.scope.clientId || "client-123",
            botId: "sales-bot",
            agentId: "sales-agent",
          }
        : {
            type: "client",
            clientId: server.scope.clientId || "client-123",
          },
      schemaVersion: tool.schemaVersion,
      version: 1,
      config: { ...formConfig },
      status: "active",
      createdAt: "2026-10-13T09:00:00Z",
      updatedAt: "Just now",
    };

    setToolConfigs((old) => {
      const exists = old.some((c) => c._id === configId);
      return exists ? old.map((c) => (c._id === configId ? newRecord : c)) : [newRecord, ...old];
    });

    onNotice(
      `Saved ${isAgent ? "Agent-level override" : "Client-level default"} config for ${tool.name}.`
    );
    onLog(
      "Runtime Config Saved",
      `Saved ${isAgent ? "agent: sales-agent override" : "client default"} in clientConfigDb.mcptoolconfigs.`
    );
    onClose();
  };

  const isUnavailable = tool.status === "unavailable";
  const isFlaggedInAllowlist =
    isUnavailable && tool.agentAllowlists && tool.agentAllowlists.length > 0;

  return (
    <div className="backdrop">
      <div className="toolmodal" style={{ maxWidth: "800px" }}>
        {/* Modal Header */}
        <div className="modalhead">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2>{tool.name}</h2>
              <Status value={tool.status} />
              <Badge tone="neutral">v{tool.schemaVersion}</Badge>
            </div>
            <p>
              mcpToolId: <code>{tool.mcpToolId}</code> · Advertised on <code>{tool.mcpId}</code>
            </p>
          </div>
          <button className="icon" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Modal Tabs: Discovered Schemas vs Runtime Config */}
        <div className="scope-tabs" style={{ margin: "14px 20px 0" }}>
          <button
            className={"scope-tab " + (activeTab === "schemas" ? "active" : "")}
            onClick={() => setActiveTab("schemas")}
          >
            <BookOpenIcon /> 1. Discovered Schemas (Input & Config)
          </button>
          <button
            className={"scope-tab " + (activeTab === "config" ? "active" : "")}
            onClick={() => setActiveTab("config")}
          >
            <Settings /> 2. Runtime Configuration & Scopes
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "18px 20px" }}>
          {/* TAB 1: SCHEMAS (INPUT SCHEMA vs CONFIG SCHEMA) */}
          {activeTab === "schemas" && (
            <div>
              {/* Unavailable / Allowlist Flag Warning */}
              {isFlaggedInAllowlist && (
                <div
                  className="callout"
                  style={{
                    background: "#fffbeb",
                    borderColor: "#fde68a",
                    color: "#92400e",
                    marginBottom: "14px",
                  }}
                >
                  <AlertCircle size={16} />
                  <div>
                    <strong style={{ display: "block", marginBottom: "2px" }}>
                      Tool Unavailable & Referenced in Allowlist
                    </strong>
                    <span>
                      Referenced by Agent allowlist: <b>{tool.agentAllowlists.join(", ")}</b>. Remove this tool from Agent allowlists to avoid execution runtime errors.
                    </span>
                  </div>
                </div>
              )}

              <p className="muted" style={{ marginBottom: "14px" }}>
                Distinguishes tool input arguments accepted by the server from integration settings configured by administrators.
              </p>

              {/* 1. Input Schema */}
              <div className="schema-section">
                <h4>
                  <Tag size={14} color="#2563eb" /> Input Schema (Parameters sent by AI Agent at runtime)
                </h4>
                <p className="muted" style={{ marginBottom: "8px" }}>
                  Payload schema accepted by <code>{tool.name}</code> when invoked by LLMs:
                </p>
                <div>
                  {Object.entries(tool.inputSchema.properties || {}).map(([k, s]) => (
                    <div className="schema-pill" key={k}>
                      <b>{k}</b>
                      <em>({s.type})</em>
                      {tool.inputSchema.required?.includes(k) && (
                        <span className="req-star" title="Required parameter">
                          *required
                        </span>
                      )}
                      {s.description && <span>— {s.description}</span>}
                    </div>
                  ))}
                  {!Object.keys(tool.inputSchema.properties || {}).length && (
                    <small className="muted">No input parameters required.</small>
                  )}
                </div>
              </div>

              {/* 2. Config Schema */}
              <div className="schema-section">
                <h4>
                  <Settings size={14} color="#f4513b" /> Config Schema (Integration Settings)
                </h4>
                <p className="muted" style={{ marginBottom: "8px" }}>
                  Parameters available for tenant or agent runtime customization:
                </p>
                <div>
                  {Object.entries(tool.configSchema.properties || {}).map(([k, s]) => (
                    <div className="schema-pill" key={k}>
                      <b>{k}</b>
                      <em>({s.type})</em>
                      {tool.configSchema.required?.includes(k) && (
                        <span className="req-star" title="Required config field">
                          *required
                        </span>
                      )}
                      {s.description && <span>— {s.description}</span>}
                    </div>
                  ))}
                  {!Object.keys(tool.configSchema.properties || {}).length && (
                    <small className="muted">No configurable parameters.</small>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <small className="muted">
                  Last discovered at: {tool.lastDiscoveredAt} · schemaVersion: {tool.schemaVersion}
                </small>
                <button className="btn primary" onClick={() => setActiveTab("config")}>
                  Proceed to Runtime Config <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: RUNTIME CONFIGURATION */}
          {activeTab === "config" && (
            <div>
              <p className="muted" style={{ marginBottom: "12px" }}>
                Configure integration parameters for clients or override settings for specific agents.
              </p>

              {/* Scope Picker: Client Level vs Agent Override */}
              <Field label="Configuration Target Scope" hint="Select scope level to edit or override">
                <div className="scope-tabs" style={{ margin: "4px 0 12px" }}>
                  <button
                    type="button"
                    className={"scope-tab " + (selectedScope === "client" ? "active" : "")}
                    onClick={() => handleScopeChange("client")}
                  >
                    🏢 Client Default ({server.scope.clientId || "client-123"})
                  </button>
                  <button
                    type="button"
                    className={"scope-tab " + (selectedScope === "agent" ? "active" : "")}
                    onClick={() => handleScopeChange("agent")}
                  >
                    🤖 Agent Override (sales-agent)
                  </button>
                </div>
              </Field>

              {selectedScope === "agent" && (
                <div
                  className="callout"
                  style={{
                    background: "#fbf5ff",
                    borderColor: "#e9d5ff",
                    color: "#6b21a8",
                    marginBottom: "14px",
                  }}
                >
                  <Bot size={16} />
                  <div>
                    <b>Agent-level Override Active:</b> Settings here will strictly override the Client default when <code>sales-agent</code> (Bot: <code>sales-bot</code>) invokes this tool.
                  </div>
                </div>
              )}

              {/* Dynamically Rendered Form Controls based on configSchema */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {Object.entries(tool.configSchema.properties || {}).map(([propKey, propDef]) =>
                  propDef.type === "boolean" ? (
                    <div className="toggle-field-row" key={propKey}>
                      <div style={{ flex: 1 }}>
                        <span className="toggle-field-label">
                          {propKey}
                          {tool.configSchema.required?.includes(propKey) && (
                            <b className="req"> *</b>
                          )}
                        </span>
                        {propDef.description && (
                          <span className="toggle-field-desc">{propDef.description}</span>
                        )}
                      </div>
                      <Toggle
                        checked={Boolean(formConfig[propKey])}
                        onChange={(v) =>
                          setFormConfig((prev) => ({ ...prev, [propKey]: v }))
                        }
                        label={propKey}
                      />
                    </div>
                  ) : (
                    <Field
                      key={propKey}
                      label={propKey}
                      required={tool.configSchema.required?.includes(propKey)}
                      hint={propDef.description || `Data type: ${propDef.type}`}
                    >
                      {propDef.type === "number" ? (
                        <input
                          type="number"
                          value={formConfig[propKey] ?? 0}
                          onChange={(e) =>
                            setFormConfig((prev) => ({
                              ...prev,
                              [propKey]: Number(e.target.value),
                            }))
                          }
                        />
                      ) : (
                        <input
                          value={formConfig[propKey] ?? ""}
                          onChange={(e) =>
                            setFormConfig((prev) => ({
                              ...prev,
                              [propKey]: e.target.value,
                            }))
                          }
                          placeholder={`Enter ${propKey}...`}
                        />
                      )}
                    </Field>
                  )
                )}

                {!Object.keys(tool.configSchema.properties || {}).length && (
                  <div className="empty">
                    <b>No Config Parameters</b>
                    <p>This tool does not define any configurable settings.</p>
                  </div>
                )}
              </div>

              {/* Scope Precedence Notice */}
              <div className="precedence-line">
                <InfoIcon size={14} />
                <span>
                  Suggested Precedence: <b>Agent Override</b> &rarr; <b>Bot</b> &rarr; <b>Client Default</b> &rarr; <b>Platform</b>
                </span>
              </div>

              {/* Modal Actions */}
              <div className="modalactions" style={{ marginTop: "18px" }}>
                <button className="btn secondary" onClick={onClose}>
                  Cancel
                </button>
                <span className="grow" />
                <button className="btn primary" onClick={handleSaveConfig}>
                  <Check size={14} /> Save {selectedScope === "agent" ? "Agent Override" : "Client Config"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookOpenIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
