import { motion } from "motion/react";

interface HelperDinoSVGProps {
  state: "idle" | "pointing" | "happy";
}

export function HelperDinoSVG({ state }: HelperDinoSVGProps) {
  const isHappy = state === "happy";
  const isPointing = state === "pointing";

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        animate={
          isHappy
            ? { y: [0, -6, 0, -6, 0], rotate: [0, 3, -3, 3, 0] }
            : isPointing
            ? { rotate: [0, 2, -2, 0], scale: [1, 1.02, 1] }
            : { y: [0, -3, 0] }
        }
        transition={{
          duration: isHappy ? 0.6 : isPointing ? 1.5 : 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Tail - Wagging */}
        <motion.path
          d="M 20 60 Q 5 65 8 50 Q 18 52 22 58"
          fill="#a855f7"
          animate={isHappy ? { rotate: [-15, 15, -15] } : { rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          style={{ transformOrigin: "20px 55px" }}
        />

        {/* Stegosaurus Plates (back plates) */}
        <path d="M 32 40 L 38 28 L 44 40" fill="#facc15" />
        <path d="M 46 36 L 52 24 L 58 36" fill="#facc15" />
        <path d="M 60 38 L 66 26 L 72 38" fill="#facc15" />

        {/* Back Leg */}
        <ellipse cx="40" cy="72" rx="6" ry="10" fill="#7e22ce" />

        {/* Chubby Body */}
        <ellipse cx="50" cy="56" rx="22" ry="16" fill="#a855f7" />
        {/* Light tummy patch */}
        <ellipse cx="54" cy="58" rx="14" ry="10" fill="#e9d5ff" />

        {/* Front Leg */}
        <ellipse cx="58" cy="73" rx="7" ry="10" fill="#a855f7" />

        {/* Neck */}
        <path d="M 64 50 Q 72 40 76 34" stroke="#a855f7" strokeWidth="12" strokeLinecap="round" />

        {/* Head */}
        <circle cx="76" cy="30" r="12" fill="#a855f7" />

        {/* Cheerful Eye */}
        <circle cx="80" cy="28" r="3" fill="white" />
        <circle cx="81" cy="28" r="1.5" fill="black" />
        <circle cx="81.5" cy="27" r="0.5" fill="white" />

        {/* Cheek */}
        <circle cx="74" cy="33" r="2.5" fill="#f43f5e" opacity="0.6" />

        {/* Cute Little Smile */}
        <path d="M 78 34 Q 81 37 83 33" stroke="#6b21a8" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Mini Pointing/Waving Arm */}
        <motion.path
          d="M 66 54 Q 78 54 74 60"
          stroke="#7e22ce"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          animate={isPointing ? { rotate: [-10, 20, -10] } : isHappy ? { y: [-2, 2, -2] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
          style={{ transformOrigin: "66px 54px" }}
        />
      </motion.svg>
    </div>
  );
}
