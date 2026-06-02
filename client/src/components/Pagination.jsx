/**
 * Reusable Pagination component.
 *
 * Props:
 *   currentPage  {number}   — 1-indexed current page
 *   totalPages   {number}   — total page count
 *   onPageChange {Function} — called with new page number
 *   totalItems   {number}   — optional: total record count to display "X of Y"
 *   pageSize     {number}   — optional: items per page for the "of" label
 */
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, pageSize }) => {
  if (totalPages <= 1) return null;

  // Build page number window: always show first, last, and up to 3 around current
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // pages around current
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      }
    }

    // Insert ellipsis markers
    const withEllipsis = [];
    let prev = null;
    for (const page of pages) {
      if (prev !== null && page - prev > 1) {
        withEllipsis.push('...');
      }
      withEllipsis.push(page);
      prev = page;
    }
    return withEllipsis;
  };

  const startItem = totalItems ? (currentPage - 1) * (pageSize || 10) + 1 : null;
  const endItem   = totalItems ? Math.min(currentPage * (pageSize || 10), totalItems) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100">
      {/* Record count label */}
      <p className="text-[11px] font-semibold text-slate-400">
        {totalItems != null
          ? <>Showing <span className="font-bold text-slate-600">{startItem}–{endItem}</span> of <span className="font-bold text-slate-600">{totalItems}</span> records</>
          : <>Page <span className="font-bold text-slate-600">{currentPage}</span> of <span className="font-bold text-slate-600">{totalPages}</span></>
        }
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="First page"
        >
          <ChevronsLeft size={13} />
        </button>

        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft size={13} />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((item, idx) =>
          item === '...' ? (
            <span key={`ellipsis-${idx}`} className="w-7 h-7 flex items-center justify-center text-slate-300 text-xs font-bold select-none">
              ···
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                currentPage === item
                  ? 'bg-secondary text-white shadow-sm shadow-secondary/30'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
              aria-label={`Page ${item}`}
              aria-current={currentPage === item ? 'page' : undefined}
            >
              {item}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <ChevronRight size={13} />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Last page"
        >
          <ChevronsRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
