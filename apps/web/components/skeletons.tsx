export function OpportunitySkeleton() {
  return (
    <div className="rounded-[30px] border border-teal/10 bg-surface/60 backdrop-blur-md p-6 animate-pulse shadow-glow">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-20 rounded-full bg-slate/20"></div>
          <div className="h-6 w-3/4 rounded-full bg-slate/20"></div>
          <div className="h-4 w-full rounded-full bg-slate/20"></div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-3 pt-4">
          <div className="h-4 w-full rounded-full bg-slate/20"></div>
          <div className="h-4 w-5/6 rounded-full bg-slate/20"></div>
        </div>

        {/* Footer skeleton */}
        <div className="flex gap-2 pt-4">
          <div className="h-8 w-20 rounded-full bg-slate/20"></div>
          <div className="h-8 w-24 rounded-full bg-slate/20"></div>
        </div>
      </div>
    </div>
  );
}

export function OpportunitiesLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <OpportunitySkeleton key={i} />
      ))}
    </div>
  );
}

export function ApplicationCardSkeleton() {
  return (
    <div className="rounded-[24px] bg-surface-strong/60 backdrop-blur-md border border-slate/10 p-4 animate-pulse">
      <div className="space-y-3">
        <div className="h-5 w-3/4 rounded-full bg-slate/20"></div>
        <div className="h-4 w-full rounded-full bg-slate/20"></div>
        <div className="h-4 w-5/6 rounded-full bg-slate/20"></div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 rounded-full bg-slate/20"></div>
          <div className="h-6 w-16 rounded-full bg-slate/20"></div>
        </div>
      </div>
    </div>
  );
}

export function ApplicationsLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <ApplicationCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Profile card skeleton */}
      <div className="rounded-[28px] border border-teal/10 bg-surface-strong/60 backdrop-blur-md p-6 animate-pulse lg:col-span-2 shadow-glow">
        <div className="space-y-4">
          <div className="h-4 w-24 rounded-full bg-slate/20"></div>
          <div className="h-6 w-3/4 rounded-full bg-slate/20"></div>
          <div className="h-4 w-full rounded-full bg-slate/20"></div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-[24px] bg-surface-strong/60 backdrop-blur-sm border border-slate/10 p-4 animate-pulse">
            <div className="h-3 w-16 rounded-full bg-slate/20 mb-2"></div>
            <div className="h-6 w-12 rounded-full bg-slate/20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormFieldSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 w-32 rounded-full bg-mist"></div>
      <div className="h-10 w-full rounded-[1rem] bg-mist"></div>
    </div>
  );
}

export function GenericSkeleton({ height = "h-6", width = "w-full" }: { height?: string; width?: string }) {
  return <div className={`${height} ${width} rounded-full bg-slate/20 bg-surface-strong/60 backdrop-blur-sm border border-slate/10 animate-pulse`}></div>;
}
