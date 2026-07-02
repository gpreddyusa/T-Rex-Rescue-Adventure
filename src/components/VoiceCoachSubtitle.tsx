import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, MessageSquare, Play, RefreshCw } from "lucide-react";
import { VoicePersona } from "./VoiceCoachSelector";

interface VoiceCoachSubtitleProps {
  currentCaption: string;
  voicePersona: VoicePersona;
  soundEnabled: boolean;
  toggleSound: () => void;
  speak: (text: string, force: boolean) => void;
}

export function VoiceCoachSubtitle({
  currentCaption,
  voicePersona,
  soundEnabled,
  toggleSound,
  speak,
}: VoiceCoachSubtitleProps) {
  if (!currentCaption) return null;

  // Personalization style mapping
  const styles = {
    DINA: {
      name: "Dina 🦖",
      role: "Energetic Assistant Coach",
      bg: "bg-emerald-50 border-emerald-200 text-emerald-950",
      accentBg: "bg-emerald-500",
      accentText: "text-emerald-700",
      glow: "shadow-emerald-100",
      emoji: "🦖",
    },
    JOY: {
      name: "Teacher Joy 👩‍🏫",
      role: "Warm Classroom Helper",
      bg: "bg-purple-50 border-purple-200 text-purple-950",
      accentBg: "bg-purple-500",
      accentText: "text-purple-700",
      glow: "shadow-purple-100",
      emoji: "👩‍🏫",
    },
    OAKWOOD: {
      name: "Professor Oakwood 🦉",
      role: "Wise Nature Scholar",
      bg: "bg-amber-50 border-amber-200 text-amber-950",
      accentBg: "bg-amber-500",
      accentText: "text-amber-700",
      glow: "shadow-amber-100",
      emoji: "🦉",
    },
  }[voicePersona] || {
    name: "Voice Coach",
    role: "Helper Assistant",
    bg: "bg-stone-50 border-stone-200 text-stone-950",
    accentBg: "bg-emerald-500",
    accentText: "text-emerald-700",
    glow: "shadow-stone-100",
    emoji: "🦖",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 mx-auto w-full max-w-4xl rounded-2xl border-2 p-4 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-stretch justify-between gap-4 transition-all duration-300 ${styles.bg} ${styles.glow}`}
      id="voice-coach-live-subtitles"
    >
      {/* Dynamic background subtle pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8888880a_1px,transparent_1px),linear-gradient(to_bottom,#8888880a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Coach Info and Text */}
      <div className="flex items-start gap-3.5 z-10 flex-1">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-3xl shadow-sm animate-bounce duration-1000">
            {styles.emoji}
          </div>
          {soundEnabled && (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 flex items-center justify-center text-[8px] text-white font-bold">
                🔊
              </span>
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-display font-black text-xs text-stone-800">
              {styles.name}
            </span>
            <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">
              {styles.role}
            </span>
          </div>
          <p className="text-xs md:text-sm font-medium mt-1 leading-relaxed text-stone-800 select-text">
            "{currentCaption}"
          </p>
        </div>
      </div>

      {/* Controls panel */}
      <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-stone-200/80 pt-3 md:pt-0 md:pl-4 z-10 justify-end flex-shrink-0">
        {/* Toggle Audio */}
        <button
          onClick={toggleSound}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
            soundEnabled
              ? "bg-white text-stone-700 hover:bg-stone-50 border-stone-200 shadow-xs"
              : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100/60"
          }`}
          title={soundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Speak again button */}
        <button
          onClick={() => speak(currentCaption, true)}
          className={`px-3 py-2.5 rounded-xl font-display font-black text-xs text-white shadow-xs hover:shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${styles.accentBg}`}
          title="Repeat spoken words"
        >
          <Play size={12} className="fill-current" />
          <span>Repeat Coach</span>
        </button>
      </div>
    </motion.div>
  );
}
