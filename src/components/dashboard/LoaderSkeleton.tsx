
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoaderSkeletonProps {
  lines?: number;
  height?: string;
}

const LoaderSkeleton: React.FC<LoaderSkeletonProps> = ({ lines = 3, height = "h-12" }) => (
  <div className="space-y-2">
    {[...Array(lines)].map((_, i) => (
      <Skeleton key={i} className={`${height} w-full`} />
    ))}
  </div>
);

export default LoaderSkeleton;
