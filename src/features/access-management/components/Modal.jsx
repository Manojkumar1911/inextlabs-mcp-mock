import React from "react";
import { X } from "lucide-react";

export default function Modal({ title, close, children }) {
  return (
    <div
      className="backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <section className="modal">
        <header>
          <div>
            <h2>{title}</h2>
            <p>Enter the details below to continue.</p>
          </div>
          <button className="iconbtn" onClick={close} type="button">
            <X size={16} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
