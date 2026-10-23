import { LoadingLabel, Skeleton } from "@/components/Skeletons";

export default function DashboardLoading() {
  return (
    <div role="status" className="space-y-4">
      <LoadingLabel>Loading dashboard</LoadingLabel>
      <div className="flex items-end justify-between">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <Skeleton className="h-80 rounded-lg" />
    </div>
  );
}
