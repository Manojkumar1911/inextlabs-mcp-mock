import React from "react";
import { Check } from "lucide-react";

export function WizardSidebar({
  steps = [],
  step = 0,
  setStep,
  editing,
  form,
  connectionVerified,
}) {
  return (
    <aside className="steps">
      <div className="wizard-sidehead">
        <h3>{editing ? "Edit Server" : "New MCP Server"}</h3>
        <div className="wizard-sidebadge">
          <span className="draft-dot" />
          <span>DRAFT v{form.version || 1}</span>
        </div>
      </div>
      {steps.map((s, i) => {
        if (!connectionVerified && i > 1) return null;
        return (
          <button
            key={s}
            className={(step === i ? "current " : "") + (step > i ? "done" : "")}
            onClick={() => setStep(i)}
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
        );
      })}
    </aside>
  );
}
