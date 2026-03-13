import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-screen border-b border-surface bg-background">
      <div className="mx-auto flex h-14 items-center justify-between px-10">
        <Link href="/" className="font-mono font-medium">
          <span className="text-accent">&gt;</span>
          <span className="text-foreground">devroast</span>
        </Link>
        <Link
          href="/leaderboard"
          className="font-mono text-sm text-muted hover:text-foreground transition-colors"
        >
          leaderboard
        </Link>
      </div>
    </nav>
  );
}
