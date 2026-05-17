'use client';

import { STATUS_COLORS, STATUS_LABELS } from '@/lib/utils';

interface StatusChipProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusChip({ status, size = 'md' }: StatusChipProps) {
  const colorClass = STATUS_COLORS[status] ?? 'bg-slate-700 text-slate-300';
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${colorClass} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}
