import { useState } from "react";
import { LEVEL_ANIMALS } from "../data";
import { Trophy, Check, Lock, Star } from "lucide-react";
import { Animal } from "../types";
import { SafeAnimalImage } from "./SafeAnimalImage";

interface ProgressTrackerCardProps {
  currentLevel: number;
  rescuedAnimalIds: string[];
  animals: Record<number, Animal[]>;
}

export function ProgressTrackerCard({
  currentLevel,
  rescuedAnimalIds,
  animals,
}: ProgressTrackerCardProps) {
  const [activeTab, setActiveTab] = useState<number>(currentLevel || 1);

  // Get flat list of all animals
  const allAnimalsFlat = [
    ...animals[1].map((a) => ({ ...a, level: 1 })),
    ...animals[2].map((a) => ({ ...a, level: 2 })),
    ...animals[3].map((a) => ({ ...a, level: 3 })),
  ];

  const rescuedCount = rescuedAnimalIds.length;
  const totalAnimals = allAnimalsFlat.length;

  return (
    <div className="bg-white rounded-2xl border-2 border-stone-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5 mb-3">
        <Trophy className="text-yellow-500 fill-yellow-100" size={18} />
        <h3 className="font-display font-black text-xs text-stone-800 tracking-tight">
          Rescue Achievements
        </h3>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 mb-3.5">
        <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-1.5 text-center">
          <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-stone-400 block">
            Math Level
          </span>
          <span className="text-xs font-black text-emerald-600 block mt-0.5">
            Level {currentLevel || 1}
          </span>
        </div>

        <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-1.5 text-center">
          <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-stone-400 block">
            Baby Buddies
          </span>
          <span className="text-xs font-black text-amber-600 block mt-0.5 flex items-center justify-center gap-0.5">
            <Star size={10} className="fill-yellow-300 text-yellow-500" />
            <span>{rescuedCount} / {totalAnimals}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between gap-1 mb-2.5">
        {[1, 2, 3].map((num) => (
          <button
            key={`tab-${num}`}
            onClick={() => setActiveTab(num)}
            className={`flex-1 text-[9px] font-mono font-black py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === num
                ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100"
            }`}
          >
            {num === 1 ? "🌴 Jungle" : num === 2 ? "🏜️ Desert" : "🌊 Ocean"}
          </button>
        ))}
      </div>

      {/* Rescue Album Grid */}
      <div>
        <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-2 text-center">
          - ZONE {activeTab} ALBUM -
        </span>

        <div className="grid grid-cols-5 gap-1.5 max-h-36 overflow-y-auto pr-0.5">
          {animals[activeTab].map((animal) => {
            const isRescued = rescuedAnimalIds.includes(animal.id);

            return (
              <div
                key={animal.id}
                title={animal.name}
                className={`relative flex flex-col items-center justify-center p-1 rounded-lg border transition-all ${
                  isRescued
                    ? "bg-amber-50/50 border-amber-300 shadow-sm"
                    : "bg-stone-50/80 border-stone-200/50 border-dashed"
                }`}
              >
                {/* Animal Emoji / Real Photo Indicator */}
                <div className="relative">
                  {isRescued ? (
                    <SafeAnimalImage
                      src={animal.photoUrl}
                      alt={animal.name}
                      emoji={animal.emoji}
                      className="w-7 h-7 rounded-full object-cover border border-amber-300 filter saturate-110"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-stone-200/50 flex items-center justify-center text-xs text-stone-300 font-bold select-none border border-stone-200">
                      🔒
                    </div>
                  )}

                  {/* Tiny badge */}
                  {isRescued && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-white shadow-xs flex items-center justify-center">
                      <Check size={5} className="stroke-[4]" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <span className="text-[6px] font-mono font-black text-stone-500 mt-1 text-center truncate w-full leading-none">
                  {animal.name.split(" ").slice(-1)[0] || animal.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
