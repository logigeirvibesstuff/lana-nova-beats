"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AdminBeatForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/admin/beats", { method: "POST", body: formData });

    if (res.ok) {
      setSuccess(true);
      form.reset();
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Title *</label>
          <input name="title" required className="input-field" placeholder="e.g. Midnight City" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">BPM *</label>
          <input name="bpm" type="number" required className="input-field" placeholder="e.g. 90" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Key *</label>
          <input name="key" required className="input-field" placeholder="e.g. A# minor" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Genre *</label>
          <input name="genre" required className="input-field" placeholder="e.g. R&B" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Price ($) *</label>
          <input name="defaultPrice" type="number" step="0.01" required defaultValue="19.99" className="input-field" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Moods (comma separated)</label>
          <input name="moods" className="input-field" placeholder="e.g. rnb, vibes, smooth" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-medium text-gray-700">Tags (comma separated)</label>
          <input name="tags" className="input-field" placeholder="e.g. drake, bryson tiller" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Cover Art *</label>
          <input name="coverImage" type="file" accept="image/*" required className="input-field py-1.5" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Audio Preview (MP3) *</label>
          <input name="previewUrl" type="file" accept="audio/*" required className="input-field py-1.5" />
        </div>
      </div>

      <div className="border-t border-black/10 pt-4 space-y-3">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Download Links (Google Drive)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Basic</label>
            <input name="basic" className="input-field" placeholder="https://drive.google.com/..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Premium</label>
            <input name="premium" className="input-field" placeholder="https://drive.google.com/..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Unlimited</label>
            <input name="unlimited" className="input-field" placeholder="https://drive.google.com/..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Exclusive</label>
            <input name="exclusive" className="input-field" placeholder="https://drive.google.com/..." />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input name="featured" type="checkbox" value="true" id="featured" className="h-4 w-4" />
        <label htmlFor="featured" className="text-sm text-gray-700">Featured on homepage</label>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Uploading..." : "Add Beat"}
        </Button>
        {success && <p className="text-sm text-green-600 font-medium">Beat added successfully!</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  );
}
