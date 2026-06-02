/**
 * Reusable skeleton loading components.
 * Usage:
 *   <TableSkeleton cols={6} rows={8} />
 *   <CardSkeleton count={4} />
 *   <SkeletonLine width="w-1/2" height="h-4" />
 */
import React from 'react';

/** Single animated line skeleton */
export const SkeletonLine = ({ width = 'w-full', height = 'h-3', className = '' }) => (
  <div className={`skeleton-pulse rounded-md ${width} ${height} ${className}`} />
);

/** Table row skeleton — mimics a data row */
export const SkeletonRow = ({ cols = 5 }) => (
  <tr className="border-b border-slate-100">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="py-4 px-6">
        {i === 0 ? (
          // First column: avatar + name line
          <div className="flex items-center gap-3">
            <div className="skeleton-pulse w-9 h-9 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="skeleton-pulse h-3 w-28 rounded-md" />
              <div className="skeleton-pulse h-2.5 w-16 rounded-md" />
            </div>
          </div>
        ) : i === cols - 1 ? (
          // Last column: action buttons
          <div className="flex items-center justify-end gap-2">
            <div className="skeleton-pulse w-7 h-7 rounded-xl" />
            <div className="skeleton-pulse w-7 h-7 rounded-xl" />
          </div>
        ) : (
          // Middle columns: single line
          <div className="skeleton-pulse h-3 w-20 rounded-md" />
        )}
      </td>
    ))}
  </tr>
);

/** Full table skeleton */
export const TableSkeleton = ({ cols = 5, rows = 8 }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  </div>
);

/** Stat card skeleton (for dashboard) */
export const CardSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="gov-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="skeleton-pulse h-3 w-24 rounded-md" />
          <div className="skeleton-pulse w-9 h-9 rounded-xl" />
        </div>
        <div className="skeleton-pulse h-8 w-16 rounded-md" />
        <div className="skeleton-pulse h-2.5 w-32 rounded-md" />
      </div>
    ))}
  </div>
);

/** Generic list card skeleton (for card-grid views) */
export const ListCardSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="gov-card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="skeleton-pulse w-12 h-12 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="skeleton-pulse h-3.5 w-32 rounded-md" />
            <div className="skeleton-pulse h-2.5 w-20 rounded-md" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="skeleton-pulse h-2.5 w-full rounded-md" />
          <div className="skeleton-pulse h-2.5 w-4/5 rounded-md" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="skeleton-pulse h-7 flex-1 rounded-lg" />
          <div className="skeleton-pulse h-7 flex-1 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);
