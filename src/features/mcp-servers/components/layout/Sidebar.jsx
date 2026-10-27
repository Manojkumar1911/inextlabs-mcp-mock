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
} from "lucide-react";

export function Sidebar({
  navOpen,
  aiServicesOpen,
  setAiServicesOpen,
  onSelectMcpServers,
}) {
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
              onClick={onSelectMcpServers}
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
