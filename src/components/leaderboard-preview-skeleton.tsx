export function LeaderboardPreviewSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-md border border-surface">
        {/* Header */}
        <div className="grid grid-cols-[3rem_5rem_1fr_7rem] border-b border-surface bg-code-bg text-muted text-xs font-mono font-medium px-4 py-2.5">
          <span>#</span>
          <span>score</span>
          <span>snippet</span>
          <span>lang</span>
        </div>
        {/* Skeleton rows */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid grid-cols-[3rem_5rem_1fr_7rem] items-start px-4 py-3 border-b border-surface last:border-0"
          >
            <span className="inline-block h-3 w-4 rounded bg-surface animate-pulse mt-0.5" />
            <span className="inline-block h-5 w-10 rounded bg-surface animate-pulse" />
            <span className="flex flex-col gap-1">
              <span className="inline-block h-3 w-48 rounded bg-surface animate-pulse" />
              <span className="inline-block h-3 w-36 rounded bg-surface animate-pulse" />
              <span className="inline-block h-3 w-40 rounded bg-surface animate-pulse" />
            </span>
            <span className="inline-block h-3 w-16 rounded bg-surface animate-pulse mt-0.5" />
          </div>
        ))}
      </div>
      <p className="font-mono text-xs text-muted text-center">
        <span className="inline-block h-3 w-56 rounded bg-surface animate-pulse" />
      </p>
    </div>
  );
}
