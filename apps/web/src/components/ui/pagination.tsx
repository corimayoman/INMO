import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="btn-ghost p-2 disabled:opacity-40">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn('w-9 h-9 rounded-lg text-sm font-medium transition-colors', p === page ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100')}
        >
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="btn-ghost p-2 disabled:opacity-40">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
