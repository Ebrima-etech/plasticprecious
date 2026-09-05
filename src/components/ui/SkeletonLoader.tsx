import React from 'react';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  className?: string;
}

const baseStyles = 'bg-neutral-200 animate-pulse';

export const SkeletonLoader = ({
  width = '100%',
  height = '20px',
  circle = false,
  className,
}: SkeletonLoaderProps) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${circle ? 'rounded-full' : 'rounded-md'}
        ${className || ''}
      `}
      style={style}
    />
  );
};

// Common skeleton patterns
export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-base p-6 space-y-4">
    <SkeletonLoader height="20px" />
    <SkeletonLoader height="16px" width="80%" />
    <SkeletonLoader height="16px" width="90%" />
    <SkeletonLoader height="40px" />
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr className="border-b border-neutral-100">
    {Array(columns)
      .fill(null)
      .map((_, i) => (
        <td key={i} className="px-6 py-4">
          <SkeletonLoader height="16px" width={Math.random() * 40 + 60 + '%'} />
        </td>
      ))}
  </tr>
);

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-base">
    <SkeletonLoader height="200px" />
    <div className="p-4 space-y-3">
      <SkeletonLoader height="18px" />
      <SkeletonLoader height="16px" width="85%" />
      <SkeletonLoader height="40px" />
    </div>
  </div>
);
