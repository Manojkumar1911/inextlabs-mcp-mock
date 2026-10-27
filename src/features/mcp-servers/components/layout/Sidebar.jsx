import React from "react";
import {
  LayoutDashboard,
  Users,
  Database,
  Server,
  Bot,
  Plug,
  Zap,
  FileText,
  Activity,
  ChevronDown,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export function Sidebar({
  navOpen,
  aiServicesOpen = true,
  setAiServicesOpen,
  accessManagementOpen = true,
  setAccessManagementOpen,
  activeView = "roles",
  onNavigate,
}) {
  const isIamActive =
    activeView === "roles" ||
    activeView === "permissions" ||
    activeView === "assignments";

  return (
    <aside className={"sidebar " + (navOpen ? "open" : "")}>
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

      {/* Access Management Section under PLATFORM */}
      <div className="navgroup">
        <button
          className={
            "navitem navparent " +
            (isIamActive ? "active " : "") +
            (accessManagementOpen ? "open" : "")
          }
          onClick={() =>
            setAccessManagementOpen && setAccessManagementOpen(!accessManagementOpen)
          }
          title="Access Management"
        >
          <ShieldCheck />
          <span>Access Management</span>
          <ChevronDown
            size={14}
            className={"caret " + (accessManagementOpen ? "open" : "")}
          />
        </button>

        {accessManagementOpen && (
          <div className="navsub">
            <button
              className={"navitem sub" + (activeView === "roles" ? " selected" : "")}
              onClick={() => onNavigate && onNavigate("roles")}
              title="Roles"
            >
              <Users size={14} />
              <span>Roles</span>
            </button>
            <button
              className={
                "navitem sub" + (activeView === "permissions" ? " selected" : "")
              }
              onClick={() => onNavigate && onNavigate("permissions")}
              title="Permissions"
            >
              <ShieldCheck size={14} />
              <span>Permissions</span>
            </button>
            <button
              className={
                "navitem sub" + (activeView === "assignments" ? " selected" : "")
              }
              onClick={() => onNavigate && onNavigate("assignments")}
              title="Role Assignments"
            >
              <UserCheck size={14} />
              <span>Role Assignments</span>
            </button>
          </div>
        )}
      </div>

      {/* AI Services Section */}
      <div className="navgroup">
        <button
          className={
            "navitem navparent " +
            (activeView === "mcp-servers" ? "active " : "") +
            (aiServicesOpen ? "open" : "")
          }
          onClick={() => setAiServicesOpen && setAiServicesOpen(!aiServicesOpen)}
          title="AI Services"
        >
          <Bot />
          <span>AI Services</span>
          <ChevronDown
            size={14}
            className={"caret " + (aiServicesOpen ? "open" : "")}
          />
        </button>

        {aiServicesOpen && (
          <div className="navsub">
            <button
              className={
                "navitem sub" + (activeView === "mcp-servers" ? " selected" : "")
              }
              onClick={() => onNavigate && onNavigate("mcp-servers")}
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
  );
}

