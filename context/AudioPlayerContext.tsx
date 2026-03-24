"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import type { Beat } from "@/types/beat";

interface AudioPlayerContextValue {
  currentBeatId: string | null;
  currentBeat: Beat | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  withVocals: boolean;
  togglePlay: (beat: Beat, playlist?: Beat[]) => void;
  toggleVocals: (beat: Beat) => void;
  seek: (time: number) => void;
  playNext: () => void;
  playPrev: () => void;
  stop: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [playlist, setPlaylist] = useState<Beat[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [withVocals, setWithVocals] = useState(false);

  const currentBeatId = currentBeat?.id ?? null;

  const ensureAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
      audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      audioRef.current = audio;
    }
    return audioRef.current;
  };

  const playBeat = (beat: Beat, vocals = false) => {
    const audio = ensureAudio();
    audio.src = vocals && beat.vocalsUrl ? beat.vocalsUrl : beat.previewUrl;
    setCurrentBeat(beat);
    setWithVocals(vocals);
    setCurrentTime(0);
    setDuration(0);
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    fetch(`/api/beats/${beat.slug}/play`, { method: "POST" }).catch(() => {});
  };

  const togglePlay = (beat: Beat, newPlaylist?: Beat[]) => {
    const audio = ensureAudio();
    const isCurrent = currentBeat?.id === beat.id;

    if (newPlaylist) setPlaylist(newPlaylist);

    if (isCurrent && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (isCurrent && !isPlaying) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      return;
    }

    playBeat(beat, false);
  };

  const toggleVocals = (beat: Beat) => {
    if (!beat.vocalsUrl) return;
    const newVocals = !withVocals;
    const audio = ensureAudio();
    const wasPlaying = currentBeat?.id === beat.id && isPlaying;
    const savedTime = audio.currentTime;

    audio.src = newVocals ? beat.vocalsUrl : beat.previewUrl;
    setWithVocals(newVocals);
    setCurrentBeat(beat);

    if (wasPlaying) {
      audio.load();
      audio.currentTime = savedTime;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const playNext = () => {
    if (!currentBeat || playlist.length === 0) return;
    const idx = playlist.findIndex((b) => b.id === currentBeat.id);
    const next = playlist[(idx + 1) % playlist.length];
    if (next) playBeat(next, false);
  };

  const playPrev = () => {
    if (!currentBeat || playlist.length === 0) return;
    const idx = playlist.findIndex((b) => b.id === currentBeat.id);
    const prev = playlist[(idx - 1 + playlist.length) % playlist.length];
    if (prev) playBeat(prev, false);
  };

  const stop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentBeat(null);
    setCurrentTime(0);
    setDuration(0);
    setWithVocals(false);
  };

  return (
    <AudioPlayerContext.Provider value={{ currentBeatId, currentBeat, isPlaying, currentTime, duration, withVocals, togglePlay, toggleVocals, seek, playNext, playPrev, stop }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
}
