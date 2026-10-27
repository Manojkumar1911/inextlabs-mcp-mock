import React from "react";
import { DetailsHeader } from "./DetailsHeader";
import { OverviewTab } from "./OverviewTab";
import { ToolsRegistryTab } from "./ToolsRegistryTab";
import { ConnectionAuthTab, ActivityTab, SettingsTab } from "./OtherTabs";

export function ServerDetailsContainer({
  server,
  tab,
  setTab,
  tabs,
  serverTools = [],
  toolSearch,
  setToolSearch,
  activity = [],
  onBack,
  onToggleStatus,
  onEdit,
  onDelete,
  onSyncTools,
  onSelectTool,
  onUpdateConnection,
  onUpdateAuth,
  onTestConnection,
  onSaveConnectionSettings,
}) {
  return (
    <section className="page">
      <DetailsHeader
        server={server}
        onBack={onBack}
        onToggleStatus={onToggleStatus}
        onEdit={onEdit}
        onDelete={() => onDelete(server)}
      />

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
          {tab === "Overview" && (
            <OverviewTab
              server={server}
              serverTools={serverTools}
              onSyncTools={onSyncTools}
            />
          )}

          {tab === "Tools Registry" && (
            <ToolsRegistryTab
              server={server}
              serverTools={serverTools}
              toolSearch={toolSearch}
              setToolSearch={setToolSearch}
              onSyncTools={onSyncTools}
              onSelectTool={onSelectTool}
            />
          )}

          {tab === "Connection & Auth" && (
            <ConnectionAuthTab
              server={server}
              onUpdateConnection={onUpdateConnection}
              onUpdateAuth={onUpdateAuth}
              onTestConnection={onTestConnection}
              onSave={onSaveConnectionSettings}
            />
          )}

          {tab === "Activity" && <ActivityTab activity={activity} />}

          {tab === "Settings" && (
            <SettingsTab onDelete={() => onDelete(server)} />
          )}
        </div>
      </div>
    </section>
  );
}
