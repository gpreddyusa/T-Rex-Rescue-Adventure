import { motion } from "motion/react";

interface AnimalSVGProps {
  id: string;
  state: "happy" | "shy" | "dig";
}

export function AnimalSVG({ id, state }: AnimalSVGProps) {
  const isHappy = state === "happy";
  const isDig = state === "dig";

  const renderSVGContent = () => {
    switch (id) {
      case "monkey":
        return (
          <>
            {/* Round ears */}
            <circle cx="20" cy="50" r="14" fill="#a16207" />
            <circle cx="20" cy="50" r="8" fill="#fed7aa" />
            <circle cx="80" cy="50" r="14" fill="#a16207" />
            <circle cx="80" cy="50" r="8" fill="#fed7aa" />
            {/* Head */}
            <circle cx="50" cy="50" r="30" fill="#a16207" />
            {/* Peach-colored face */}
            <path d="M 50 30 C 40 30 35 40 38 52 C 40 60 45 65 50 65 C 55 65 60 60 62 52 C 65 40 60 30 50 30 Z" fill="#fed7aa" />
            {/* Eyes */}
            <circle cx="43" cy="45" r="4.5" fill="white" />
            <circle cx="43" cy="45" r="2" fill="black" />
            <circle cx="57" cy="45" r="4.5" fill="white" />
            <circle cx="57" cy="45" r="2" fill="black" />
            {/* Cheeks */}
            <circle cx="39" cy="54" r="3" fill="#f43f5e" opacity="0.5" />
            <circle cx="61" cy="54" r="3" fill="#f43f5e" opacity="0.5" />
            {/* Mouth */}
            <path d="M 45 56 Q 50 61 55 56" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
      case "sloth":
        return (
          <>
            {/* Branch */}
            <path d="M 5 25 L 95 35" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
            {/* Hanging arms */}
            <path d="M 30 28 L 35 45" stroke="#a1a1aa" strokeWidth="8" strokeLinecap="round" />
            <path d="M 70 32 L 65 45" stroke="#a1a1aa" strokeWidth="8" strokeLinecap="round" />
            {/* Body */}
            <ellipse cx="50" cy="52" rx="22" ry="18" fill="#d4d4d8" />
            {/* Head */}
            <circle cx="50" cy="48" r="14" fill="#a1a1aa" />
            {/* Sloth face patch */}
            <ellipse cx="50" cy="48" rx="10" ry="8" fill="#f4f4f5" />
            {/* Eye patches */}
            <ellipse cx="46" cy="48" rx="4" ry="2.5" fill="#71717a" transform="rotate(-15 46 48)" />
            <ellipse cx="54" cy="48" rx="4" ry="2.5" fill="#71717a" transform="rotate(15 54 48)" />
            {/* Eyes */}
            <circle cx="46" cy="48" r="1.5" fill="black" />
            <circle cx="54" cy="48" r="1.5" fill="black" />
            {/* Smile */}
            <path d="M 48 51 Q 50 53 52 51" stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </>
        );
      case "jaguar":
        return (
          <>
            {/* Ears */}
            <polygon points="25,32 35,16 45,28" fill="#d97706" />
            <polygon points="75,32 65,16 55,28" fill="#d97706" />
            <polygon points="28,30 35,20 42,28" fill="#fee2e2" />
            <polygon points="72,30 65,20 58,28" fill="#fee2e2" />
            {/* Head */}
            <circle cx="50" cy="45" r="24" fill="#f59e0b" />
            {/* spots */}
            <circle cx="36" cy="36" r="3" fill="#78350f" />
            <circle cx="64" cy="36" r="3" fill="#78350f" />
            <circle cx="50" cy="27" r="2.5" fill="#78350f" />
            {/* Snout */}
            <ellipse cx="50" cy="52" rx="10" ry="7" fill="#fef08a" />
            {/* Nose */}
            <polygon points="47,48 53,48 50,51" fill="#f43f5e" />
            {/* Eyes */}
            <circle cx="40" cy="41" r="4" fill="white" />
            <circle cx="40" cy="41" r="2" fill="black" />
            <circle cx="60" cy="41" r="4" fill="white" />
            <circle cx="60" cy="41" r="2" fill="black" />
            {/* Whiskers */}
            <line x1="34" y1="52" x2="22" y2="50" stroke="#fef08a" strokeWidth="2" />
            <line x1="34" y1="54" x2="24" y2="56" stroke="#fef08a" strokeWidth="2" />
            <line x1="66" y1="52" x2="78" y2="50" stroke="#fef08a" strokeWidth="2" />
            <line x1="66" y1="54" x2="76" y2="56" stroke="#fef08a" strokeWidth="2" />
            {/* Smile */}
            <path d="M 47 54 Q 50 56 53 54" stroke="#78350f" strokeWidth="2" fill="none" />
          </>
        );
      case "roadrunner":
        return (
          <>
            {/* Feather Crest */}
            <path d="M 40 28 Q 28 10 44 18" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 44 26 Q 34 14 46 20" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Head */}
            <circle cx="48" cy="34" r="14" fill="#3b82f6" />
            {/* Beak */}
            <path d="M 48 34 L 85 30 L 48 38 Z" fill="#fb923c" />
            {/* Eye */}
            <circle cx="44" cy="30" r="4.5" fill="white" />
            <circle cx="44" cy="30" r="2" fill="black" />
            {/* Body and neck */}
            <path d="M 48 44 Q 48 64 36 68" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" fill="none" />
            <ellipse cx="32" cy="68" rx="16" ry="12" fill="#2563eb" />
            {/* Legs */}
            <line x1="26" y1="76" x2="26" y2="88" stroke="#fb923c" strokeWidth="3" />
            <line x1="36" y1="76" x2="36" y2="88" stroke="#fb923c" strokeWidth="3" />
          </>
        );
      case "fox":
        return (
          <>
            {/* GIGANTIC ears */}
            <path d="M 24 35 Q 8 6 28 20" fill="#f97316" />
            <path d="M 21 32 Q 12 11 24 22" fill="#ffedd5" />
            <path d="M 76 35 Q 92 6 72 20" fill="#f97316" />
            <path d="M 79 32 Q 88 11 76 22" fill="#ffedd5" />
            {/* Head */}
            <circle cx="50" cy="45" r="20" fill="#f97316" />
            <path d="M 32 45 Q 50 56 68 45 Z" fill="#ffedd5" />
            {/* Big Eyes */}
            <circle cx="41" cy="40" r="5" fill="white" />
            <circle cx="41" cy="40" r="2.5" fill="black" />
            <circle cx="59" cy="40" r="5" fill="white" />
            <circle cx="59" cy="40" r="2.5" fill="black" />
            {/* Cute Nose */}
            <circle cx="50" cy="51" r="2" fill="black" />
            {/* Blush */}
            <circle cx="36" cy="46" r="2" fill="#f43f5e" opacity="0.6" />
            <circle cx="64" cy="46" r="2" fill="#f43f5e" opacity="0.6" />
          </>
        );
      case "lizard":
        return (
          <>
            {/* Tail */}
            <path d="M 22 75 Q 10 65 14 55 Q 24 58 28 68 Z" fill="#22c55e" />
            {/* Body */}
            <ellipse cx="44" cy="65" rx="18" ry="12" fill="#22c55e" />
            <ellipse cx="44" cy="65" rx="14" ry="8" fill="#eab308" opacity="0.8" />
            {/* Head */}
            <circle cx="52" cy="42" r="14" fill="#22c55e" />
            {/* Big side eyes */}
            <circle cx="42" cy="35" r="5" fill="#facc15" />
            <circle cx="42" cy="35" r="2" fill="black" />
            <circle cx="62" cy="35" r="5" fill="#facc15" />
            <circle cx="62" cy="35" r="2" fill="black" />
            {/* Smile */}
            <path d="M 48 45 Q 52 49 56 45" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
      case "dolphin":
        return (
          <>
            {/* Dolphin jumping curve */}
            <path d="M 12 70 Q 50 15 88 54 Q 78 68 62 60 Q 50 48 12 70 Z" fill="#60a5fa" />
            {/* Fin */}
            <path d="M 48 38 L 54 20 Q 64 28 58 42 Z" fill="#3b82f6" />
            {/* Tail flukes */}
            <path d="M 88 54 L 98 46 L 94 56 L 98 64 Z" fill="#3b82f6" />
            {/* Eye */}
            <circle cx="28" cy="50" r="3.5" fill="white" />
            <circle cx="28" cy="50" r="1.5" fill="black" />
            {/* Splash */}
            <ellipse cx="45" cy="74" rx="22" ry="5" fill="#e0f2fe" opacity="0.7" />
          </>
        );
      case "octopus":
        return (
          <>
            {/* Sea Bubbles */}
            <circle cx="22" cy="22" r="3" fill="#93c5fd" opacity="0.6" />
            <circle cx="78" cy="18" r="4.5" fill="#93c5fd" opacity="0.6" />
            {/* Tentacles */}
            <path d="M 32 60 Q 20 72 26 84 Q 32 84 34 72" fill="#ec4899" />
            <path d="M 44 64 Q 44 80 48 84 Q 52 80 50 64" fill="#ec4899" />
            <path d="M 56 64 Q 56 80 60 84 Q 64 80 62 64" fill="#ec4899" />
            <path d="M 68 60 Q 80 72 74 84 Q 68 84 66 72" fill="#ec4899" />
            {/* Head */}
            <circle cx="50" cy="45" r="22" fill="#ec4899" />
            {/* Blushing checks */}
            <circle cx="38" cy="48" r="3" fill="#f43f5e" opacity="0.7" />
            <circle cx="62" cy="48" r="3" fill="#f43f5e" opacity="0.7" />
            {/* Eyes */}
            <circle cx="42" cy="41" r="4" fill="white" />
            <circle cx="42" cy="41" r="2" fill="black" />
            <circle cx="58" cy="41" r="4" fill="white" />
            <circle cx="58" cy="41" r="2" fill="black" />
            {/* Smile */}
            <path d="M 46 50 Q 50 53 54 50" stroke="#be185d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
      case "whale":
        return (
          <>
            {/* Fountain spout */}
            <path d="M 50 20 L 50 10 Q 42 12 40 6" stroke="#93c5fd" strokeWidth="3" fill="none" />
            <path d="M 50 15 Q 58 12 60 6" stroke="#93c5fd" strokeWidth="3" fill="none" />
            {/* Whale Chubby body */}
            <path d="M 10 50 Q 50 18 90 50 Q 75 75 50 72 Q 25 72 10 50 Z" fill="#3b82f6" />
            {/* Spout platform */}
            <ellipse cx="50" cy="34" rx="6" ry="1.5" fill="#2563eb" />
            {/* Flipper */}
            <path d="M 46 62 Q 40 76 54 68 Z" fill="#2563eb" />
            {/* Smiling mouth */}
            <path d="M 18 52 Q 25 60 36 53" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Eye */}
            <circle cx="25" cy="44" r="4" fill="white" />
            <circle cx="25" cy="44" r="1.8" fill="black" />
            {/* Blushing cheek */}
            <circle cx="32" cy="47" r="2.5" fill="#f43f5e" opacity="0.6" />
          </>
        );
      default:
        return <circle cx="50" cy="50" r="30" fill="gray" />;
    }
  };

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        animate={
          isHappy
            ? { y: [0, -12, 0, -12, 0], scale: [1, 1.05, 1, 1.05, 1] }
            : isDig
            ? { x: [-2, 2, -2, 2, 0], scale: 0.9 }
            : { y: [0, -4, 0] }
        }
        transition={{
          duration: isHappy ? 0.7 : isDig ? 0.4 : 3,
          repeat: isHappy ? 2 : isDig ? Infinity : Infinity,
          ease: "easeInOut"
        }}
      >
        {renderSVGContent()}
      </motion.svg>
    </div>
  );
}
