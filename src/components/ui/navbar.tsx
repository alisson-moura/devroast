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
          className="animate-flicker font-mono text-sm text-critical hover:text-critical/80 transition-colors"
          style={{ textShadow: "0 0 8px rgba(239,68,68,0.5)" }}
        >
          hall_of_shame
        </Link>
      </div>
    </nav>
  );
}
