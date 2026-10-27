import React, { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import RolesPage from "./pages/RolesPage";
import PermissionsPage from "./pages/PermissionsPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import {
  initialAssignments,
  initialPermissions,
  initialRoles,
} from "./data/iamData";
import "./styles/access-management.css";

export function AccessManagementContainer({ page = "roles", onPage }) {
  const [roles, setRoles] = useState(initialRoles);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

  const saveRole = (r) => {
    setRoles((old) =>
      old.some((x) => x.roleId === r.roleId)
        ? old.map((x) => (x.roleId === r.roleId ? r : x))
        : [r, ...old]
    );
  };

  const deleteRole = (id) => {
    setRoles((old) => old.filter((r) => r.roleId !== id));
    setAssignments((old) => old.filter((a) => a.roleId !== id));
  };

  const savePermission = (p, oldKey) => {
    setPermissions((list) => {
      const cleaned = oldKey ? list.filter((x) => x.key !== oldKey) : list;
      return cleaned.some((x) => x.key === p.key)
        ? cleaned.map((x) => (x.key === p.key ? p : x))
        : [p, ...cleaned];
    });

    if (oldKey && oldKey !== p.key) {
      setRoles((list) =>
        list.map((r) => ({
          ...r,
          permissions: r.permissions.map((k) => (k === oldKey ? p.key : k)),
        }))
      );
    }
  };

  const deletePermission = (key) => {
    setPermissions((old) => old.filter((p) => p.key !== key));
    setRoles((old) =>
      old.map((r) => ({
        ...r,
        permissions: r.permissions.filter((x) => x !== key),
      }))
    );
  };

  const saveAssignment = (a) => {
    setAssignments((old) =>
      old.some((x) => x.id === a.id)
        ? old.map((x) => (x.id === a.id ? a : x))
        : [a, ...old]
    );
  };

  const deleteAssignment = (id) => {
    setAssignments((old) => old.filter((a) => a.id !== id));
  };

  const pageTitle =
    page === "roles"
      ? "Roles"
      : page === "permissions"
      ? "Permissions"
      : "Role Assignments";

  return (
    <div className="iam-container">
      {/* Access Management Subbar */}
      <div className="subbar">
        <span className="shield">◇</span>
        <b>Access Management</b>
        <span>/</span>
        <strong>{pageTitle}</strong>
      </div>

      <div className="iam-content">
        {page === "roles" && (
          <RolesPage
            roles={roles}
            permissions={permissions}
            save={saveRole}
            remove={deleteRole}
            toast={notify}
          />
        )}
        {page === "permissions" && (
          <PermissionsPage
            items={permissions}
            save={savePermission}
            remove={deletePermission}
            toast={notify}
          />
        )}
        {page === "assignments" && (
          <AssignmentsPage
            items={assignments}
            roles={roles}
            save={saveAssignment}
            remove={deleteAssignment}
            toast={notify}
          />
        )}
      </div>

      {toast && (
        <div className="toast">
          <CheckCircle2 />
          <span>{toast}</span>
          <button type="button" onClick={() => setToast("")}>
            <X />
          </button>
        </div>
      )}
    </div>
  );
}

export default AccessManagementContainer;
