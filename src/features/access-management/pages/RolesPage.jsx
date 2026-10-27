import React, { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Search,
  RotateCcw,
  X,
} from "lucide-react";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import IamDeleteModal from "../components/IamDeleteModal";
import { SOLUTIONS } from "../data/iamData";

function RoleModal({
  edit,
  permissions,
  availableSolutions,
  onClose,
  onSave,
}) {
  const [name, setName] = useState(edit?.name ?? "");
  const [solution, setSolution] = useState(edit?.solution ?? "Platform");
  const [selectedPerms, setSelectedPerms] = useState(
    edit?.permissions ?? []
  );
  const [filterText, setFilterText] = useState("");

  const togglePerm = (key) => {
    setSelectedPerms((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const filteredPerms = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return permissions;
    return permissions.filter(
      (p) =>
        p.key.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.solution.toLowerCase().includes(q)
    );
  }, [permissions, filterText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      solution,
      permissions: selectedPerms,
    });
  };

  return (
    <Modal
      title={edit ? "Edit Role" : "Create Role"}
      close={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="modalbody">
          <div className="formgrid">
            <label>
              Role name *
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Finance Analyst"
              />
            </label>

            <label>
              Solution *
              <select
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              >
                {availableSolutions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="perm-section">
            <div className="perm-section-header">
              <div>
                <span className="perm-section-title">Role Permissions</span>
                <span className="perm-counter">
                  <b>{selectedPerms.length}</b> of {permissions.length} selected
                </span>
              </div>
              {selectedPerms.length > 0 && (
                <button
                  type="button"
                  className="text-btn"
                  onClick={() => setSelectedPerms([])}
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="perm-filter-bar">
              <Search size={14} />
              <input
                type="text"
                placeholder="Filter permissions by name or description..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              {filterText && (
                <button
                  type="button"
                  className="perm-clear-btn"
                  onClick={() => setFilterText("")}
                  title="Clear filter"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="perm-list">
              {filteredPerms.map((p) => {
                const isSelected = selectedPerms.includes(p.key);
                return (
                  <label
                    key={p.key}
                    className={`perm-row ${isSelected ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="perm-checkbox"
                      checked={isSelected}
                      onChange={() => togglePerm(p.key)}
                    />
                    <div className="perm-content">
                      <div className="perm-header">
                        <span className="perm-name">{p.key}</span>
                        <div className="perm-badges">
                          <span className="perm-solution-tag">
                            {p.solution}
                          </span>
                          <Badge tone={p.risk}>{p.risk}</Badge>
                        </div>
                      </div>
                      <p className="perm-description">{p.description}</p>
                    </div>
                  </label>
                );
              })}

              {filteredPerms.length === 0 && (
                <div className="perm-empty">
                  No permissions found matching “{filterText}”.
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="modalfooter">
          <button
            type="button"
            className="secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary"
            disabled={!name.trim()}
          >
            {edit ? "Save changes" : "Create role"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}

export default function RolesPage({
  roles,
  permissions,
  save,
  remove,
  toast,
}) {
  const [q, setQ] = useState("");
  const [sol, setSol] = useState("All");
  const [kind, setKind] = useState("All");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState(undefined);
  const [del, setDel] = useState(null);

  const filtered = useMemo(() => {
    return roles.filter((r) => {
      const matchesSearch = (r.name + r.solution + r.permissions.join(" "))
        .toLowerCase()
        .includes(q.toLowerCase());
      const matchesSolution = sol === "All" || r.solution === sol;
      const matchesKind =
        kind === "All" || (kind === "System" ? r.system : !r.system);

      return matchesSearch && matchesSolution && matchesKind;
    });
  }, [roles, q, sol, kind]);

  const size = 5;
  const visible = filtered.slice((page - 1) * size, page * size);

  const availableSolutions = SOLUTIONS;
  const modalSolutions = SOLUTIONS;

  const handleSaveRole = (data) => {
    save({
      roleId: edit?.roleId ?? `role-${Date.now()}`,
      clientId: edit?.clientId ?? null,
      solution: data.solution,
      name: data.name,
      permissions: data.permissions,
      system: edit?.system ?? false,
      version: edit?.version ?? 1,
      createdAt: edit?.createdAt ?? new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    });

    setEdit(undefined);
    toast(edit ? "Role updated successfully" : "Role created successfully");
  };

  return (
    <>
      <div className="crumb">
        Platform › Access Management › <b>Roles</b>
      </div>

      <div className="heading">
        <div className="heading-icon">
          <Users size={24} />
        </div>
        <div>
          <h1>Roles</h1>
          <p>
            Create and manage roles with appropriate permissions for each
            solution.
          </p>
        </div>
        <button
          className="primary"
          type="button"
          onClick={() => setEdit(null)}
        >
          <Plus size={16} /> Create Role
        </button>
      </div>

      <section className="panel">
        <div className="paneltitle">
          <div>
            <h2>Role directory</h2>
            <p>Search, review, and manage access roles.</p>
          </div>
          <span className="count">{filtered.length} roles</span>
        </div>

        <div className="filters">
          <label className="search">
            <Search size={16} />
            <input
              placeholder="Search by role name, solution or permission..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </label>

          <select value={sol} onChange={(e) => setSol(e.target.value)}>
            <option value="All">All Solutions</option>
            {availableSolutions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="All">All Types</option>
            <option value="System">System</option>
            <option value="Custom">Custom</option>
          </select>

          <button
            className="secondary"
            type="button"
            onClick={() => {
              setQ("");
              setSol("All");
              setKind("All");
              setPage(1);
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Role name</th>
                <th>Solution</th>
                <th>Permissions</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.roleId}>
                  <td>
                    <b>{r.name}</b>
                    <small>{r.roleId}</small>
                  </td>
                  <td>{r.solution}</td>
                  <td>
                    <div className="chips">
                      {r.permissions.slice(0, 2).map((p) => (
                        <span className="chip" key={p}>
                          {p}
                        </span>
                      ))}
                      {r.permissions.length > 2 && (
                        <span className="chip muted">
                          +{r.permissions.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <Badge tone={r.system ? "info" : "neutral"}>
                      {r.system ? "System" : "Custom"}
                    </Badge>
                  </td>
                  <td className="actions">
                    <button
                      type="button"
                      className="iconbtn"
                      title="Edit"
                      onClick={() => setEdit(r)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      className="iconbtn danger"
                      title="Delete"
                      disabled={r.system}
                      onClick={() => setDel(r)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!visible.length && (
            <div className="empty">
              No roles found. Try another search or filter.
            </div>
          )}
        </div>

        <Pagination
          total={filtered.length}
          page={page}
          size={size}
          setPage={setPage}
        />
      </section>

      {edit !== undefined && (
        <RoleModal
          edit={edit}
          permissions={permissions}
          availableSolutions={modalSolutions}
          onClose={() => setEdit(undefined)}
          onSave={handleSaveRole}
        />
      )}

      <IamDeleteModal
        isOpen={Boolean(del)}
        onClose={() => setDel(null)}
        title="Delete Role"
        subtitle="Verify deletion request"
        entityName={del?.name || ""}
        entitySub={`${del?.roleId || ""} · Solution: ${del?.solution || "Platform"}`}
        warningText="Deleting this role will remove all associated permissions and invalidate active assignments."
        confirmButtonText="Delete this role"
        onConfirm={() => {
          if (del) {
            remove(del.roleId);
            setDel(null);
            toast("Role deleted");
          }
        }}
      />
    </>
  );
}
