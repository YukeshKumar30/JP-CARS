export function VehicleCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-jp-border dark:border-jp-border-dark bg-white dark:bg-jp-dark">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="flex gap-3">
          <div className="skeleton h-3 w-12 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-3 w-14 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-1.5">
            <div className="skeleton h-6 w-28 rounded" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
          <div className="flex gap-1.5">
            <div className="skeleton w-8 h-8 rounded-lg" />
            <div className="skeleton w-8 h-8 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
