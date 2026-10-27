import React from "react";
import { ShieldCheck } from "lucide-react";
import { Review } from "../../../../shared/components/common/Review";
import { pretty, clients } from "../../data/seedData";

export function StepReviewCreate({ form, setStep }) {
  return (
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
          [
            "URL",
            form.connection.transport === "stdio"
              ? "Not applicable (stdio)"
              : form.connection.url,
          ],
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
                    const pNames = params
                      .map((p) => p.name)
                      .filter(Boolean)
                      .join(", ");
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
  );
}
