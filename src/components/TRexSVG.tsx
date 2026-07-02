import { motion } from "motion/react";

interface TRexSVGProps {
  state: "happy" | "eating" | "idle";
}

export function TRexSVG({ state }: TRexSVGProps) {
  const isEating = state === "eating";
  const isHappy = state === "happy";

  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <motion.svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-xl"
        animate={
          isHappy
            ? { y: [0, -8, 0, -8, 0], rotate: [0, 3, -3, 3, 0] }
            : isEating
            ? { scale: [1, 1.04, 1] }
            : { y: [0, -1.5, 0] }
        }
        transition={{
          duration: isHappy ? 0.6 : isEating ? 0.35 : 2.5,
          repeat: isEating ? Infinity : isHappy ? 1 : Infinity,
          ease: "easeInOut"
        }}
      >
        <defs>
          {/* Majestic realistic reptile skin gradient */}
          <linearGradient id="reRexSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3f20" /> {/* Dark emerald moss */}
            <stop offset="60%" stopColor="#2c5e3b" /> {/* Forest reptile green */}
            <stop offset="100%" stopColor="#142c1b" /> {/* Shadow green */}
          </linearGradient>

          {/* Golden textured underbelly */}
          <linearGradient id="reRexBelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d99c26" />
            <stop offset="100%" stopColor="#8c580f" />
          </linearGradient>

          {/* Muscle highlight & shadow gradients */}
          <linearGradient id="rexHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f9e68" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2c5e3b" stopOpacity="0" />
          </linearGradient>
          
          <radialGradient id="rexEyeIris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#facc15" /> {/* Piercing Amber Yellow */}
            <stop offset="70%" stopColor="#ca8a04" /> 
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>
        </defs>

        {/* --- DETAILED REALISTIC T-REX BODY PARTS --- */}

        {/* 1. Powerful reptilian tail with muscle curves */}
        <motion.path
          d="M 35 70 Q 5 82 8 100 Q 22 92 40 76 Z"
          fill="url(#reRexSkin)"
          animate={isHappy ? { rotate: [-5, 8, -5], y: [0, -2, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        />
        {/* Tail Ridges */}
        <motion.path
          d="M 12 95 Q 16 90 19 93 Q 23 85 27 88 Q 32 80 35 82"
          fill="none"
          stroke="#142c1b"
          strokeWidth="3.5"
          strokeLinecap="round"
          animate={isHappy ? { rotate: [-5, 8, -5] } : {}}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        />

        {/* 2. Far Back Leg (Shadowed) */}
        <g opacity="0.75" transform="translate(-4, 2)">
          {/* Thigh */}
          <path d="M 45 70 Q 30 82 42 95 Q 48 95 48 85 Z" fill="#142c1b" />
          {/* Calf & Foot */}
          <path d="M 42 90 L 38 105 L 48 107 L 46 95 Z" fill="#0d1f12" />
          {/* Sharp Claws */}
          <path d="M 38 105 L 34 107 L 38 103 Z M 43 107 L 40 109 L 43 105 Z" fill="#f5f5f4" />
        </g>

        {/* 3. Main Torso / Ribcage */}
        <path d="M 35 60 Q 52 48 65 65 Q 60 85 42 82 Q 30 75 35 60 Z" fill="url(#reRexSkin)" />
        
        {/* 4. Textured Rib / Muscle highlights */}
        <path d="M 42 62 Q 50 55 54 65" fill="none" stroke="url(#rexHighlight)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 38 68 Q 46 62 48 72" fill="none" stroke="url(#rexHighlight)" strokeWidth="2.5" strokeLinecap="round" />

        {/* 5. Golden Muscle Underbelly */}
        <path d="M 45 74 Q 56 78 62 67 Q 58 83 45 81 Z" fill="url(#reRexBelly)" opacity="0.9" />

        {/* 6. Strong neck */}
        <path d="M 52 58 L 68 40 L 54 42 Z" fill="url(#reRexSkin)" />
        <path d="M 56 56 Q 66 48 64 42" fill="none" stroke="url(#rexHighlight)" strokeWidth="4" />

        {/* 7. Upper Head (Brave, realistic sharp jaws) */}
        <motion.g
          animate={isEating ? { rotate: [-3, 3, -3], y: [0, -1, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.25 }}
        >
          {/* Realistic T-Rex skull silhouette */}
          <path
            d="M 54 42 C 54 22 76 20 86 20 C 102 20 105 32 104 40 C 96 42 80 43 74 41 C 66 39 56 42 54 42 Z"
            fill="url(#reRexSkin)"
          />
          {/* Brow ridge / bone structure */}
          <path
            d="M 68 28 Q 78 23 88 28"
            fill="none"
            stroke="#112214"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Piercing Realistic Reptilian Eye */}
          <circle cx="78" cy="29" r="5" fill="#112214" />
          <circle cx="78" cy="29" r="4" fill="url(#rexEyeIris)" />
          {/* Slit Pupil */}
          <ellipse cx="78" cy="29" rx="1.1" ry="3.5" fill="black" />
          {/* Eye Sparkle */}
          <circle cx="79.2" cy="27.5" r="0.9" fill="white" />

          {/* Sharp, terrifying top teeth row */}
          <polygon points="82,41 84,45 86,41" fill="#f5f5f4" />
          <polygon points="87,41 89,46 91,41" fill="#f5f5f4" />
          <polygon points="92,40 94,46 96,40" fill="#f5f5f4" />
          <polygon points="97,39 99,44 101,39" fill="#f5f5f4" />
        </motion.g>

        {/* 8. Animated Lower Jaw with realistic chin structure */}
        <motion.path
          d="M 56 42 L 96 41 L 92 48 C 84 53 66 50 56 42"
          fill="#142c1b"
          transformOrigin="56px 42px"
          animate={isEating ? { rotate: [0, 20, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.25 }}
        />
        {/* Lower sharp teeth row */}
        <motion.g
          transformOrigin="56px 42px"
          animate={isEating ? { rotate: [0, 20, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.25 }}
        >
          <polygon points="84,42 85,39 87,42" fill="#f5f5f4" />
          <polygon points="89,42 91,38 93,42" fill="#f5f5f4" />
          <polygon points="94,41 95,38 97,41" fill="#f5f5f4" />
        </motion.g>

        {/* 9. Near Front Leg (Incredibly muscular & powerful) */}
        <g>
          {/* Thigh muscular bulge */}
          <path d="M 56 68 C 45 74 52 90 62 94 C 68 85 68 74 56 68 Z" fill="url(#reRexSkin)" />
          <path d="M 52 74 Q 56 84 62 80" fill="none" stroke="url(#rexHighlight)" strokeWidth="3" />
          
          {/* Calf */}
          <path d="M 58 88 L 52 108 L 64 110 L 61 92 Z" fill="#1e3f20" />
          {/* Sharp Talons / Claws */}
          <path d="M 52 108 L 47 111 L 52 106 Z M 57 110 L 53 113 L 57 108 Z M 62 109 L 60 112 L 62 107 Z" fill="#f5f5f4" stroke="#142c1b" strokeWidth="0.5" />
        </g>

        {/* 10. Tiny Sharp Predatory Arms */}
        <motion.path
          d="M 64 58 Q 74 58 72 65 L 75 64 M 72 65 L 74 68"
          stroke="#142c1b"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          animate={isHappy ? { rotate: [-10, 15, -10], y: [0, -1, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.35 }}
        />

        {/* Back scales / Ridges along head, neck, and body */}
        <path d="M 58 24 L 60 21 L 62 25" fill="#0d1f12" />
        <path d="M 64 24 L 66 21 L 68 25" fill="#0d1f12" />
        <path d="M 70 23 L 72 19 L 74 24" fill="#0d1f12" />
        <path d="M 53 50 L 50 48 L 51 52" fill="#0d1f12" />
        <path d="M 45 54 L 42 51 L 43 55" fill="#0d1f12" />
        <path d="M 37 58 L 34 55 L 35 59" fill="#0d1f12" />
      </motion.svg>
    </div>
  );
}
