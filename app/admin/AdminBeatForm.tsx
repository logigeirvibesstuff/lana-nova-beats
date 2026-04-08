"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";

type Photo = { id: string; thumb: string; full: string; alt: string };

export function AdminBeatForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const bpmRef = useRef<HTMLInputElement>(null);
  const keyRef = useRef<HTMLInputElement>(null);

  async function detectBpm(file: File): Promise<number | null> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new AudioContext();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const data = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;

      // Energy-based beat detection
      const windowSize = Math.floor(sampleRate * 0.01); // 10ms windows
      const energies: number[] = [];
      for (let i = 0; i < data.length - windowSize; i += windowSize) {
        let energy = 0;
        for (let j = 0; j < windowSize; j++) energy += data[i + j] ** 2;
        energies.push(energy / windowSize);
      }

      // Find peaks
      const avgEnergy = energies.reduce((a, b) => a + b, 0) / energies.length;
      const threshold = avgEnergy * 1.5;
      const peaks: number[] = [];
      const minGap = Math.floor(0.3 / 0.01); // min 300ms between beats
      let lastPeak = -minGap;
      for (let i = 1; i < energies.length - 1; i++) {
        if (energies[i] > threshold && energies[i] > energies[i - 1] && energies[i] > energies[i + 1] && i - lastPeak > minGap) {
          peaks.push(i);
          lastPeak = i;
        }
      }

      if (peaks.length < 2) return null;
      const intervals = peaks.slice(1).map((p, i) => (p - peaks[i]) * 0.01);
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      let bpm = Math.round(60 / avgInterval);

      // Normalize to typical BPM range
      while (bpm < 60) bpm *= 2;
      while (bpm > 200) bpm /= 2;

      await audioCtx.close();
      return bpm;
    } catch { return null; }
  }

  async function handleAudioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    setBpm("");
    setKey("");
    try {
      // Try ID3 tags first via server
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/analyze-audio", { method: "POST", body: fd });
      const data = await res.json();
      if (data.bpm) {
        setBpm(String(Math.round(data.bpm)));
      } else {
        // Fall back to client-side audio analysis
        const detectedBpm = await detectBpm(file);
        if (detectedBpm) setBpm(String(detectedBpm));
      }
      if (data.key) setKey(data.key);
    } catch { /* ignore */ } finally {
      setAnalyzing(false);
    }
  }

  // Image search state
  const [imageMode, setImageMode] = useState<"upload" | "search">("upload");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searching, setSearching] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    setSelectedPhoto(null);
    setVisibleCount(12);
    try {
      const res = await fetch(`/api/search-images?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      setSearchResults(data.photos ?? []);
    } catch { /* ignore */ } finally {
      setSearching(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // If image search mode, fetch image and attach as file
    if (imageMode === "search" && selectedPhoto) {
      try {
        const res = await fetch(selectedPhoto.full);
        const blob = await res.blob();
        const ext = blob.type.includes("png") ? "png" : "jpg";
        formData.set("coverImage", new File([blob], `cover.${ext}`, { type: blob.type }));
      } catch {
        setError("Failed to fetch selected image");
        setLoading(false);
        return;
      }
    }

    const res = await fetch("/api/admin/beats", { method: "POST", body: formData });

    if (res.ok) {
      setSuccess(true);
      form.reset();
      setSelectedPhoto(null);
      setSearchResults([]);
      setSearchQuery("");
      setBpm("");
      setKey("");
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
          <label className="text-xs font-medium text-gray-700">BPM * {analyzing && <span className="text-orange-500 font-normal">detecting...</span>}</label>
          <input ref={bpmRef} name="bpm" type="number" required className="input-field" placeholder="e.g. 90" value={bpm} onChange={e => setBpm(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Key * {analyzing && <span className="text-orange-500 font-normal">detecting...</span>}</label>
          <input ref={keyRef} name="key" required className="input-field" placeholder="e.g. A# minor" value={key} onChange={e => setKey(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Genre *</label>
          <input name="genre" required className="input-field" placeholder="e.g. R&B" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Basic Price ($) *</label>
          <input name="priceBasic" type="number" step="0.01" required defaultValue="19.99" className="input-field" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Premium Price ($)</label>
          <input name="pricePremium" type="number" step="0.01" defaultValue="39.99" className="input-field" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Unlimited Price ($)</label>
          <input name="priceUnlimited" type="number" step="0.01" defaultValue="199.99" className="input-field" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Exclusive Price ($)</label>
          <input name="priceExclusive" type="number" step="0.01" defaultValue="799.99" className="input-field" />
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

      {/* Cover Art */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Cover Art *</label>
        <div className="flex gap-2 mb-2">
          {(["upload", "search"] as const).map((mode) => (
            <button key={mode} type="button" onClick={() => setImageMode(mode)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${imageMode === mode ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}>
              {mode === "upload" ? "Upload File" : "Search Image"}
            </button>
          ))}
        </div>

        {imageMode === "upload" && (
          <input name="coverImage" type="file" accept="image/*" required className="input-field py-1.5" />
        )}

        {imageMode === "search" && (
          <div className="space-y-3 border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                placeholder="dark city, neon, forest night..."
                className="flex-1 input-field"
              />
              <button type="button" onClick={handleSearch} disabled={searching || !searchQuery.trim()}
                className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg disabled:opacity-40 hover:bg-gray-800 transition">
                {searching ? "..." : "Search"}
              </button>
            </div>

            {searchResults.length > 0 && (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {searchResults.slice(0, visibleCount).map((photo) => (
                    <button key={photo.id} type="button" onClick={() => setSelectedPhoto(photo)}
                      className={`relative rounded-lg overflow-hidden border-2 transition ${selectedPhoto?.id === photo.id ? "border-black" : "border-transparent hover:border-gray-300"}`}>
                      <img src={photo.thumb} alt={photo.alt} className="w-full h-20 object-cover" />
                      {selectedPhoto?.id === photo.id && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                            <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {visibleCount < searchResults.length && (
                  <button type="button" onClick={() => setVisibleCount(v => v + 12)}
                    className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-black border border-gray-200 hover:border-gray-400 rounded-lg transition">
                    Show more ({searchResults.length - visibleCount} left)
                  </button>
                )}
              </>
            )}
            {selectedPhoto && (
              <p className="text-xs text-gray-500">Image selected ✓</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-700">Audio Preview (MP3) *</label>
        <input name="previewUrl" type="file" accept="audio/*" required className="input-field py-1.5" onChange={handleAudioChange} />
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
