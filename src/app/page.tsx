'use client'
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Simple PC Builder page for Next.js 15 (App Router)
 * Put this file at `src/app/page.tsx` (or `app/page.tsx` if you didn't use `src/`)
 */

const parts: Record<string, string[]> = {
  cpu: ["Ryzen 5 7600", "Intel i5‑13400", "Ryzen 9 7900X"],
  gpu: ["RTX 4060", "RX 7700 XT", "RTX 4080 SUPER"],
  motherboard: ["B650M", "Z790", "X670E"],
  ram: ["16 GB DDR5", "32 GB DDR5", "64 GB DDR5"],
  psu: ["550 W", "650 W Gold", "750 W Platinum"],
};

export default function Home() {
  const [selection, setSelection] = useState<Record<string, string>>({});

  const handlePick = (part: string, value: string) => {
    setSelection((prev) => ({ ...prev, [part]: value }));
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">PC 选配器 (原型)</h1>

      {/* PART PICKERS */}
      {Object.entries(parts).map(([part, options]) => (
        <section key={part} className="space-y-2">
          <label className="font-medium capitalize">{part}</label>
          <Select onValueChange={(val) => handlePick(part, val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`选择 ${part}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>
      ))}

      {/* CONFIG SUMMARY */}
      <Card>
        <CardContent className="pt-4 space-y-2">
          <h2 className="text-xl font-semibold">当前配置</h2>
          <ul className="list-disc pl-5 text-sm">
            {Object.keys(parts).map((part) => (
              <li key={part}>
                {part.toUpperCase()}: {selection[part] ?? "— 未选择 —"}
              </li>
            ))}
          </ul>
          <Button
            className="w-full mt-4"
            disabled={Object.keys(parts).some((p) => !selection[p])}
            onClick={() => {
              alert(
                `你的配置:\n` +
                  Object.entries(selection)
                    .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                    .join("\n")
              );
            }}
          >
            确认并导出
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
