'use client';

const shimmerStyle = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  .shimmer-loading {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
`;

let styleInjected = false;

export function ShimmerSkeleton({ className = '' }: { className?: string }) {
  if (typeof document !== 'undefined' && !styleInjected) {
    const style = document.createElement('style');
    style.textContent = shimmerStyle;
    document.head.appendChild(style);
    styleInjected = true;
  }

  return <div className={`shimmer-loading rounded-lg ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200">
      <ShimmerSkeleton className="w-full h-96 lg:h-72" />
      <div className="p-4 lg:p-6 space-y-3">
        <ShimmerSkeleton className="w-3/4 h-6" />
        <ShimmerSkeleton className="w-full h-4" />
        <ShimmerSkeleton className="w-full h-4" />
        <div className="flex justify-between pt-2">
          <ShimmerSkeleton className="w-1/4 h-8" />
          <ShimmerSkeleton className="w-1/4 h-10" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-4 lg:gap-6`}>
      {Array.from({ length: columns }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ImageSkeleton({ className = 'w-full h-96' }: { className?: string }) {
  return <ShimmerSkeleton className={className} />;
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <ShimmerSkeleton className="w-10 h-10 rounded" />
          <div className="flex-1">
            <ShimmerSkeleton className="w-24 h-4 mb-2" />
            <ShimmerSkeleton className="w-16 h-3" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <ShimmerSkeleton className="w-32 h-4" />
      </td>
      <td className="px-6 py-4">
        <ShimmerSkeleton className="w-20 h-4" />
      </td>
      <td className="px-6 py-4">
        <ShimmerSkeleton className="w-16 h-4" />
      </td>
      <td className="px-6 py-4">
        <ShimmerSkeleton className="w-24 h-6 rounded-full" />
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <ShimmerSkeleton className="w-8 h-8 rounded" />
          <ShimmerSkeleton className="w-8 h-8 rounded" />
        </div>
      </td>
    </tr>
  );
}

export function AdminTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">
                <ShimmerSkeleton className="w-24 h-3" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">
                <ShimmerSkeleton className="w-20 h-3" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">
                <ShimmerSkeleton className="w-16 h-3" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">
                <ShimmerSkeleton className="w-16 h-3" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">
                <ShimmerSkeleton className="w-20 h-3" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">
                <ShimmerSkeleton className="w-20 h-3" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminFormSkeleton() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <ShimmerSkeleton className="w-40 h-8" />
        </div>

        <div className="p-6 space-y-6">
          <div>
            <ShimmerSkeleton className="w-32 h-4 mb-2" />
            <ShimmerSkeleton className="w-full h-10 rounded-md" />
          </div>

          <div>
            <ShimmerSkeleton className="w-32 h-4 mb-2" />
            <ShimmerSkeleton className="w-full h-24 rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <ShimmerSkeleton className="w-24 h-4 mb-2" />
              <ShimmerSkeleton className="w-full h-10 rounded-md" />
            </div>
            <div>
              <ShimmerSkeleton className="w-20 h-4 mb-2" />
              <ShimmerSkeleton className="w-full h-10 rounded-md" />
            </div>
          </div>

          <div>
            <ShimmerSkeleton className="w-28 h-4 mb-2" />
            <ShimmerSkeleton className="w-full h-10 rounded-md" />
          </div>

          <div>
            <ShimmerSkeleton className="w-32 h-4 mb-2" />
            <ShimmerSkeleton className="w-full h-32 rounded-md" />
          </div>

          <div className="flex gap-3">
            <ShimmerSkeleton className="flex-1 h-10 rounded-md" />
            <ShimmerSkeleton className="flex-1 h-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <ShimmerSkeleton className="w-40 h-8 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <ShimmerSkeleton className="w-24 h-4 mb-4" />
              <ShimmerSkeleton className="w-32 h-8 mb-2" />
              <ShimmerSkeleton className="w-20 h-3" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <ShimmerSkeleton className="w-32 h-8 mb-4" />
        <AdminTableSkeleton rows={5} />
      </div>
    </div>
  );
}
