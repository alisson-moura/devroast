"use client";

import { useState } from "react";
import { ActionsBar } from "@/components/actions-bar";
import { CodeEditor } from "@/components/ui/code-editor";
import { useLanguageDetection } from "@/hooks/use-language-detection";

export function HomeEditor() {
  const [code, setCode] = useState("");
  const [manualLanguage, setManualLanguage] = useState<string | null>(null);
  const { detectedLanguage } = useLanguageDetection(code);

  const resolvedLanguage = manualLanguage ?? detectedLanguage;

  return (
    <>
      <CodeEditor
        value={code}
        onChange={setCode}
        language={resolvedLanguage}
        onLanguageChange={setManualLanguage}
        className="w-full max-w-3xl mx-auto"
      />
      <ActionsBar code={code} language={resolvedLanguage} />
    </>
  );
}
