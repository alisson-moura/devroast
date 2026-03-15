import { ImageResponse } from "@takumi-rs/image-response";
import { TRPCError } from "@trpc/server";
import { caller } from "@/trpc/server";

const VERDICT_COLORS: Record<string, string> = {
  needs_serious_help: "#EF4444",
  rough_around_edges: "#F97316",
  decent_code: "#F59E0B",
  solid_work: "#10B981",
  exceptional: "#3B82F6",
};

function truncateQuote(quote: string, max = 120): string {
  if (quote.length <= max) return quote;
  return `${quote.slice(0, max)}...`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let roast: Awaited<ReturnType<typeof caller.roast.getById>>;
  try {
    roast = await caller.roast.getById({ id });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
      return new Response("Invalid ID", { status: 400 });
    }
    console.error("[og] Failed to fetch roast", { id, error });
    return new Response("Internal Server Error", { status: 500 });
  }

  if (!roast) {
    return new Response("Not Found", { status: 404 });
  }

  const verdictColor = VERDICT_COLORS[roast.verdict] ?? "#4B5563";
  const formattedScore = roast.score.toFixed(1);

  return new ImageResponse(
    <div
      tw="flex flex-col items-center justify-center w-full h-full bg-[#0A0A0A]"
      style={{ gap: 28, padding: 64, fontFamily: "Geist Mono" }}
    >
      {/* Logo */}
      <div tw="flex items-center" style={{ gap: 8 }}>
        <span tw="text-2xl font-bold" style={{ color: "#10B981" }}>
          &gt;
        </span>
        <span tw="text-xl font-medium" style={{ color: "#FAFAFA" }}>
          devroast
        </span>
      </div>

      {/* Score */}
      <div tw="flex items-end" style={{ gap: 4 }}>
        <span
          tw="font-black"
          style={{ fontSize: 160, lineHeight: 1, color: "#F59E0B" }}
        >
          {formattedScore}
        </span>
        <span tw="text-6xl" style={{ lineHeight: 1, color: "#4B5563" }}>
          /10
        </span>
      </div>

      {/* Verdict */}
      <div tw="flex items-center" style={{ gap: 8 }}>
        <div
          tw="rounded-full"
          style={{
            width: 12,
            height: 12,
            backgroundColor: verdictColor,
          }}
        />
        <span tw="text-xl" style={{ color: verdictColor }}>
          {roast.verdict}
        </span>
      </div>

      {/* Language info */}
      <span tw="text-base" style={{ color: "#4B5563" }}>
        lang: {roast.language} · {roast.lineCount} lines
      </span>

      {/* Quote */}
      {roast.roastQuote && (
        <span
          tw="text-center"
          style={{
            fontSize: 22,
            lineHeight: 1.5,
            color: "#FAFAFA",
            maxWidth: 900,
          }}
        >
          &ldquo;{truncateQuote(roast.roastQuote)}&rdquo;
        </span>
      )}
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": "image/png",
      },
    },
  );
}
