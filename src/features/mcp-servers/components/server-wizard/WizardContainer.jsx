import React from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ArrowRight,
  Check,
  Plug,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { WizardSidebar } from "./WizardSidebar";
import { StepBasicInfo, StepConnectionAuth } from "./StepBasicAndConn";
import { StepToolsDiscovery } from "./StepToolsDiscovery";
import { StepReviewCreate } from "./StepReviewCreate";

export function WizardContainer({
  editing,
  step,
  setStep,
  steps,
  form,
  setForm,
  connectionVerified,
  setConnectionVerified,
  isTesting,
  testConnection,
  selectedServerTools,
  expandedSchemaFieldIds,
  setExpandedSchemaFieldIds,
  onCancel,
  onNext,
  onSave,
}) {
  return (
    <section className="page wizardpage">
      <div className="pagehead">
        <button className="backcircle" onClick={onCancel}>
          <ArrowLeft />
        </button>
        <div>
          <h1>{editing ? "Edit MCP Server" : "Register MCP Server"}</h1>
          <p>Configure server endpoint and authentication references.</p>
        </div>
      </div>

      <div className="wizardlayout">
        <WizardSidebar
          steps={steps}
          step={step}
          setStep={setStep}
          editing={editing}
          form={form}
          connectionVerified={connectionVerified}
        />

        <div className="wizardform">
          {step === 0 && <StepBasicInfo form={form} setForm={setForm} />}

          {step === 1 && (
            <StepConnectionAuth
              form={form}
              setForm={setForm}
              connectionVerified={connectionVerified}
              setConnectionVerified={setConnectionVerified}
            />
          )}

          {step === 2 && (
            <StepToolsDiscovery
              form={form}
              setForm={setForm}
              editing={editing}
              selectedServerTools={selectedServerTools}
              expandedSchemaFieldIds={expandedSchemaFieldIds}
              setExpandedSchemaFieldIds={setExpandedSchemaFieldIds}
            />
          )}

          {step === 3 && <StepReviewCreate form={form} setStep={setStep} />}

          {/* Wizard Navigation Actions Footer */}
          <div className="wizardactions">
            <button
              className="btn secondary"
              onClick={() => (step === 0 ? onCancel() : setStep(step - 1))}
            >
              {step === 0 ? (
                "Cancel"
              ) : (
                <>
                  <ChevronLeft /> Previous
                </>
              )}
            </button>
            <span className="grow" />
            <small>Step {step + 1} of 4</small>

            {step === 1 && !connectionVerified ? (
              <button
                className="btn test-conn"
                onClick={testConnection}
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <Loader2 size={14} className="spin" /> Testing Connection...
                  </>
                ) : (
                  <>
                    Test Connection <Plug size={14} />
                  </>
                )}
              </button>
            ) : (
              <>
                {step === 1 && connectionVerified && (
                  <button
                    type="button"
                    className="btn test-conn"
                    onClick={testConnection}
                    disabled={isTesting}
                    title="Re-test connection endpoint"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 size={13} className="spin" /> Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={13} /> Re-test
                      </>
                    )}
                  </button>
                )}
                {step < 3 ? (
                  <button className="btn primary" onClick={onNext}>
                    {step === 1 ? "Continue" : "Save & Continue"} <ArrowRight />
                  </button>
                ) : (
                  <button className="btn primary" onClick={onSave}>
                    {editing ? "Save Changes" : "Register MCP Server"} <Check />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
