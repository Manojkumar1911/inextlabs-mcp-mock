import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

export function CustomSelect({
  value,
  onChange,
  options = [
    { value: "streamableHttp", label: "Streamable HTTP", disabled: false },
    { value: "sse", label: "Server-Sent Events (SSE)", disabled: true, tag: "Coming Soon" },
    { value: "stdio", label: "STDIO", disabled: true, tag: "Coming Soon" },
  ],
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const currentOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className={`custom-select-wrap ${open ? "is-open" : ""}`} ref={containerRef}>
      <button
        type="button"
        className={`custom-select-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{currentOption?.label}</span>
        <ChevronDown
          style={{
            width: 15,
            height: 15,
            color: "#7b8492",
            transition: "transform .2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <div className="custom-select-menu" role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                className={`custom-select-option ${opt.disabled ? "disabled" : ""} ${
                  isSelected ? "selected" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!opt.disabled) {
                    onChange(opt.value);
                    setOpen(false);
                  }
                }}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
              >
                <span>{opt.label}</span>
                {opt.tag ? (
                  <span className="coming-soon-tag">{opt.tag}</span>
                ) : isSelected ? (
                  <Check style={{ width: 14, height: 14, color: "#f4513b", flexShrink: 0 }} />
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function TransportSelect(props) {
  return <CustomSelect {...props} />;
}
