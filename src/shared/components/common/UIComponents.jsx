import React from "react";
import { pretty } from "../../../features/mcp-servers/data/seedData";

export function Badge({ children, tone = "neutral" }) {
  return <span className={"badge badge-" + tone}>{children}</span>;
}

export function Status({ value }) {
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

export function Toggle({ checked, onChange, label }) {
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

export function Field({ label, children, hint, required }) {
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

export function Info({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value ?? "—"}</strong>
    </div>
  );
}
