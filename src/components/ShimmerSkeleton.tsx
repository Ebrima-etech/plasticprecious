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
