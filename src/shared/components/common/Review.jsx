import React from "react";
import { Pencil } from "lucide-react";
import { Info } from "./UIComponents";

export function Review({ title, rows, onEdit }) {
  return (
    <div className="review">
      <div className="review-head">
        <b>{title}</b>
        <button className="text-action" onClick={onEdit}>
          <Pencil size={13} /> Edit
        </button>
      </div>
      {rows.map(([a, b]) => (
        <Info key={a} label={a} value={b} />
      ))}
    </div>
  );
}
