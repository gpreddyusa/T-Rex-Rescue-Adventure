import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Lightbulb, PlayCircle, Columns } from "lucide-react";

interface MathTeachBoardProps {
  num1: number;
  num2: number;
  operator: "+" | "-" | "x";
  answer: number;
}

export function MathTeachBoard({ num1, num2, operator, answer }: MathTeachBoardProps) {
  const [step, setStep] = useState<number>(0);

  // Determine if it is a multi-digit/complex problem
  const isMultiDigit = (num1 >= 10 && num2 >= 10) || (num1 >= 10 && operator !== "x");

  // Extract ones and tens digits
  const getDigits = (num: number) => {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return { tens, ones };
  };

  const d1 = getDigits(num1);
  const d2 = getDigits(num2);
  const ansDigits = getDigits(answer);

  // Render Single-Digit Teaching (Simple Visual Items)
  const renderSingleDigitTeaching = () => {
    if (operator === "+") {
      return (
        <div className="text-center p-3">
          <p className="text-xs font-bold text-stone-700 mb-2">
            Let's teach T-Rex how to count and add! 🦖
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 mb-3 bg-stone-50 border border-stone-200 p-3 rounded-xl">
            {/* Num1 group */}
            <div className="flex flex-wrap gap-1 border border-emerald-200 bg-emerald-50/50 p-2 rounded-lg">
              {Array.from({ length: num1 }).map((_, i) => (
                <span key={`add1-${i}`} className="text-xl filter drop-shadow">🍎</span>
              ))}
              <span className="text-[10px] font-bold text-emerald-800 block w-full mt-1">
                {num1} Red Apples
              </span>
            </div>

            <span className="text-lg font-black text-stone-500">+</span>

            {/* Num2 group */}
            <div className="flex flex-wrap gap-1 border border-yellow-200 bg-yellow-50/50 p-2 rounded-lg">
              {Array.from({ length: num2 }).map((_, i) => (
                <span key={`add2-${i}`} className="text-xl filter drop-shadow">🍌</span>
              ))}
              <span className="text-[10px] font-bold text-yellow-800 block w-full mt-1">
                {num2} Yellow Bananas
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-normal">
            To add them, let's count them all together! Start from 1 up to {answer}:
          </p>
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {Array.from({ length: answer }).map((_, i) => (
              <span
                key={`cnt-${i}`}
                className="w-5 h-5 rounded-full bg-amber-500 text-white font-mono font-bold text-[9px] flex items-center justify-center border border-amber-600 shadow-sm animate-bounce"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {i + 1}
              </span>
            ))}
          </div>
          <p className="text-xs font-black text-amber-700 mt-2">
            So, {num1} + {num2} equals {answer}! Yum! 😋
          </p>
        </div>
      );
    }

    if (operator === "-") {
      return (
        <div className="text-center p-3">
          <p className="text-xs font-bold text-stone-700 mb-2">
            Let's teach T-Rex how to take away! 🥭
          </p>
          <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl mb-3">
            <span className="text-[10px] font-mono font-bold text-stone-400 block mb-1">
              WE HAVE {num1} MANGOES AT START
            </span>
            <div className="flex flex-wrap justify-center gap-1.5 p-2">
              {Array.from({ length: num1 }).map((_, i) => {
                const isTaken = i >= num1 - num2;
                return (
                  <div key={`sub-${i}`} className="relative">
                    <span className={`text-2xl block filter drop-shadow ${isTaken ? "opacity-30 grayscale" : ""}`}>
                      🥭
                    </span>
                    {isTaken && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-red-500 font-bold text-xl drop-shadow select-none">❌</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-500 block mt-1">
              TAKE AWAY {num2} MANGOES WITH A RED ❌
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-normal">
            Now, just count the sweet yellow mangoes that are NOT crossed out!
          </p>
          <div className="flex justify-center gap-1 mt-2">
            {Array.from({ length: answer }).map((_, i) => (
              <span
                key={`subcnt-${i}`}
                className="w-5 h-5 rounded-full bg-emerald-500 text-white font-mono font-bold text-[10px] flex items-center justify-center border border-emerald-600 shadow-sm"
              >
                {i + 1}
              </span>
            ))}
          </div>
          <p className="text-xs font-black text-emerald-700 mt-2.5">
            We are left with {answer} mangoes! {num1} - {num2} = {answer}! 🎉
          </p>
        </div>
      );
    }

    // Multiplication
    return (
      <div className="text-center p-3">
        <p className="text-xs font-bold text-stone-700 mb-2">
          Let's teach T-Rex how groups make big numbers! 🍅
        </p>
        <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl mb-2 flex flex-wrap justify-center gap-2 max-h-36 overflow-y-auto">
          {Array.from({ length: num1 }).map((_, g) => (
            <div key={`teach-g-${g}`} className="border-2 border-dashed border-amber-300 bg-amber-50/50 rounded-lg p-1 text-center min-w-[55px]">
              <span className="text-[8px] font-mono font-bold text-amber-700 block mb-0.5">
                Group {g + 1}
              </span>
              <div className="flex justify-center gap-0.5">
                {Array.from({ length: num2 }).map((_, itemIdx) => (
                  <span key={`item-${g}-${itemIdx}`} className="text-sm">🍅</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-stone-600 leading-normal">
          We have {num1} separate baskets, and each basket holds {num2} tomatoes.
          If we add all of them, {num2} + {num2} {num1 > 2 ? `+ ${num2}` : ""}{num1 > 3 ? `+ ${num2}` : ""}, we get {answer}!
        </p>
        <p className="text-xs font-black text-amber-700 mt-2">
          Multiplication is just adding groups! {num1} x {num2} = {answer}! 🦖
        </p>
      </div>
    );
  };

  // Render Multi-Digit Column Teaching (Tens and Ones)
  const renderMultiDigitTeaching = () => {
    return (
      <div className="p-1">
        {/* Navigation Steps Indicator */}
        <div className="flex justify-between items-center bg-stone-100/80 border border-stone-200/60 rounded-xl px-2 py-1.5 mb-3.5">
          <span className="text-[9px] font-mono font-black text-purple-700 uppercase tracking-wider flex items-center gap-1">
            <Columns size={12} /> COLUMNS WORKBOARD
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map((idx) => (
              <button
                key={`btn-step-${idx}`}
                onClick={() => setStep(idx)}
                className={`text-[8px] font-mono font-black px-2 py-0.5 rounded-md border transition-all ${
                  step === idx
                    ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                    : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
                }`}
              >
                {idx === 0 ? "1. ONES" : idx === 1 ? "2. TENS" : "3. COMPLETE!"}
              </button>
            ))}
          </div>
        </div>

        {/* The Math Grid & Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Math Board Column Graph */}
          <div className="bg-stone-900 text-stone-100 font-mono rounded-2xl p-4 border-4 border-stone-800 shadow-inner text-center select-none relative overflow-hidden">
            <div className="absolute top-1 right-2 text-[8px] font-mono text-stone-500 uppercase tracking-widest">
              CHALKBOARD
            </div>

            {/* Grid Columns */}
            <div className="grid grid-cols-2 border-b border-stone-700 pb-1 text-xs font-black tracking-wider text-amber-400">
              <div className={`py-1 rounded-md transition-all ${step === 1 ? "bg-purple-950/60 text-purple-300 font-extrabold ring-1 ring-purple-500/50" : ""}`}>
                [ TENS ]
              </div>
              <div className={`py-1 rounded-md transition-all ${step === 0 ? "bg-amber-950/60 text-amber-300 font-extrabold ring-1 ring-amber-500/50" : ""}`}>
                [ ONES ]
              </div>
            </div>

            {/* Number 1 */}
            <div className="grid grid-cols-2 py-1.5 text-2xl font-black text-stone-200">
              <div className={`transition-all rounded ${step === 1 ? "text-purple-400 scale-110 bg-purple-950/30 font-black" : ""}`}>
                {d1.tens || " "}
              </div>
              <div className={`transition-all rounded ${step === 0 ? "text-amber-400 scale-110 bg-amber-950/30 font-black" : ""}`}>
                {d1.ones}
              </div>
            </div>

            {/* Number 2 */}
            <div className="grid grid-cols-2 py-1.5 text-2xl font-black text-stone-200 border-b-4 border-stone-600 relative">
              <span className="absolute left-1 top-1.5 text-stone-400 font-black text-xl">
                {operator}
              </span>
              <div className={`transition-all rounded ${step === 1 ? "text-purple-400 scale-110 bg-purple-950/30 font-black" : ""}`}>
                {d2.tens || " "}
              </div>
              <div className={`transition-all rounded ${step === 0 ? "text-amber-400 scale-110 bg-amber-950/30 font-black" : ""}`}>
                {d2.ones}
              </div>
            </div>

            {/* Answer Row */}
            <div className="grid grid-cols-2 py-2 text-3xl font-black">
              {/* Tens Answer */}
              <div className={`transition-all duration-300 rounded ${
                step >= 1 
                  ? "text-purple-300 font-black bg-purple-950/40" 
                  : "text-stone-700/50 font-normal"
              }`}>
                {step >= 1 ? ansDigits.tens : "?"}
              </div>

              {/* Ones Answer */}
              <div className={`transition-all duration-300 rounded ${
                step >= 0 
                  ? "text-amber-300 font-black bg-amber-950/40" 
                  : "text-stone-700/50 font-normal"
              }`}>
                {step >= 0 ? ansDigits.ones : "?"}
              </div>
            </div>
          </div>

          {/* Explanation Text and Interactive Visual Blocks */}
          <div className="flex flex-col justify-between min-h-[140px] bg-purple-50/50 border border-purple-100 rounded-xl p-3">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-stone-700"
                >
                  <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">
                    Step 1: Ones Column
                  </span>
                  <p className="text-xs font-bold mt-1.5 leading-normal">
                    Always start on the <span className="text-amber-600 underline decoration-2">RIGHT</span> side with the **Ones**! 
                  </p>
                  <p className="text-xs mt-1 text-stone-600 leading-normal">
                    Subtract first: <strong className="text-stone-800">{d1.ones}</strong> minus <strong className="text-stone-800">{d2.ones}</strong>.
                  </p>
                  
                  {/* Micro Visual representation */}
                  <div className="flex items-center gap-1.5 mt-2 bg-white/70 border border-amber-200/60 p-1.5 rounded-lg">
                    <div className="flex gap-0.5 flex-wrap">
                      {Array.from({ length: d1.ones }).map((_, i) => (
                        <span key={`blk1-${i}`} className="text-sm">🍬</span>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">-{d2.ones} taken ❌</span>
                    <ArrowRight size={10} className="text-stone-400" />
                    <span className="text-xs font-black text-amber-600">Leaves {ansDigits.ones}!</span>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-stone-700"
                >
                  <span className="text-[9px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full uppercase">
                    Step 2: Tens Column
                  </span>
                  <p className="text-xs font-bold mt-1.5 leading-normal">
                    Now move to the <span className="text-purple-700 underline decoration-2">LEFT</span> side to subtract the **Tens**!
                  </p>
                  <p className="text-xs mt-1 text-stone-600 leading-normal">
                    Subtract: <strong className="text-stone-800">{d1.tens}</strong> tens minus <strong className="text-stone-800">{d2.tens}</strong> tens.
                  </p>

                  {/* Micro Visual representation */}
                  <div className="flex items-center gap-1.5 mt-2 bg-white/70 border border-purple-200/60 p-1.5 rounded-lg">
                    <div className="flex gap-0.5 flex-wrap">
                      {Array.from({ length: d1.tens }).map((_, i) => (
                        <span key={`blk2-${i}`} className="text-sm" title="A pack of 10 items!">🍫</span>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">-{d2.tens} tens taken ❌</span>
                    <ArrowRight size={10} className="text-stone-400" />
                    <span className="text-xs font-black text-purple-600">Leaves {ansDigits.tens} tens!</span>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-stone-700"
                >
                  <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                    Step 3: Combine together!
                  </span>
                  <p className="text-xs font-bold mt-1.5 leading-normal">
                    Let's merge them together! 🌟
                  </p>
                  <p className="text-xs mt-1 text-stone-600 leading-normal">
                    We have <strong className="text-purple-700">{ansDigits.tens} Tens</strong> and <strong className="text-amber-700">{ansDigits.ones} Ones</strong>.
                  </p>
                  <p className="text-xs font-black text-emerald-700 mt-2 bg-white border border-emerald-200 p-2 rounded-xl flex items-center justify-center gap-1 animate-pulse">
                    <Sparkles className="text-yellow-500 fill-yellow-100" size={14} />
                    <span>Combining them gives us {answer}! Hurray!</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation button */}
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setStep((prev) => (prev + 1) % 3)}
                className="flex items-center gap-1 text-[10px] font-mono font-black text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg border-b-2 border-purple-800 shadow-sm cursor-pointer uppercase transition-all"
              >
                <span>{step === 2 ? "Start Over" : "Next Step"}</span>
                <ArrowRight size={10} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-stone-200 p-4 shadow-sm mt-3 relative overflow-hidden">
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-purple-400 to-emerald-400" />

      <div className="flex items-center gap-2 mb-2">
        <div className="bg-yellow-100 p-1.5 rounded-xl border border-yellow-200">
          <Lightbulb className="text-yellow-600 fill-yellow-100 animate-pulse" size={16} />
        </div>
        <h4 className="font-display font-black text-sm text-stone-800 tracking-tight flex items-center gap-1.5">
          Step-by-Step Learning
          <span className="text-[10px] font-mono font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">
            {num1} {operator} {num2} = {answer}
          </span>
        </h4>
      </div>

      {isMultiDigit ? renderMultiDigitTeaching() : renderSingleDigitTeaching()}
    </div>
  );
}
