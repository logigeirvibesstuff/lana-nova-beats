"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface Beat {
  id: string;
  title: string;
  slug: string;
  downloadUrls: { basic?: string; premium?: string; unlimited?: string; exclusive?: string } | null;
}

export function BeatLinkEditor({ beats }: { beats: Beat[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [links, setLinks] = useState<Record<string, { basic: string; premium: string; unlimited: string; exclusive: string }>>(
    Object.fromEntries(
      beats.map((b) => [
        b.id,
        {
          basic: (b.downloadUrls as any)?.basic ?? "",
          premium: (b.downloadUrls as any)?.premium ?? "",
          unlimited: (b.downloadUrls as any)?.unlimited ?? "",
          exclusive: (b.downloadUrls as any)?.exclusive ?? "",
        },
      ])
    )
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function handleSave(id: string) {
    setSaving(id);
    const res = await fetch(`/api/admin/beats/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(links[id]),
    });
    setSaving(null);
    if (res.ok) {
      setSaved(id);
      setTimeout(() => setSaved(null), 2000);
    }
  }

  return (
    <div className="space-y-2">
      {beats.map((beat) => (
        <div key={beat.id} className="border border-black/10 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === beat.id ? null : beat.id)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">{beat.title}</span>
            <span className="text-xs text-gray-400">{expanded === beat.id ? "▲" : "▼"}</span>
          </button>

          {expanded === beat.id && (
            <div className="px-4 pb-4 pt-1 space-y-3 bg-gray-50 border-t border-black/5">
              {(["basic", "premium", "unlimited", "exclusive"] as const).map((tier) => (
                <div key={tier} className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 capitalize">{tier}</label>
                  <input
                    type="text"
                    value={links[beat.id]?.[tier] ?? ""}
                    onChange={(e) =>
                      setLinks((prev) => ({
                        ...prev,
                        [beat.id]: { ...prev[beat.id], [tier]: e.target.value },
                      }))
                    }
                    placeholder="https://drive.google.com/..."
                    className="w-full rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
              ))}
              <Button
                size="sm"
                disabled={saving === beat.id}
                onClick={() => handleSave(beat.id)}
              >
                {saving === beat.id ? "Saving..." : saved === beat.id ? "✓ Saved" : "Save links"}
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
