import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ total, page, size, setPage }) {
  const pages = Math.max(1, Math.ceil(total / size));
  const startItem = total ? (page - 1) * size + 1 : 0;
  const endItem = Math.min(page * size, total);

  return (
    <div className="pagination">
      <span>
        Showing {startItem}–{endItem} of {total} results
      </span>
      <div>
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>
        <b>{page}</b>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => setPage(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
