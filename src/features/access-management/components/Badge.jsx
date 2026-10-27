import React from "react";

export default function Badge({ children, tone = "neutral" }) {
  const t = tone ? String(tone).toLowerCase() : "neutral";
  return (
    <span className={`badge ${t}`}>
      {children}
    </span>
  );
}
