"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppSwitch } from "@/components/ui/switch";
import { trpc } from "@/trpc/client";

const MAX_CHARS = 2000;

type ActionsBarProps = {
  code: string;
  language: string | null;
};

export function ActionsBar({ code, language }: ActionsBarProps) {
  const [roastMode, setRoastMode] = useState(true);
  const router = useRouter();

  const { mutate, isPending } = trpc.createRoast.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/result/${id}`);
    },
  });

  const isDisabled =
    !code.trim() || code.length > MAX_CHARS || !language || isPending;

  const handleSubmit = () => {
    if (isDisabled) return;
    mutate({ code, language, roastMode });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <AppSwitch
          checked={roastMode}
          onCheckedChange={setRoastMode}
          label="roast mode"
        />
        <span className="font-mono text-sm text-muted">
          {"// maximum sarcasm enabled"}
        </span>
      </div>
      <Button
        size="sm"
        variant="solid"
        disabled={isDisabled}
        onClick={handleSubmit}
        className="min-w-36 whitespace-nowrap justify-center transition-all duration-300"
      >
        <span className="transition-opacity duration-300">
          {isPending ? "// roasting..." : "$ roast_my_code"}
        </span>
      </Button>
    </div>
  );
}
