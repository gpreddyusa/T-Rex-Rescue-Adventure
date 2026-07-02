import React from "react";
import { Animal } from "../types";
import { AnimalSVG } from "./AnimalSVG";
import { Target, Lock, Heart, ArrowRight } from "lucide-react";
import { SafeAnimalImage } from "./SafeAnimalImage";

interface MissionTargetCardProps {
  currentAnimal: Animal | null;
  tRexPosition: number;
}

export function MissionTargetCard({ currentAnimal, tRexPosition }: MissionTargetCardProps) {
  if (!currentAnimal) {
    return (
      <div className="bg-stone-50 rounded-2xl border-2 border-stone-200 p-5 shadow-sm min-h-[220px] flex flex-col justify-center items-center text-center">
        <Lock className="text-stone-300 mb-2" size={32} />
        <p className="text-sm text-stone-500 font-medium">Select a math level to discover your first mission rescue target!</p>
      </div>
    );
  }

  // Calculate distance remaining
  const rescuePosition = 3; // Position 3 is rescue
  const stepsRemaining = Math.max(0, rescuePosition - tRexPosition);

  return (
    <div className="bg-sky-50 rounded-2xl border-2 border-sky-200/80 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between min-h-[220px]">
      {/* Decorative subtle dot patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c712_1.2px,transparent_1.2px)] bg-[size:12px_12px]" />

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <span className="inline-block text-xs font-mono tracking-widest text-sky-700 bg-sky-100 font-bold px-2 py-0.5 rounded-full uppercase">
            Active Mission
          </span>
          <h3 className="text-xl font-bold font-display text-sky-950 mt-1.5 flex items-center gap-1.5">
            Rescue Target <Heart size={16} className="text-rose-500 fill-rose-500 animate-pulse" />
          </h3>
        </div>
        
        <div className="bg-sky-500/10 text-sky-600 border border-sky-200/50 rounded-xl px-2 py-1 text-[11px] font-mono font-bold flex items-center gap-1">
          <Target size={12} />
          <span>LVL MAP</span>
        </div>
      </div>

      {/* Main visual - The Animal */}
      <div className="relative z-10 flex justify-center py-2 h-28 items-center">
        <div className="relative">
          <SafeAnimalImage
            src={currentAnimal.photoUrl}
            alt={currentAnimal.name}
            emoji={currentAnimal.emoji}
            className="w-24 h-24 rounded-full border-4 border-sky-400 object-cover shadow-md filter hover:brightness-105 transition-all"
          />
          <span className="absolute -bottom-2 -right-2 bg-white rounded-full w-9 h-9 flex items-center justify-center text-xl shadow-md border-2 border-sky-200">
            {currentAnimal.emoji}
          </span>
          {/* Animated rescue cage/bubble or standard look */}
          <div className="absolute -inset-1 rounded-full border-2 border-dashed border-sky-400 animate-[spin_20s_linear_infinite] pointer-events-none" />
        </div>
      </div>

      {/* Bottom status - steps left */}
      <div className="relative z-10 bg-white/90 border border-sky-100/80 rounded-xl px-3.5 py-2 flex items-center justify-between">
        <span className="text-xs font-medium text-sky-900 flex items-center gap-1">
          Target: <strong className="text-sky-950 font-bold">{currentAnimal.name}</strong>
        </span>
        <div className="flex items-center gap-1 font-mono font-bold text-sky-700 text-sm">
          <span>{stepsRemaining} {stepsRemaining === 1 ? "step" : "steps"}</span>
          <ArrowRight size={13} className="text-sky-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
