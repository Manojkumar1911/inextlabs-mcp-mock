import React from "react";
import { Server, Bell, CircleHelp } from "lucide-react";

export function Topbar() {
  return (
    <header className="top">
      <div className="brand">
        <Server />
      </div>
      <strong className="brandname">iNextLabs</strong>
      <span className="sep" />
      <span className="portal">Management Portal</span>
      <div className="topright">
        <button className="icon" title="Notifications">
          <Bell />
        </button>
        <button className="icon" title="Documentation">
          <CircleHelp />
        </button>
        <span className="sep" />
        <div className="avatar">AD</div>
        <div className="profile">
          <strong>Admin User</strong>
          <small>Platform Owner</small>
        </div>
      </div>
    </header>
  );
}

export function Breadcrumbs({ page, selectedServer, onBackToList }) {
  return (
    <div className="crumb">
      <span>AI Services</span>
      <span className="sep-slash">/</span>
      {page === "list" ? (
        <b>MCP Servers Registry</b>
      ) : page === "wizard" ? (
        <>
          <button className="crumb-link" onClick={onBackToList}>
            MCP Servers Registry
          </button>
          <span className="sep-slash">/</span>
          <b>Register MCP Server</b>
        </>
      ) : (
        <>
          <button className="crumb-link" onClick={onBackToList}>
            MCP Servers Registry
          </button>
          <span className="sep-slash">/</span>
          <b>{selectedServer?.name || "Server Details"}</b>
        </>
      )}
    </div>
  );
}
