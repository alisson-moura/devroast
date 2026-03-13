"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppSwitch } from "@/components/ui/switch";

export function ActionsBar() {
  const [roastMode, setRoastMode] = useState(false);

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
      <Button size="sm" variant="solid">
        $ roast_my_code
      </Button>
    </div>
  );
}
