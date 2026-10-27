import React, { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  KeyRound,
  Search,
  RotateCcw,
} from "lucide-react";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import IamDeleteModal from "../components/IamDeleteModal";
import { SOLUTIONS } from "../data/iamData";

const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function PermissionsPage({
  items,
  save,
  remove,
  toast,
}) {
  const [q, setQ] = useState("");
  const [sol, setSol] = useState("All");
  const [risk, setRisk] = useState("All");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState(undefined);
  const [del, setDel] = useState(null);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const matchesSearch = (p.key + p.description + (p.sodGroup ?? ""))
        .toLowerCase()
        .includes(q.toLowerCase());
      const matchesSolution = sol === "All" || p.solution === sol;
      const matchesRisk = risk === "All" || p.risk === risk;

      return matchesSearch && matchesSolution && matchesRisk;
    });
  }, [items, q, sol, risk]);

  const size = 6;
  const visible = filtered.slice((page - 1) * size, page * size);

  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);

    save(
      {
        key: String(f.get("key")),
        description: String(f.get("description")),
        solution: String(f.get("solution")),
        risk: String(f.get("risk")),
        sodGroup: String(f.get("sodGroup")) || undefined,
        version: edit?.version ? edit.version + 1 : 1,
      },
      edit?.key
    );

    setEdit(undefined);
    toast("Permission saved");
  };

  const availableSolutions = SOLUTIONS;
  const modalSolutions = SOLUTIONS;

  return (
    <>
      <div className="crumb">
        Platform › Access Management › <b>Permissions</b>
      </div>

      <div className="heading">
        <div className="heading-icon">
          <KeyRound size={24} />
        </div>
        <div>
          <h1>Permissions Catalog</h1>
          <p>Browse and manage available permissions for each solution.</p>
        </div>
        <button
          className="primary"
          type="button"
          onClick={() => setEdit(null)}
        >
          <Plus size={16} /> Add Permission
        </button>
      </div>

      <section className="panel">
        <div className="paneltitle">
          <div>
            <h2>Permission catalog</h2>
            <p>
              Permission keys describe capabilities; descriptions make them
              easier to understand.
            </p>
          </div>
          <span className="count">{filtered.length} permissions</span>
        </div>

        <div className="filters">
          <label className="search">
            <Search size={16} />
            <input
              placeholder="Search permission key, description or SoD group..."
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

          <select value={risk} onChange={(e) => setRisk(e.target.value)}>
            <option value="All">All Risk Levels</option>
            {RISK_LEVELS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            className="secondary"
            type="button"
            onClick={() => {
              setQ("");
              setSol("All");
              setRisk("All");
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
                <th>Permission</th>
                <th>Description</th>
                <th>Solution</th>
                <th>Risk level</th>
                <th>SoD group</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.key}>
                  <td>
                    <b className="code">{p.key}</b>
                  </td>
                  <td>{p.description}</td>
                  <td>{p.solution}</td>
                  <td>
                    <Badge tone={p.risk}>{p.risk}</Badge>
                  </td>
                  <td>{p.sodGroup || <small>Not grouped</small>}</td>
                  <td className="actions">
                    <button
                      type="button"
                      className="iconbtn"
                      onClick={() => setEdit(p)}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      className="iconbtn danger"
                      onClick={() => setDel(p)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!visible.length && (
            <div className="empty">No permissions found.</div>
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
        <Modal
          title={edit ? "Edit permission" : "Add permission"}
          close={() => setEdit(undefined)}
        >
          <form onSubmit={submit}>
            <div className="modalbody">
              <div className="formgrid">
                <label>
                  Permission key *
                  <input
                    name="key"
                    required
                    defaultValue={edit?.key ?? ""}
                    placeholder="e.g. invoices.approve"
                  />
                </label>

                <label>
                  Solution
                  <select
                    name="solution"
                    defaultValue={edit?.solution ?? "Platform"}
                  >
                    {modalSolutions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Description *
                <textarea
                  name="description"
                  required
                  defaultValue={edit?.description ?? ""}
                  placeholder="Explain what this permission allows."
                  rows={3}
                />
              </label>

              <div className="formgrid">
                <label>
                  Risk level
                  <select name="risk" defaultValue={edit?.risk ?? "LOW"}>
                    {RISK_LEVELS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Segregation-of-duties group
                  <input
                    name="sodGroup"
                    defaultValue={edit?.sodGroup ?? ""}
                    placeholder="e.g. Financial Approvals"
                  />
                </label>
              </div>
            </div>

            <footer className="modalfooter">
              <button
                type="button"
                className="secondary"
                onClick={() => setEdit(undefined)}
              >
                Cancel
              </button>
              <button className="primary" type="submit">
                {edit ? "Save changes" : "Add permission"}
              </button>
            </footer>
          </form>
        </Modal>
      )}

      <IamDeleteModal
        isOpen={Boolean(del)}
        onClose={() => setDel(null)}
        title="Delete Permission"
        subtitle="Verify deletion request"
        entityName={del?.key || ""}
        entitySub={`Solution: ${del?.solution || "Platform"} · Risk: ${del?.risk || "LOW"}`}
        warningText="Deleting this permission will permanently remove it from the catalog. Roles referencing this permission will be affected."
        confirmButtonText="Delete this permission"
        onConfirm={() => {
          if (del) {
            remove(del.key);
            setDel(null);
            toast("Permission deleted");
          }
        }}
      />
    </>
  );
}
