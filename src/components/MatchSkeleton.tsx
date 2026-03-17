import { Skeleton } from "@/components/ui/skeleton";

const MatchSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
    <div className="flex justify-between">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-12" />
    </div>
    <div className="flex justify-between">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-5 w-28" />
    </div>
    <div className="grid grid-cols-3 gap-2">
      <Skeleton className="h-10 rounded-lg" />
      <Skeleton className="h-10 rounded-lg" />
      <Skeleton className="h-10 rounded-lg" />
    </div>
  </div>
);

export default MatchSkeleton;
