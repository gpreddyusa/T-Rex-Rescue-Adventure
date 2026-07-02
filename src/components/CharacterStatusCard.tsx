import React from "react";
import { TRexSVG } from "./TRexSVG";
import { Volume2, VolumeX, Sparkles, Trophy } from "lucide-react";
import { SafeAnimalImage } from "./SafeAnimalImage";

interface CharacterStatusCardProps {
  screen: string;
  stars: number;
  soundEnabled: boolean;
  toggleSound: () => void;
  speak: (text: string) => void;
  useRealRexy: boolean;
  setUseRealRexy: (val: boolean) => void;
}

export function CharacterStatusCard({
  screen,
  stars,
  soundEnabled,
  toggleSound,
  speak,
  useRealRexy,
  setUseRealRexy
}: CharacterStatusCardProps) {
  return (
    <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-200/80 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between min-h-[240px]">
      {/* Decorative subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:14px_14px]" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <span className="inline-block text-xs font-mono tracking-widest text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full uppercase">
            Rescue Hero
          </span>
          <h3 className="text-xl font-bold font-display text-emerald-900 mt-1.5 flex items-center gap-1.5">
            Rexy <span className="text-base">🦖</span>
          </h3>
        </div>
        
        <div className="flex flex-col items-end gap-1.5">
          {/* Sound toggle */}
          <button
            onClick={() => {
              toggleSound();
              if (!soundEnabled) {
                speak("Sound is back on! Let's rescue more animals!");
              }
            }}
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
              soundEnabled
                ? "bg-emerald-500 border-emerald-600 text-white shadow-sm hover:scale-105"
                : "bg-stone-100 border-stone-200 text-stone-400 hover:bg-stone-200"
            }`}
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Real vs Cartoon toggle */}
          <button
            onClick={() => {
              const nextVal = !useRealRexy;
              setUseRealRexy(nextVal);
              speak(nextVal ? "Roar! Look at my high fidelity baby dinosaur picture! Let's study!" : "Back to my cartoon friend!");
            }}
            className="text-[8px] font-mono font-black uppercase px-2 py-1 rounded-lg border flex items-center gap-1 transition-all cursor-pointer bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-100/50 shadow-xs active:scale-95"
            title="Toggle between real T-Rex photo and cartoon SVG"
          >
            {useRealRexy ? "🎨 Cartoon" : "🦖 Real 3D"}
          </button>
        </div>
      </div>

      {/* Main visual - Rexy */}
      <div className="relative z-10 flex justify-center py-2 h-28 items-center">
        {useRealRexy ? (
          <div className="relative group">
            <SafeAnimalImage
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
              alt="Real Majestic T-Rex"
              emoji="🦖"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-emerald-400 shadow-md filter saturate-110 group-hover:scale-105 transition-transform duration-300"
              fallbackElement={
                <TRexSVG state={screen === "EATING" ? "eating" : screen === "VICTORY" ? "happy" : "idle"} />
              }
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-900 text-[8px] font-mono font-black px-1.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              3D Real ✨
            </div>
          </div>
        ) : (
          <TRexSVG state={screen === "EATING" ? "eating" : screen === "VICTORY" ? "happy" : "idle"} />
        )}
      </div>

      {/* Bottom stats - Stars */}
      <div className="relative z-10 bg-white/90 border border-emerald-100/80 rounded-xl px-3.5 py-2 flex items-center justify-between">
        <span className="text-xs font-medium text-emerald-800 flex items-center gap-1">
          <Trophy size={14} className="text-amber-500 animate-bounce" />
          Score
        </span>
        <div className="flex items-center gap-1 font-mono font-bold text-amber-600 text-lg">
          <Sparkles size={16} className="text-amber-400 animate-pulse" />
          <span>{stars}</span>
          <span className="text-xs text-stone-400 font-normal ml-0.5">Stars</span>
        </div>
      </div>
    </div>
  );
}
