"use client";

import { Popover } from "@base-ui/react/popover";
import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

type ShareTarget = {
  label: string;
  icon: React.ReactNode;
  action: (url: string, text: string) => void;
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      role="img"
      aria-label="X"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      role="img"
      aria-label="LinkedIn"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      role="img"
      aria-label="WhatsApp"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const SHARE_TARGETS: ShareTarget[] = [
  {
    label: "copy_link",
    icon: <Copy className="size-3.5" />,
    action: (url) => {
      navigator.clipboard.writeText(url);
    },
  },
  {
    label: "twitter_x",
    icon: <XIcon className="size-3.5" />,
    action: (url, text) => {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer",
      );
    },
  },
  {
    label: "linkedin",
    icon: <LinkedInIcon className="size-3.5" />,
    action: (url) => {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        "_blank",
        "noopener,noreferrer",
      );
    },
  },
  {
    label: "whatsapp",
    icon: <WhatsAppIcon className="size-3.5" />,
    action: (url, text) => {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
        "_blank",
        "noopener,noreferrer",
      );
    },
  },
];

type SharePopoverProps = {
  roastId: string;
  score: number;
  verdict: string;
};

export function SharePopover({ roastId, score, verdict }: SharePopoverProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/result/${roastId}`;
  }, [roastId]);

  const getShareText = useCallback(() => {
    return `my code got a ${score}/10 — verdict: ${verdict} | devroast`;
  }, [score, verdict]);

  function handleAction(target: ShareTarget) {
    const url = getShareUrl();
    const text = getShareText();
    target.action(url, text);

    if (target.label === "copy_link") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Popover.Root>
      <Popover.Trigger className="inline-flex items-center gap-2 border border-surface px-4 py-2 font-mono text-xs text-accent cursor-pointer select-none transition-all duration-150 hover:bg-surface/30 hover:border-accent/40 active:scale-[0.98] before:content-['$_'] before:text-accent/60">
        share_roast
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} side="bottom" align="start">
          <Popover.Popup className="origin-[var(--transform-origin)] rounded-md border border-surface bg-background p-1 font-mono shadow-lg shadow-black/50 transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <div className="flex flex-col">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-subtle">
                share via
              </div>
              {SHARE_TARGETS.map((target) => (
                <button
                  key={target.label}
                  type="button"
                  onClick={() => handleAction(target)}
                  className="group flex items-center gap-3 rounded px-3 py-2 text-xs text-foreground transition-colors duration-100 hover:bg-surface/60 hover:text-accent cursor-pointer"
                >
                  <span className="text-accent/60 transition-colors group-hover:text-accent">
                    &gt;
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-subtle transition-colors group-hover:text-accent">
                      {target.icon}
                    </span>
                    {target.label === "copy_link" && copied ? (
                      <span className="flex items-center gap-1.5 text-accent">
                        <Check className="size-3" />
                        copied!
                      </span>
                    ) : (
                      target.label
                    )}
                  </span>
                </button>
              ))}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
