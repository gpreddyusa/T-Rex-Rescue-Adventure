import { Check, Sparkles, MessageSquare } from "lucide-react";

export type VoicePersona = "DINA" | "JOY" | "OAKWOOD";

interface VoiceCoachSelectorProps {
  currentPersona: VoicePersona;
  setPersona: (persona: VoicePersona) => void;
  speak: (text: string, force: boolean) => void;
}

export function VoiceCoachSelector({
  currentPersona,
  setPersona,
  speak
}: VoiceCoachSelectorProps) {
  const personas = [
    {
      id: "DINA" as const,
      name: "Dina 🦖",
      role: "Energetic Dino",
      emoji: "🦖",
      bgClass: "from-emerald-50 to-emerald-100/50 hover:from-emerald-100",
      activeBorder: "border-emerald-500 ring-emerald-300",
      textClass: "text-emerald-700",
      greeting: "Roar! Hi friend! I'm Dina! Let's find some amazing baby animals together! Yes!"
    },
    {
      id: "JOY" as const,
      name: "Teacher Joy 👩‍🏫",
      role: "Warm Coach",
      emoji: "👩‍🏫",
      bgClass: "from-purple-50 to-purple-100/50 hover:from-purple-100",
      activeBorder: "border-purple-500 ring-purple-300",
      textClass: "text-purple-700",
      greeting: "Hello sweetie! I am Teacher Joy. You are doing such a wonderful job with your math today!"
    },
    {
      id: "OAKWOOD" as const,
      name: "Professor Oakwood 🦉",
      role: "Wise Teller",
      emoji: "🦉",
      bgClass: "from-amber-50 to-amber-100/50 hover:from-amber-100",
      activeBorder: "border-amber-500 ring-amber-300",
      textClass: "text-amber-700",
      greeting: "Greetings, young explorer! I am Professor Oakwood. Let us embark on an outstanding educational quest!"
    }
  ];

  const handleSelect = (p: typeof personas[number]) => {
    setPersona(p.id);
    // Use a timeout so state update applies before speaking (enabling correct voice filter)
    setTimeout(() => {
      speak(p.greeting, true);
    }, 100);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-stone-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5 mb-3">
        <MessageSquare className="text-purple-500 fill-purple-100" size={18} />
        <h3 className="font-display font-black text-xs text-stone-800 tracking-tight flex items-center gap-1">
          Select Teacher Assistant Voice
        </h3>
      </div>

      <p className="text-[10px] text-stone-500 font-medium leading-relaxed mb-3">
        Tired of robot sounds? Tap a helper below to use <strong>highly engaging, natural premium voices</strong> customized for learning!
      </p>

      {/* Grid of Companions */}
      <div className="flex flex-col gap-2">
        {personas.map((p) => {
          const isActive = currentPersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`w-full text-left p-2.5 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer bg-gradient-to-r relative overflow-hidden group ${
                p.bgClass
              } ${
                isActive
                  ? `${p.activeBorder} ring-4 shadow-sm`
                  : "border-stone-200/80 hover:border-stone-300"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 w-8 h-8 bg-white/30 rounded-full translate-x-2 -translate-y-2 pointer-events-none" />
              )}
              
              <div className="flex items-center gap-2.5 z-10">
                <span className="text-2xl group-hover:scale-110 transition-transform">{p.emoji}</span>
                <div>
                  <h4 className="font-bold text-stone-800 text-xs leading-tight">
                    {p.name}
                  </h4>
                  <span className="text-[9px] font-mono font-bold text-stone-400 block uppercase">
                    {p.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 z-10">
                {isActive ? (
                  <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-white border border-stone-200 shadow-xs flex items-center gap-1 ${p.textClass}`}>
                    <Check size={8} className="stroke-[4]" />
                    Active
                  </span>
                ) : (
                  <span className="text-[9px] font-mono font-bold text-stone-400 hover:text-stone-600 px-1.5 py-0.5">
                    Demo 🔊
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-2.5 text-[8px] font-mono font-semibold text-stone-400 text-center uppercase tracking-widest leading-normal">
        * Works with your browser's premium high-fidelity voices
      </div>
    </div>
  );
}
