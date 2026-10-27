import React, { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  UserRoundCheck,
  Search,
  RotateCcw,
} from "lucide-react";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import IamDeleteModal from "../components/IamDeleteModal";

export default function AssignmentsPage({
  items,
  roles,
  save,
  remove,
  toast,
}) {
  const [q, setQ] = useState("");
  const [client, setClient] = useState("All");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState(undefined);
  const [del, setDel] = useState(null);

  const getStatus = (a) => {
    const today = new Date().toISOString().slice(0, 10);
    if (a.validFrom && a.validFrom > today) return "Scheduled";
    if (a.validTo && a.validTo < today) return "Expired";
    return "Active";
  };

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const roleName = roles.find((r) => r.roleId === a.roleId)?.name ?? "";
      const matchesSearch = (a.principalId + a.roleId + roleName + a.clientId)
        .toLowerCase()
        .includes(q.toLowerCase());

      const matchesClient = client === "All" || a.clientId === client;
      const matchesType = type === "All" || a.principalType === type;
      const matchesStatus = status === "All" || getStatus(a) === status;

      return matchesSearch && matchesClient && matchesType && matchesStatus;
    });
  }, [items, roles, q, client, type, status]);

  const size = 5;
  const visible = filtered.slice((page - 1) * size, page * size);

  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const from = String(f.get("from"));
    const to = String(f.get("to"));
    const scopeValue = String(f.get("scope"));

    save({
      id: edit?.id ?? `asg-${Date.now().toString().slice(-6)}`,
      clientId: String(f.get("client")),
      principalType: String(f.get("type")),
      principalId: String(f.get("principal")),
      roleId: String(f.get("role")),
      scope: {
        type: scopeValue.toLowerCase().includes("global") ? "global" : "client",
        name: scopeValue,
      },
      validFrom: from || undefined,
      validTo: to || undefined,
      grantedBy: String(f.get("grantedBy")),
      createdAt: edit?.createdAt ?? new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    });

    setEdit(undefined);
    toast("Role assignment saved");
  };

  const availableClients = useMemo(() => {
    return Array.from(new Set(items.map((a) => a.clientId)));
  }, [items]);

  return (
    <>
      <div className="crumb">
        Platform › Access Management › <b>Role Assignments</b>
      </div>

      <div className="heading">
        <div className="heading-icon">
          <UserRoundCheck size={24} />
        </div>
        <div>
          <h1>Role Assignments</h1>
          <p>
            Assign roles to users, groups, or service principals with
            appropriate scope and validity.
          </p>
        </div>
        <button
          className="primary"
          type="button"
          onClick={() => setEdit(null)}
        >
          <Plus size={16} /> Assign Role
        </button>
      </div>

      <section className="panel">
        <div className="paneltitle">
          <div>
            <h2>Assignments directory</h2>
            <p>
              Review which principals have access, and when that access is
              valid.
            </p>
          </div>
          <span className="count">{filtered.length} assignments</span>
        </div>

        <div className="filters">
          <label className="search">
            <Search size={16} />
            <input
              placeholder="Search by principal, role or client..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </label>

          <select value={client} onChange={(e) => setClient(e.target.value)}>
            <option value="All">All Clients</option>
            {availableClients.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="All">All Principal Types</option>
            <option value="USER">User</option>
            <option value="GROUP">Group</option>
            <option value="SERVICE_PRINCIPAL">Service principal</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Expired">Expired</option>
          </select>

          <button
            className="secondary"
            type="button"
            onClick={() => {
              setQ("");
              setClient("All");
              setType("All");
              setStatus("All");
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
                <th>Principal</th>
                <th>Type</th>
                <th>Role</th>
                <th>Client</th>
                <th>Scope</th>
                <th>Validity period</th>
                <th>Granted by</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => {
                const asgStatus = getStatus(a);
                return (
                  <tr key={a.id}>
                    <td>
                      <b>{a.principalId}</b>
                      <small>{a.id}</small>
                    </td>
                    <td>
                      <Badge
                        tone={
                          a.principalType === "USER"
                            ? "info"
                            : a.principalType === "GROUP"
                            ? "purple"
                            : "neutral"
                        }
                      >
                        {a.principalType === "SERVICE_PRINCIPAL"
                          ? "Service principal"
                          : a.principalType === "USER"
                          ? "User"
                          : "Group"}
                      </Badge>
                    </td>
                    <td>
                      <b className="rolelink">
                        {roles.find((r) => r.roleId === a.roleId)?.name ??
                          a.roleId}
                      </b>
                    </td>
                    <td>
                      {a.clientId === "platform"
                        ? "Platform"
                        : a.clientId.replace("client-", "Client ").toUpperCase()}
                    </td>
                    <td>
                      <Badge>
                        {String(a.scope.name ?? a.scope.type ?? "Default")}
                      </Badge>
                    </td>
                    <td>
                      <div className="dates">
                        {a.validFrom ?? "No start date"}
                        <small>→ {a.validTo ?? "No end date"}</small>
                        <Badge
                          tone={
                            asgStatus === "Active"
                              ? "success"
                              : asgStatus === "Scheduled"
                              ? "info"
                              : "warning"
                          }
                        >
                          {asgStatus}
                        </Badge>
                      </div>
                    </td>
                    <td>{a.grantedBy}</td>
                    <td className="actions">
                      <button
                        type="button"
                        className="iconbtn"
                        onClick={() => setEdit(a)}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="iconbtn danger"
                        onClick={() => setDel(a)}
                        title="Revoke"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!visible.length && (
            <div className="empty">No assignments found.</div>
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
          title={edit ? "Edit role assignment" : "Assign a role"}
          close={() => setEdit(undefined)}
        >
          <form onSubmit={submit}>
            <div className="modalbody">
              <div className="formgrid">
                <label>
                  Principal type
                  <select
                    name="type"
                    defaultValue={edit?.principalType ?? "USER"}
                  >
                    <option value="USER">User</option>
                    <option value="GROUP">Group</option>
                    <option value="SERVICE_PRINCIPAL">Service principal</option>
                  </select>
                </label>

                <label>
                  Principal *
                  <input
                    name="principal"
                    required
                    defaultValue={edit?.principalId ?? ""}
                    placeholder="Email, group or service identity"
                  />
                </label>

                <label>
                  Client
                  <select
                    name="client"
                    defaultValue={edit?.clientId ?? "client-abc"}
                  >
                    <option value="client-abc">Client ABC</option>
                    <option value="client-xyz">Client XYZ</option>
                    <option value="platform">Platform</option>
                  </select>
                </label>

                <label>
                  Role
                  <select
                    name="role"
                    defaultValue={edit?.roleId ?? roles[0]?.roleId}
                  >
                    {roles.map((r) => (
                      <option key={r.roleId} value={r.roleId}>
                        {r.name} · {r.solution}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Scope
                  <select
                    name="scope"
                    defaultValue={String(edit?.scope.name ?? "Client ABC")}
                  >
                    <option>Client ABC</option>
                    <option>Client XYZ</option>
                    <option>Global</option>
                    <option>Selected resource</option>
                  </select>
                </label>

                <label>
                  Granted by *
                  <input
                    name="grantedBy"
                    required
                    defaultValue={edit?.grantedBy ?? "manoj@inextlabs.com"}
                  />
                </label>

                <label>
                  Valid from
                  <input
                    type="date"
                    name="from"
                    defaultValue={edit?.validFrom ?? ""}
                  />
                </label>

                <label>
                  Valid until
                  <input
                    type="date"
                    name="to"
                    defaultValue={edit?.validTo ?? ""}
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
                {edit ? "Save changes" : "Assign role"}
              </button>
            </footer>
          </form>
        </Modal>
      )}

      <IamDeleteModal
        isOpen={Boolean(del)}
        onClose={() => setDel(null)}
        title="Revoke Role Assignment"
        subtitle="Verify revocation request"
        entityName={del?.principalId || ""}
        entitySub={`Role: ${roles.find((r) => r.roleId === del?.roleId)?.name || del?.roleId || ""} · Client: ${del?.clientId || ""}`}
        warningText="Revoking this assignment will immediately remove all access and permissions granted to this principal."
        confirmButtonText="Revoke assignment"
        onConfirm={() => {
          if (del) {
            remove(del.id);
            setDel(null);
            toast("Role assignment revoked");
          }
        }}
      />
    </>
  );
}
