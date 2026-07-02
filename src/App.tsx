import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Volume1,
  RotateCcw, 
  Sparkles, 
  ArrowLeft, 
  Trophy, 
  Check, 
  Play,
  Flame,
  Heart,
  BookOpen,
  Lightbulb,
  Globe,
  Plus,
  Minus,
  Sparkle
} from "lucide-react";

// Import types, data & sub-components
import { MathProblem, Animal } from "./types";
import { LEVEL_ANIMALS } from "./data";
import { TRexSVG } from "./components/TRexSVG";
import { CharacterStatusCard } from "./components/CharacterStatusCard";
import { MissionTargetCard } from "./components/MissionTargetCard";
import { HelperDinoSVG } from "./components/HelperDinoSVG";
import { ProgressTrackerCard } from "./components/ProgressTrackerCard";
import { MathTeachBoard } from "./components/MathTeachBoard";
import { VoiceCoachSelector, VoicePersona } from "./components/VoiceCoachSelector";
import { VoiceCoachSubtitle } from "./components/VoiceCoachSubtitle";
import { SafeAnimalImage } from "./components/SafeAnimalImage";

export default function App() {
  const [screen, setScreen] = useState<
    "WELCOME" | "MAP" | "MATH_QUESTION" | "EATING" | "FOSSIL_DIG" | "RESCUE" | "VICTORY"
  >("WELCOME");
  const [level, setLevel] = useState<number | null>(null);
  const [tRexPosition, setTRexPosition] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [useRealRexy, setUseRealRexy] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("tRexUseRealRexy");
      return saved === null ? true : saved === "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tRexUseRealRexy", String(useRealRexy));
    } catch {}
  }, [useRealRexy]);

  const [animals, setAnimals] = useState<Record<number, Animal[]>>(() => {
    try {
      const saved = localStorage.getItem("tRexDynamicAnimals");
      if (saved && (saved.includes("/featured/") || saved.includes("/source.unsplash.com/"))) {
        console.log("Healing broken custom animal photo URLs found in localStorage.");
        return LEVEL_ANIMALS;
      }
      return saved ? JSON.parse(saved) : LEVEL_ANIMALS;
    } catch {
      return LEVEL_ANIMALS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tRexDynamicAnimals", JSON.stringify(animals));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }, [animals]);

  const [voicePersona, setVoicePersona] = useState<VoicePersona>(() => {
    try {
      const saved = localStorage.getItem("tRexVoicePersona");
      return (saved as VoicePersona) || "DINA";
    } catch {
      return "DINA";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tRexVoicePersona", voicePersona);
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }, [voicePersona]);

  // Pre-warm natural browser voices
  useEffect(() => {
    const handleVoicesChanged = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.getVoices();
      }
    };
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      }
    };
  }, []);

  // Active random animal state for the current stage
  const [activeAnimal, setActiveAnimal] = useState<Animal | null>(null);

  // Dynamic Science Facts State
  const [dinaFactOpen, setDinaFactOpen] = useState<boolean>(false);
  const [dinaFactTopic, setDinaFactTopic] = useState<string>("random");
  const [dinaFactLoading, setDinaFactLoading] = useState<boolean>(false);
  const [dinaFactData, setDinaFactData] = useState<{
    title: string;
    factText: string;
    imageUrl?: string;
    voicePrompt?: string;
  } | null>(null);

  // Lifetime Progress stats saved in localStorage
  const [totalAddition, setTotalAddition] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("tRexTotalAddition");
      return saved ? parseInt(saved) : 0;
    } catch { return 0; }
  });
  const [totalSubtraction, setTotalSubtraction] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("tRexTotalSubtraction");
      return saved ? parseInt(saved) : 0;
    } catch { return 0; }
  });
  const [totalMultiplication, setTotalMultiplication] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("tRexTotalMultiplication");
      return saved ? parseInt(saved) : 0;
    } catch { return 0; }
  });
  const [totalPhonics, setTotalPhonics] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("tRexTotalPhonics");
      return saved ? parseInt(saved) : 0;
    } catch { return 0; }
  });

  const [rescuedAnimalIds, setRescuedAnimalIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("tRexRescuedAnimals");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Helper Dino Hint State
  const [showHint, setShowHint] = useState<boolean>(false);

  // Save progress automatically
  useEffect(() => {
    try {
      localStorage.setItem("tRexRescuedAnimals", JSON.stringify(rescuedAnimalIds));
      localStorage.setItem("tRexTotalAddition", totalAddition.toString());
      localStorage.setItem("tRexTotalSubtraction", totalSubtraction.toString());
      localStorage.setItem("tRexTotalMultiplication", totalMultiplication.toString());
      localStorage.setItem("tRexTotalPhonics", totalPhonics.toString());
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }, [rescuedAnimalIds, totalAddition, totalSubtraction, totalMultiplication, totalPhonics]);

  // Math Question State
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [mathAttempts, setMathAttempts] = useState<number>(0);

  // Phonics State
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [wrongLettersAttempted, setWrongLettersAttempted] = useState<string[]>([]);
  const [shattered, setShattered] = useState<boolean>(false);
  const [showMeetButton, setShowMeetButton] = useState<boolean>(false);

  // Audio elements state & ref to prevent duplicate speech and handle visual captions
  const lastSpokenText = useRef<string>("");
  const [currentCaption, setCurrentCaption] = useState<string>("");
  const activeUtteranceRef = useRef<any>(null);

  // Web Audio Synth for instant, zero-delay, cross-origin/CORS-proof sound effects
  const playSynthSound = (type: "roar" | "eat" | "crack" | "correct" | "wrong") => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return false;
      const ctx = new AudioContextClass();
      
      if (type === "correct") {
        // High-pitched congratulatory chime: C5 (523.25Hz) followed by E5 (659.25Hz) followed by G5 (783.99Hz)
        const playTone = (freq: number, start: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, start);
          
          gainNode.gain.setValueAtTime(0, start);
          gainNode.gain.linearRampToValueAtTime(0.15, start + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);
          
          osc.start(start);
          osc.stop(start + duration);
        };
        const now = ctx.currentTime;
        playTone(523.25, now, 0.25);
        playTone(659.25, now + 0.1, 0.25);
        playTone(783.99, now + 0.2, 0.35);
        return true;
      }
      
      if (type === "wrong") {
        // Soft sad slide down buzzer
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.type = "sawtooth";
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.3);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.3);
        return true;
      }
      
      if (type === "crack") {
        // Short crackle sound
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.type = "triangle";
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
        return true;
      }
      
      if (type === "eat") {
        // Two short munching sounds
        const now = ctx.currentTime;
        [0, 0.12, 0.24].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(200, now + delay);
          osc.frequency.exponentialRampToValueAtTime(80, now + delay + 0.08);
          
          gainNode.gain.setValueAtTime(0.12, now + delay);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
          
          osc.start(now + delay);
          osc.stop(now + delay + 0.08);
        });
        return true;
      }
      
      if (type === "roar") {
        // Deep baby T-Rex growl: sweeping frequencies with low pitch
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.4);
        
        // Add a tremolo (vibrato effect)
        const tremolo = ctx.createOscillator();
        const tremoloGain = ctx.createGain();
        tremolo.frequency.value = 35; // fast rate
        tremoloGain.gain.value = 15; // pitch modulation depth
        
        tremolo.connect(tremoloGain);
        tremoloGain.connect(osc.frequency);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.12, now + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        tremolo.start(now);
        osc.start(now);
        
        tremolo.stop(now + 0.4);
        osc.stop(now + 0.4);
        return true;
      }
      return false;
    } catch (err) {
      console.warn("Synth failed", err);
      return false;
    }
  };

  // Speech Helper with visual backup (Subtitles) and Chrome bug mitigations
  const speak = (text: string, force = false) => {
    // Always update the visual speech bubble caption so kids can read what is said
    setCurrentCaption(text);

    if (!soundEnabled) return;
    if (lastSpokenText.current === text && !force) return;
    lastSpokenText.current = text;

    try {
      // Clean up text slightly for natural phrasing
      const cleanText = text.replace(/Dina says:|JOY says:|Oakwood says:/gi, "").trim();
      const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText || text)}`;
      const audio = new Audio(ttsUrl);
      audio.volume = 1.0;
      
      audio.play().catch(err => {
        console.warn("Autoplay blocked or server tts failed, trying client fallback...", err);
        
        // Try Web SpeechSynthesis fallback immediately
        try {
          if (window.speechSynthesis) {
            window.speechSynthesis.resume();
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.pitch = voicePersona === "OAKWOOD" ? 0.92 : 1.22;
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
          }
        } catch (e2) {
          console.warn("Client fallback speech synthesis failed", e2);
        }
      });
    } catch (e) {
      console.warn("Speech generation failed, fallback to browser synthesis...", e);
      try {
        if (window.speechSynthesis) {
          window.speechSynthesis.resume();
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.warn("All speech syntheses failed", err);
      }
    }
  };

  // Sound effects helper
  const playSound = (type: "roar" | "eat" | "crack" | "correct" | "wrong") => {
    if (!soundEnabled) return;
    
    // Play synthesized Web Audio sound effect immediately for zero latency & 100% reliability
    playSynthSound(type);

    // Try to play premium realistic mp3 sounds in background
    const urls = {
      roar: "https://upload.wikimedia.org/wikipedia/commons/a/af/Felis_concolor_growl_01.mp3",
      eat: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Chewing_an_apple.mp3",
      crack: "https://upload.wikimedia.org/wikipedia/commons/9/91/Stone_dropping_on_stone.mp3",
      correct: "https://upload.wikimedia.org/wikipedia/commons/8/89/Bell-chime-congratulatory.mp3",
      wrong: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Fart_sound_effect.mp3"
    };
    try {
      const audio = new Audio(urls[type]);
      audio.volume = type === "roar" ? 0.35 : 0.55;
      audio.play().catch(() => {});
    } catch (e) {
      console.warn("Sound effect error", e);
    }
  };

  // Voice prompts on transitions
  useEffect(() => {
    if (screen === "WELCOME") {
      speak("Welcome to T-Rex Rescue Adventure! Choose a math level to start our rescue mission!", true);
    } else if (screen === "MAP") {
      if (activeAnimal) {
        speak(`Help T-Rex travel across the map! Solve a math problem to rescue the ${activeAnimal.name}! Tap feed T-Rex to start!`, true);
      } else {
        speak("Help T-Rex travel across the map!", true);
      }
    } else if (screen === "VICTORY") {
      playSound("roar");
      speak("Hurray! You helped T-Rex complete the trial path! You are a certified math and phonics super hero! Tap play again to start a new adventure!", true);
    }
  }, [screen, level]);

  // Generate Math Problem based on selected level
  const generateProblem = (chosenLevel: number): MathProblem => {
    let num1 = 0;
    let num2 = 0;
    let operator: "+" | "-" | "x" = "+";
    let answer = 0;

    if (chosenLevel === 1) {
      operator = Math.random() > 0.5 ? "+" : "-";
      if (operator === "+") {
        num1 = Math.floor(Math.random() * 7) + 1; // 1-7
        num2 = Math.floor(Math.random() * (9 - num1)) + 1;
        answer = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 7) + 3; // 3-9
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
        answer = num1 - num2;
      }
    } else if (chosenLevel === 2) {
      operator = Math.random() > 0.5 ? "+" : "-";
      if (operator === "+") {
        num1 = Math.floor(Math.random() * 18) + 10; // 10-27
        num2 = Math.floor(Math.random() * 12) + 1;  // 1-12
        answer = num1 + num2; // sum <= 40
      } else {
        num1 = Math.floor(Math.random() * 20) + 15; // 15-35
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 - num2;
      }
    } else {
      // Level 3 has additions, subtractions (up to 100), and single-digit multiplications
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        operator = "+";
        num1 = Math.floor(Math.random() * 45) + 20; // 20-65
        num2 = Math.floor(Math.random() * 30) + 5;
        answer = num1 + num2;
      } else if (type === 1) {
        operator = "-";
        num1 = Math.floor(Math.random() * 40) + 50; // 50-90
        num2 = Math.floor(Math.random() * 35) + 10;
        answer = num1 - num2;
      } else {
        operator = "x";
        num1 = Math.floor(Math.random() * 4) + 2; // 2-5
        num2 = Math.floor(Math.random() * 5) + 2; // 2-6
        answer = num1 * num2;
      }
    }

    // Distractors (Choices)
    const choicesSet = new Set<number>([answer]);
    while (choicesSet.size < 4) {
      let offset = Math.floor(Math.random() * 10) - 5;
      if (operator === "x") offset = Math.floor(Math.random() * 6) - 3;
      const fake = answer + (offset === 0 ? 1 : offset);
      if (fake >= 0) {
        choicesSet.add(fake);
      }
    }

    return {
      num1,
      num2,
      operator,
      answer,
      choices: Array.from(choicesSet).sort(() => Math.random() - 0.5)
    };
  };

  const refreshAnimals = () => {
    const updated = { ...animals };
    for (const lvlStr of ["1", "2", "3"]) {
      const lvlNum = parseInt(lvlStr);
      updated[lvlNum] = updated[lvlNum].map((a) => {
        // Force Unsplash signature to change so a different beautiful real picture of the animal loads!
        const randomSig = Math.floor(Math.random() * 1000);
        const originalAnimal = LEVEL_ANIMALS[lvlNum]?.find(orig => orig.id === a.id);
        const basePhotoUrl = originalAnimal ? originalAnimal.photoUrl : a.photoUrl;
        const cleanBaseUrl = basePhotoUrl.split("&sig=")[0];
        const newPhotoUrl = `${cleanBaseUrl}&sig=${randomSig}`;

        // Select an alternative fascinating kid-friendly educational fact
        let newFunFact = a.funFact;
        const alternateFacts: Record<string, string[]> = {
          monkey: [
            "Monkeys use friendly hugs and high fives to show love to their family, just like we do!",
            "Some clever monkeys wash their sweet potatoes in river water before taking a bite!",
            "Baby monkeys love to play tag and wrestle on soft green moss to practice their climbing skills!"
          ],
          sloth: [
            "Sloths are fantastic swimmers! They can float and paddle through jungle rivers three times faster than they can walk on land!",
            "A sloth's green-tinted fur is actually a friendly garden of tiny plants that helps them blend perfectly with jungle leaves!",
            "Sloths can turn their heads almost all the way around like an owl to spot tasty leaves behind them without moving!"
          ],
          jaguar: [
            "Jaguars have amazing night-vision goggles built into their eyes! They can see six times better in the dark than humans!",
            "A baby jaguar stays with its mom for up to two years to learn how to swim, hunt, and explore the riverlands safely.",
            "Jaguars are great at climbing trees to take peaceful, warm afternoon naps high above the jungle floor."
          ],
          panda: [
            "Newborn baby pandas are tiny—as small as a stick of butter! But they grow into giant, fluffy bamboo-eating superstars!",
            "Giant pandas are great tree climbers and can even climb trees backward with their powerful hind legs!",
            "Giant pandas have a special extra thumb on their paws that acts like a helper tool to hold onto slippery bamboo stalks!"
          ],
          squirrel: [
            "Squirrels speak to each other by flicking their bushy tails like a secret flag language!",
            "Squirrels can leap up to ten times their own body length in one giant, flying-squirrel jump!",
            "A squirrel's front teeth never stop growing! Chewing on tree bark keeps them short and sharp."
          ],
          hedgehog: [
            "Hedgehogs are natural garden helpers! They eat annoying slugs and beetles to keep flowers beautiful and healthy.",
            "Baby hedgehogs are called hoglets, and they are born with soft, jelly-like spikes that harden in a few days!",
            "Hedgehogs have an amazing sense of smell that helps them track down hidden berries and insects in the dark grass."
          ],
          tiger: [
            "Tigers love playing in deep jungle pools to stay cool on hot summer days! They are world-champion swimmers.",
            "If you shave a tiger, it still has striped skin! Its beautiful stripes are printed directly on its skin, not just its fur.",
            "A tiger's roar is so powerful that it can make other forest animals freeze in place with surprise!"
          ],
          parrot: [
            "Parrots have super-strong, curved beaks that they use like a third foot to help them climb up jungle branches!",
            "Parrots are incredibly smart! Some can count up to ten and even solve simple shape puzzles.",
            "Parrots use their bright rainbow feathers to stay warm, fly fast, and show off to their bird friends!"
          ],
          frog: [
            "Some tree frogs can leap fifty times their own body length! That is like you jumping over a whole school bus!",
            "A frog's eyes help it swallow! When they catch a bug, they blink their big eyes down to push the food into their tummy.",
            "Frogs lived on Earth at the same time as the dinosaurs! They are true prehistoric survival champions."
          ],
          bear: [
            "Brown bears can run incredibly fast—up to thirty miles per hour! That is as fast as a running racehorse!",
            "A bear's sense of smell is seven times stronger than a bloodhound dog's! They can smell sweet honey miles away.",
            "Bear cubs love sliding down snowy hills on their bellies just for fun, giggling and playing in the snow!"
          ],
          dolphin: [
            "Dolphins sleep with one eye wide open! This keeps half of their brain awake to look out for sharks and breathe safely.",
            "Every dolphin has its own unique whistle, which acts like a name! They call out to say 'Hello, I am here!'",
            "Dolphins are acrobats! They love jumping out of the water and doing double flips to show how happy they are!"
          ],
          octopus: [
            "An octopus can fit its entire body through a hole as small as a coin! They have no bones at all, so they are like jelly.",
            "If an octopus loses one of its eight arms, it can grow a brand-new perfect one back in just a couple of weeks!",
            "Octopuses are incredibly smart! They can open jars, build little forts out of seashells, and solve maze puzzles."
          ],
          whale: [
            "Blue whales can whistle so loudly that their songs travel for thousands of miles across the deep dark ocean!",
            "A baby blue whale drinks enough milk to grow 200 pounds heavier every single day! That is a very fast-growing baby!",
            "Even though they are giants, blue whales eat tiny, shrimp-like creatures called krill. They eat millions in one big bite!"
          ],
          penguin: [
            "Penguins wear a natural tuxedo! Their black backs blend with the dark ocean from above, and white bellies blend with the bright sky from below.",
            "Penguins use their stiff wings like underwater propellers to 'fly' through the ocean waves faster than Olympic swimmers!",
            "Mother and father penguins take turns keeping their single warm egg safe and cozy on top of their feet."
          ],
          turtle: [
            "Sea turtles have a special built-in compass! They can feel the Earth's magnetic fields to navigate thousands of miles across the oceans.",
            "Sea turtles cannot pull their legs or head inside their shells like land turtles can, but they can swim like speedy birds!",
            "A sea turtle's shell is actually part of its skeleton, made of about fifty bones joined together like a puzzle."
          ],
          otter: [
            "Sea otters have a secret skin pocket under their arms where they store their favorite rock for cracking open delicious clams!",
            "Baby sea otters have super-fluffy fur that traps air so they can't sink! They bob on the water like furry little corks.",
            "Sea otters are neat freaks! They spend hours grooming their thick fur to keep it waterproof and warm."
          ],
          seal: [
            "Seals have whiskers that are super sensitive! They use them to feel vibrations in the water and find fish even in pitch-black depths.",
            "Seals can dive hundreds of feet deep and hold their breath underwater for over an hour by slowing down their heartbeats!",
            "On land, harbor seals wiggle on their tummies like giant, funny caterpillars, but in water, they swim like graceful dancers."
          ],
          shark: [
            "Sharks have been swimming in the oceans for 400 million years! They are older than dinosaurs and even older than trees!",
            "Sharks do not have any bones! Their skeletons are made of light, flexible cartilage—the same bendy stuff in your ears.",
            "Some sharks can see in the dark, and they have an amazing sense of hearing that can detect a splashing fish miles away."
          ],
          flamingo: [
            "Baby flamingos are born with fluffy grey feathers! They only turn bright pink when they grow older and eat lots of pink shrimp.",
            "Flamingos can fly! They can travel up to 300 miles in a single night in big, beautiful V-shaped bird flocks.",
            "Flamingos eat with their heads upside down! They use their curved beaks like a special strainer to filter yummy bugs out of muddy water."
          ],
          starfish: [
            "Starfish do not have a brain or any blood! Instead, they pump clean seawater through their bodies to move around.",
            "On the bottom of each arm, starfish have hundreds of tiny, sticky tube feet that walk like miniature dancing shoes!",
            "Some starfish can have up to forty arms! That is a lot of hands for high-fives!"
          ]
        };

        const list = alternateFacts[a.id];
        if (list) {
          const randomIndex = Math.floor(Math.random() * list.length);
          newFunFact = list[randomIndex];
        }

        return {
          ...a,
          photoUrl: newPhotoUrl,
          funFact: newFunFact
        };
      });
    }

    setAnimals(updated);
    speak("Whoosh! I have refreshed all animal fun facts and pictures! They are now randomly updated!", true);
  };

  // Start Level with randomized target animal
  const startLevel = (lvl: number) => {
    setLevel(lvl);
    setTRexPosition(0);
    
    // Pick first randomized animal from pool
    const pool = animals[lvl];
    const randAnimal = pool[Math.floor(Math.random() * pool.length)];
    setActiveAnimal(randAnimal);
    setScreen("MAP");
  };

  // Fetch a Dynamic Science Fact from our server-side API (Google Gemini)
  const handleOpenDinaFact = async (topic: string = "random") => {
    setDinaFactOpen(true);
    setDinaFactLoading(true);
    setDinaFactTopic(topic);
    setDinaFactData(null);
    try {
      const response = await fetch("/api/fact/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      setDinaFactData(data);
      if (data.voicePrompt) {
        speak(data.voicePrompt, true);
      }
    } catch (err) {
      console.warn("Science Fact API error, playing fallback", err);
      // Fallback
      const topicsList = ["volcano", "space", "dinosaur", "science", "social"];
      const finalTopic = topic === "random" ? topicsList[Math.floor(Math.random() * topicsList.length)] : topic;
      
      const fallbacks: Record<string, any> = {
        volcano: {
          title: "🌋 Volcano Heat!",
          factText: "Inside the Earth, rocks get so hot they melt into liquid lava! When they push up, they burst out of Volcano mountains with a giant pop!",
          imageUrl: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=600&auto=format&fit=crop&q=80",
          voicePrompt: "Dina says: Inside the Earth, rocks get so hot they melt into liquid lava! When they push up, they burst out of Volcano mountains!"
        },
        space: {
          title: "🚀 Moon Bouncing!",
          factText: "There is very little gravity on the Moon, which means you could jump as high as a house! You would float like a happy balloon!",
          imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
          voicePrompt: "Dina says: There is very little gravity on the Moon, which means you could jump as high as a house!"
        },
        dinosaur: {
          title: "🦕 Giant Footsteps!",
          factText: "Brachiosaurus was so heavy that the ground shook when it walked! Its footprints were so huge you could swim in them like a pool!",
          imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=600&auto=format&fit=crop&q=80",
          voicePrompt: "Dina says: Bracc-ee-o-sore-us was so heavy that the ground shook when it walked!"
        },
        social: {
          title: "🤝 Kind Hearts!",
          factText: "Sharing toy blocks with your friends releases happy fireworks in your brain that make you both smile! High five for being nice!",
          imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80",
          voicePrompt: "Dina says: Sharing toy blocks with your friends releases happy fireworks in your brain!"
        },
        science: {
          title: "⚡ Magic Static!",
          factText: "Rubbing a plastic balloon on your head makes your hair stand straight up! That is static electricity at work—tiny particles playing tag!",
          imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
          voicePrompt: "Dina says: Rubbing a plastic balloon on your head makes your hair stand straight up! That is static electricity!"
        }
      };

      const selected = fallbacks[finalTopic] || fallbacks["science"];
      setDinaFactData(selected);
      if (selected.voicePrompt) speak(selected.voicePrompt, true);
    } finally {
      setDinaFactLoading(false);
    }
  };

  // Load Math Question Screen
  const startMathQuestion = () => {
    if (!level) return;
    const prob = generateProblem(level);
    setCurrentProblem(prob);
    setSelectedAnswer(null);
    setMathAttempts(0);
    setShowHint(false);
    setScreen("MATH_QUESTION");

    let speechGreeting = "";
    if (prob.operator === "+") {
      speechGreeting = `Let's add! What is ${prob.num1} plus ${prob.num2}? Count the items on screen!`;
    } else if (prob.operator === "-") {
      speechGreeting = `Let's subtract! What is ${prob.num1} minus ${prob.num2}? Count what is left!`;
    } else {
      speechGreeting = `Let's multiply! What is ${prob.num1} groups of ${prob.num2}? Count them up!`;
    }
    speak(speechGreeting, true);
  };

  // Submit Math Answer
  const handleMathAnswer = (val: number) => {
    if (!currentProblem) return;
    setSelectedAnswer(val);

    if (val === currentProblem.answer) {
      playSound("correct");
      setStars((prev) => prev + 1);
      
      // Update lifetime stats
      if (currentProblem.operator === "+") {
        setTotalAddition((p) => p + 1);
      } else if (currentProblem.operator === "-") {
        setTotalSubtraction((p) => p + 1);
      } else {
        setTotalMultiplication((p) => p + 1);
      }

      speak("Excellent calculation! T-Rex gets the food! Rawrr!");
      setScreen("EATING");
    } else {
      playSound("wrong");
      setMathAttempts((prev) => prev + 1);
      speak(`Whoops! That is ${val}. Try again! Let's check the step by step chalkboard helper!`, true);
    }
  };

  // Start Phonics Dig
  const startPhonicsDig = () => {
    setSelectedLetter(null);
    setWrongLettersAttempted([]);
    setShattered(false);
    setShowMeetButton(false);
    setShowHint(false);
    setScreen("FOSSIL_DIG");

    if (activeAnimal) {
      speak(`Phonics Fossil Dig! The ${activeAnimal.name} is trapped behind the big fossil boulder! Find the starting sound: ${activeAnimal.sound} to crack it open! Tap the correct letter!`, true);
    }
  };

  // Submit Phonics Letter
  const handlePhonicsLetter = (letter: string) => {
    if (!activeAnimal) return;

    const correctLetter = activeAnimal.word[activeAnimal.missingLetterIndex];

    if (letter === correctLetter) {
      playSound("crack");
      setSelectedLetter(letter);
      setShattered(true);
      setTotalPhonics((p) => p + 1);
      speak(`Fantastic chiseling! Crack! The sound ${activeAnimal.sound} is correct!`, true);
      
      setTimeout(() => {
        speak(`Let's sound it out: ${activeAnimal.blendedSound} ... ${activeAnimal.word}! You spelt the word ${activeAnimal.word}!`, true);
        setShowMeetButton(true);
      }, 1500);
    } else {
      playSound("wrong");
      setWrongLettersAttempted((prev) => [...prev, letter]);
      
      let wrongLetterSound = "another sound";
      const sounds: Record<string, string> = {
        M: "mmm", B: "buh", P: "puh", S: "sss", H: "huh", F: "fff", 
        W: "wuh", N: "nnn", T: "tuh", G: "guh", K: "kuh", D: "duh", 
        L: "lll", R: "rrr", J: "juh", V: "vuh", Z: "zzz", C: "cuh"
      };
      wrongLetterSound = sounds[letter] || "another sound";

      speak(`That letter block makes the sound ${wrongLetterSound}. Try again! We need the sound: ${activeAnimal.sound}!`, true);
    }
  };

  // Complete Stage Rescue & Progress to Map or Victory
  const handleRescueComplete = () => {
    if (activeAnimal && !rescuedAnimalIds.includes(activeAnimal.id)) {
      setRescuedAnimalIds((prev) => [...prev, activeAnimal.id]);
    }
    
    const nextPos = tRexPosition + 1;
    if (nextPos >= 5) { // 5 milestones per trail
      setScreen("VICTORY");
    } else {
      setTRexPosition(nextPos);
      
      // Select a new randomized animal for the next stage that has not been rescued yet
      if (level) {
        const pool = animals[level];
        const unrescued = pool.filter((a) => !rescuedAnimalIds.includes(a.id));
        const nextAnimal = unrescued.length > 0 
          ? unrescued[Math.floor(Math.random() * unrescued.length)] 
          : pool[Math.floor(Math.random() * pool.length)];
        setActiveAnimal(nextAnimal);
      }
      setScreen("MAP");
    }
  };

  // Reset Game
  const resetGame = () => {
    setScreen("WELCOME");
    setLevel(null);
    setTRexPosition(0);
    setStars(0);
    window.speechSynthesis.cancel();
  };

  // Repeat TTS helper
  const repeatCurrentSpeech = () => {
    if (screen === "MATH_QUESTION" && currentProblem) {
      let qText = "";
      if (currentProblem.operator === "+") {
        qText = `What is ${currentProblem.num1} plus ${currentProblem.num2}? Count the food pieces below!`;
      } else if (currentProblem.operator === "-") {
        qText = `What is ${currentProblem.num1} minus ${currentProblem.num2}? Count what is left!`;
      } else {
        qText = `What is ${currentProblem.num1} groups of ${currentProblem.num2}? Count them up!`;
      }
      speak(qText, true);
    } else if (screen === "FOSSIL_DIG" && activeAnimal) {
      speak(`Find the letter block that makes the starting sound: ${activeAnimal.sound}!`, true);
    } else if (screen === "RESCUE" && activeAnimal) {
      speak(`Awesome! You rescued the ${activeAnimal.name}! Let's hear an amazing fun fact: ${activeAnimal.funFact}`, true);
    }
  };

  return (
    <div id="game-app-container" className="min-h-screen bg-[#faf9f6] text-stone-800 flex flex-col items-center justify-start p-3 sm:p-5 font-sans select-none">
      
      {/* Header Panel */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-4 border-b-2 border-stone-200/80 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🦖</span>
          <div>
            <h1 className="text-lg sm:text-xl font-black font-display tracking-tight text-stone-900 leading-tight">
              T-Rex Rescue Adventure
            </h1>
            <p className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 uppercase">
              Endless Math & Phonics Training Center
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenDinaFact("random")}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200 transition-all text-xs font-bold rounded-xl cursor-pointer"
          >
            <Lightbulb size={12} className="animate-pulse" />
            <span>Science Facts!</span>
          </button>
          
          {screen !== "WELCOME" && (
            <button
              onClick={resetGame}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 hover:bg-stone-200 transition-all text-xs font-bold rounded-xl cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Back Home</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Sandbox */}
      <main className="w-full max-w-4xl flex-1 flex flex-col justify-stretch">
        {/* Real-time Accessibility Voice Coach Subtitles Bubble */}
        <VoiceCoachSubtitle
          currentCaption={currentCaption}
          voicePersona={voicePersona}
          soundEnabled={soundEnabled}
          toggleSound={() => setSoundEnabled(!soundEnabled)}
          speak={speak}
        />

        <AnimatePresence mode="wait">
          
          {/* WELCOME SCREEN */}
          {screen === "WELCOME" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Bento Left Column: Stats & Companions */}
              <div className="md:col-span-1 flex flex-col gap-4">
                <CharacterStatusCard
                  screen={screen}
                  stars={stars}
                  soundEnabled={soundEnabled}
                  toggleSound={() => setSoundEnabled(!soundEnabled)}
                  speak={(txt) => speak(txt, true)}
                  useRealRexy={useRealRexy}
                  setUseRealRexy={setUseRealRexy}
                />
                
                {/* Lifetime Achievements Bento Block */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-200 p-4 shadow-sm">
                  <h3 className="text-xs font-mono font-black text-purple-800 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                    <Trophy size={14} className="text-yellow-500 fill-yellow-200" />
                    LIFETIME MILESTONES
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center bg-white border border-purple-100 px-3 py-1.5 rounded-xl">
                      <span className="font-bold text-stone-700">➕ Addition Solve</span>
                      <span className="font-mono font-black text-purple-700 bg-purple-100/50 px-2 py-0.5 rounded-full">{totalAddition} / 30</span>
                    </div>
                    <div className="flex justify-between items-center bg-white border border-purple-100 px-3 py-1.5 rounded-xl">
                      <span className="font-bold text-stone-700">➖ Subtraction Solve</span>
                      <span className="font-mono font-black text-purple-700 bg-purple-100/50 px-2 py-0.5 rounded-full">{totalSubtraction} / 30</span>
                    </div>
                    <div className="flex justify-between items-center bg-white border border-purple-100 px-3 py-1.5 rounded-xl">
                      <span className="font-bold text-stone-700">✖️ Multiplication Solve</span>
                      <span className="font-mono font-black text-purple-700 bg-purple-100/50 px-2 py-0.5 rounded-full">{totalMultiplication} / 30</span>
                    </div>
                    <div className="flex justify-between items-center bg-white border border-purple-100 px-3 py-1.5 rounded-xl">
                      <span className="font-bold text-stone-700">🔤 Phonics Built</span>
                      <span className="font-mono font-black text-purple-700 bg-purple-100/50 px-2 py-0.5 rounded-full">{totalPhonics} / 30</span>
                    </div>
                  </div>
                  <div className="mt-2 text-[9px] font-mono font-bold text-purple-500 text-center uppercase tracking-widest">
                    Solve 30 each to become a superhero!
                  </div>
                </div>

                <MissionTargetCard
                  currentAnimal={activeAnimal}
                  tRexPosition={tRexPosition}
                />

                <VoiceCoachSelector
                  currentPersona={voicePersona}
                  setPersona={setVoicePersona}
                  speak={speak}
                />
              </div>

              {/* Bento Right Column: Level Selector */}
              <div className="md:col-span-2 flex flex-col gap-4">
                {/* Intro Card */}
                <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-4.5 shadow-sm flex items-start gap-4">
                  <div className="bg-amber-100 p-2.5 rounded-xl border border-amber-300 text-amber-600 text-xl shrink-0">
                    🦕
                  </div>
                  <div>
                    <h2 className="text-base font-bold font-display text-amber-950 leading-tight">Ready to Rescue Lost Baby Animals?</h2>
                    <p className="text-stone-700 text-xs mt-1 font-medium leading-relaxed">
                      Oh no! Cute baby animals are trapped in cages on far away islands! Feed baby Rexy delicious tomatoes, strawberries, and apples by answering fun math puzzles to give him rescue energy!
                    </p>
                  </div>
                </div>

                {/* Level Selection Bento Grid Header */}
                <div>
                  <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-stone-500 mb-2 px-1">
                    CHOOSE MATH QUEST ZONE & START
                  </h3>
                  
                  {/* Three Level Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Level 1 Card */}
                    <button
                      onClick={() => startLevel(1)}
                      className="bg-white rounded-2xl border-2 border-stone-200 p-4.5 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all text-left flex flex-col justify-between h-44 cursor-pointer relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-full translate-x-8 -translate-y-8 group-hover:bg-emerald-100/60 transition-all" />
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="text-xl">🌴</span>
                        <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Level 1</span>
                      </div>
                      <div className="relative z-10">
                        <h4 className="font-black text-stone-900 font-display text-sm">Jungle Trail</h4>
                        <p className="text-stone-500 text-[10px] font-bold mt-0.5 leading-tight">Simple Addition & Subtraction (0-10)</p>
                      </div>
                    </button>

                    {/* Level 2 Card */}
                    <button
                      onClick={() => startLevel(2)}
                      className="bg-white rounded-2xl border-2 border-stone-200 p-4.5 shadow-sm hover:border-amber-400 hover:shadow-md transition-all text-left flex flex-col justify-between h-44 cursor-pointer relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-full translate-x-8 -translate-y-8 group-hover:bg-amber-100/60 transition-all" />
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="text-xl">🏜️</span>
                        <span className="text-[9px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Level 2</span>
                      </div>
                      <div className="relative z-10">
                        <h4 className="font-black text-stone-900 font-display text-sm">Desert Path</h4>
                        <p className="text-stone-500 text-[10px] font-bold mt-0.5 leading-tight">Double-Digit Addition (up to 40) & Subtraction</p>
                      </div>
                    </button>

                    {/* Level 3 Card */}
                    <button
                      onClick={() => startLevel(3)}
                      className="bg-white rounded-2xl border-2 border-stone-200 p-4.5 shadow-sm hover:border-sky-400 hover:shadow-md transition-all text-left flex flex-col justify-between h-44 cursor-pointer relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-sky-50 rounded-full translate-x-8 -translate-y-8 group-hover:bg-sky-100/60 transition-all" />
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="text-xl">🌊</span>
                        <span className="text-[9px] font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">Level 3</span>
                      </div>
                      <div className="relative z-10">
                        <h4 className="font-black text-stone-900 font-display text-sm">Deep Ocean</h4>
                        <p className="text-stone-500 text-[10px] font-bold mt-0.5 leading-tight">Math up to 100 & Single-Digit Multiplication</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Science facts quick launcher card */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none text-9xl">💡</div>
                  <div className="relative z-10 max-w-md">
                    <span className="inline-block bg-white/20 text-white font-mono font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest mb-1.5">Dina's Lab</span>
                    <h3 className="text-base font-black font-display">Ask Dina for Live Science Facts!</h3>
                    <p className="text-xs text-purple-100 mt-1 leading-relaxed font-semibold">
                      Wonder about Volcanoes, Outer Space, Dinosaurs, or Science? Select a button below and let Dina use AI to write an amazing fun fact just for you!
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      {["Volcano", "Space", "Dinosaur", "Science", "Manners"].map((item) => (
                        <button
                          key={item}
                          onClick={() => handleOpenDinaFact(item.toLowerCase())}
                          className="bg-white text-purple-700 text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl hover:bg-purple-100 transition-all cursor-pointer shadow-sm"
                        >
                          {item === "Volcano" ? "🌋 Volcano" : item === "Space" ? "🚀 Space" : item === "Dinosaur" ? "🦕 Dinosaur" : item === "Science" ? "⚡ Science" : "🤝 Manners"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Adventure Control & Super Hero Refresh Hub */}
                <div className="bg-white rounded-2xl border-2 border-dashed border-emerald-300 p-5 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-15 text-3xl">✨</div>
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <span className="inline-block bg-emerald-100 text-emerald-800 font-mono font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest mb-1.5">
                        Super Hero Control Hub
                      </span>
                      <h3 className="text-base font-black font-display text-stone-900">
                        Refresh Animals & Puzzles
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        Want to explore different baby animal photos and new fun facts? You can refresh them at any time to keep your adventure completely random and exciting!
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="mt-4 bg-stone-50 border border-stone-200/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <div className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">Total Puzzles Solved</div>
                        <div className="text-lg font-black text-emerald-600">
                          {totalAddition + totalSubtraction + totalMultiplication + totalPhonics} / 30 <span className="text-xs font-semibold text-stone-500 font-sans">completed</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={refreshAnimals}
                        className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-display font-black text-xs px-4 py-2.5 rounded-xl border-b-2 border-emerald-700 shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>🔄 Refresh Album</span>
                      </button>
                    </div>

                    {/* Milestone 30 Celebration */}
                    {(totalAddition + totalSubtraction + totalMultiplication + totalPhonics) >= 30 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3.5 bg-gradient-to-r from-amber-400 to-yellow-300 border-2 border-amber-400 rounded-xl p-3 text-amber-950 flex flex-col items-center text-center shadow-xs"
                      >
                        <span className="text-lg">👑</span>
                        <h4 className="font-display font-black text-xs mt-1 uppercase tracking-wide">30 Puzzles Cleared!</h4>
                        <p className="text-[11px] font-medium text-amber-950 mt-0.5 leading-tight">
                          Spectacular job! You did 30 math & phonics puzzles. Ready for a brand new set of challenges?
                        </p>
                        <button
                          onClick={() => {
                            refreshAnimals();
                            speak("Ta-da! Brand new puzzles, cute animal faces, and fun facts have been prepared just for you! Let's start a new quest!", true);
                          }}
                          className="mt-2.5 w-full bg-stone-900 text-white hover:bg-stone-800 font-mono font-bold text-[10px] py-2 rounded-lg tracking-wider uppercase transition-all active:scale-95 cursor-pointer"
                        >
                          🎁 NEW 30 PUZZLES & FACTS
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MAP SCREEN */}
          {screen === "MAP" && level && activeAnimal && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {/* Left Column Stats card */}
              <div className="md:col-span-1 flex flex-col gap-4">
                <CharacterStatusCard
                  screen={screen}
                  stars={stars}
                  soundEnabled={soundEnabled}
                  toggleSound={() => setSoundEnabled(!soundEnabled)}
                  speak={(txt) => speak(txt, true)}
                  useRealRexy={useRealRexy}
                  setUseRealRexy={setUseRealRexy}
                />

                <MissionTargetCard
                  currentAnimal={activeAnimal}
                  tRexPosition={tRexPosition}
                />

                <ProgressTrackerCard
                  currentLevel={level}
                  rescuedAnimalIds={rescuedAnimalIds}
                  animals={animals}
                />

                <VoiceCoachSelector
                  currentPersona={voicePersona}
                  setPersona={setVoicePersona}
                  speak={speak}
                />
              </div>

              {/* Right Column: Dynamic Travel Map Card */}
              <div className="md:col-span-2 bg-white rounded-3xl border-2 border-stone-200/80 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
                {/* Decorative map Grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                {/* Zone Theme styling */}
                {level === 1 && <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/20 via-transparent to-green-100/10 pointer-events-none" />}
                {level === 2 && <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/20 via-transparent to-yellow-100/10 pointer-events-none" />}
                {level === 3 && <div className="absolute inset-0 bg-gradient-to-tr from-sky-50/20 via-transparent to-blue-100/10 pointer-events-none" />}

                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5 mb-3.5 relative z-10">
                    <div>
                      <span className="text-[9px] font-mono font-bold tracking-widest text-stone-400 uppercase">Interactive Trail Map</span>
                      <h2 className="text-base font-black font-display text-stone-900 mt-0.5">
                        {level === 1 ? "🌴 Jungle Trail" : level === 2 ? "🏜️ Desert Path" : "🌊 Deep Ocean"}
                      </h2>
                    </div>
                    <div className="bg-stone-100 border border-stone-200 text-stone-600 font-mono font-black rounded-full px-2.5 py-0.5 text-[10px]">
                      Quest Progress: {tRexPosition + 1} / 5
                    </div>
                  </div>

                  {/* Animal Preview with real picture */}
                  <div className="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border-2 border-dashed border-sky-200 p-4 rounded-2xl flex items-center gap-4 relative z-10 mb-5">
                    <SafeAnimalImage
                      src={activeAnimal.photoUrl}
                      alt={activeAnimal.name}
                      emoji={activeAnimal.emoji}
                      className="w-16 h-16 rounded-full object-cover border-2 border-sky-400 shadow-sm shrink-0"
                    />
                    <div>
                      <span className="text-[9px] font-mono font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full uppercase">Target Lost Buddy</span>
                      <h4 className="font-black text-stone-900 text-sm leading-tight mt-1">{activeAnimal.name}</h4>
                      <p className="text-stone-500 text-[11px] leading-tight mt-0.5">spelt with starting sound '{activeAnimal.sound.toUpperCase()}'!</p>
                    </div>
                  </div>

                  {/* 5-Step Visual Map Timeline Board */}
                  <div className="relative bg-stone-50 border border-stone-200 rounded-2xl p-4 py-8 mb-5 flex items-center justify-between overflow-hidden">
                    <svg className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-1.5 pointer-events-none">
                      <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#10b981" strokeWidth="3" strokeDasharray="6 4" className="opacity-40" />
                    </svg>

                    {Array.from({ length: 5 }).map((_, idx) => {
                      const isCompleted = idx < tRexPosition;
                      const isActive = idx === tRexPosition;

                      return (
                        <div key={`stage-${idx}`} className="relative z-10 flex flex-col items-center">
                          <motion.div
                            animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-lg shadow border-2 transition-all relative ${
                              isCompleted 
                                ? "bg-emerald-50 border-emerald-500 text-emerald-800" 
                                : isActive 
                                ? "bg-yellow-400 border-yellow-500 text-yellow-950 ring-4 ring-yellow-400/30" 
                                : "bg-stone-100 border-stone-200 text-stone-300 opacity-60"
                            }`}
                          >
                            {isCompleted ? (
                              <span className="relative font-bold text-emerald-600">
                                <Check size={14} className="stroke-[4]" />
                              </span>
                            ) : isActive ? (
                              <span className="animate-bounce font-mono font-black text-xs">⭐</span>
                            ) : (
                              <span className="font-mono text-[9px] text-stone-400 font-bold">🔒</span>
                            )}

                            {isActive && (
                              <motion.div 
                                className="absolute -top-7 text-xl"
                                animate={{ y: [0, -3, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6 }}
                              >
                                🦖
                              </motion.div>
                            )}
                          </motion.div>

                          <span className={`text-[8px] font-mono font-black mt-2 px-1.5 py-0.5 rounded-full ${
                            isActive 
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200" 
                              : "bg-white text-stone-400 border border-stone-200"
                          }`}>
                            STG {idx + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Large Action Feed Button */}
                <div className="flex flex-col gap-2 relative z-10">
                  <button
                    onClick={startMathQuestion}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black text-base rounded-2xl shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 border-b-4 border-emerald-700 cursor-pointer"
                  >
                    <Play size={16} className="fill-white" />
                    <span>FEED T-REX & START CHALLENGE</span>
                  </button>
                  
                  <button
                    onClick={() => setScreen("WELCOME")}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 font-black text-[10px] rounded-xl border border-stone-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <ArrowLeft size={12} />
                    <span>Go back to home</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* MATH QUESTION SCREEN */}
          {screen === "MATH_QUESTION" && currentProblem && level && activeAnimal && (
            <motion.div
              key="math"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {/* Status column */}
              <div className="md:col-span-1 flex flex-col gap-4">
                <CharacterStatusCard
                  screen={screen}
                  stars={stars}
                  soundEnabled={soundEnabled}
                  toggleSound={() => setSoundEnabled(!soundEnabled)}
                  speak={(txt) => speak(txt, true)}
                  useRealRexy={useRealRexy}
                  setUseRealRexy={setUseRealRexy}
                />
                
                <div className="bg-emerald-500 rounded-2xl border-2 border-emerald-600/50 p-4 text-white flex flex-col justify-between min-h-[120px] relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-white/10 rounded-full" />
                  <div className="relative z-10">
                    <span className="text-[8px] font-mono tracking-widest bg-white/25 px-2 py-0.5 rounded-full uppercase font-bold">Quiz Panel</span>
                    <h4 className="text-base font-black font-display mt-1.5">Count & Feed!</h4>
                    <p className="text-[11px] text-emerald-100 mt-0.5 font-semibold leading-relaxed">
                      Tap the correct answers block to feed Rexy. Count the visual items below!
                    </p>
                  </div>
                  <button
                    onClick={repeatCurrentSpeech}
                    className="relative z-10 w-full mt-3 py-1.5 bg-white text-emerald-800 font-black text-[10px] rounded-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer uppercase tracking-wider"
                  >
                    <Volume1 size={12} />
                    <span>Speak Equation</span>
                  </button>
                </div>

                {/* Dina the Helper Dino Hint Card */}
                <div 
                  onClick={() => {
                    setShowHint(true);
                    playSound("correct");
                    let hintSpeech = "";
                    if (currentProblem.operator === "+") {
                      hintSpeech = `Dina says: Count the ${currentProblem.num1} red apples first, then count ${currentProblem.num2} yellow bananas!`;
                    } else if (currentProblem.operator === "-") {
                      hintSpeech = `Dina says: Count only the strawberry pieces that are not crossed out with a red ex!`;
                    } else {
                      hintSpeech = `Dina says: Let's look at one less group! ${currentProblem.num1 - 1} groups of ${currentProblem.num2} is ${ (currentProblem.num1 - 1) * currentProblem.num2 }. Now just add ${currentProblem.num2} more to get the answer!`;
                    }
                    speak(hintSpeech, true);
                  }}
                  className={`bg-purple-50 rounded-2xl border-2 transition-all p-4 flex flex-col items-center text-center cursor-pointer relative overflow-hidden select-none hover:shadow-md ${
                    showHint 
                      ? "border-purple-400 ring-2 ring-purple-300" 
                      : mathAttempts > 0 
                      ? "border-yellow-400 animate-pulse ring-4 ring-yellow-400/30 bg-yellow-50" 
                      : "border-purple-200"
                  }`}
                >
                  <span className="text-[8px] font-mono font-bold tracking-widest text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full uppercase">
                    Helper Companion
                  </span>
                  
                  <div className="scale-85 -my-2.5">
                    <HelperDinoSVG state={showHint ? "happy" : mathAttempts > 0 ? "pointing" : "idle"} />
                  </div>

                  <div className="bg-white border border-purple-200/60 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-stone-700 leading-snug relative w-full mt-1.5">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full border-4 border-transparent border-b-white" />
                    {showHint ? (
                      <span className="text-purple-700 font-semibold">
                        {currentProblem.operator === "+" && `Count ${currentProblem.num1} apples, then count on ${currentProblem.num2} bananas!`}
                        {currentProblem.operator === "-" && `Count only the strawberries without an ❌!`}
                        {currentProblem.operator === "x" && `Hint: ${currentProblem.num1 - 1} groups is ${ (currentProblem.num1 - 1) * currentProblem.num2 }. Add ${currentProblem.num2} more!`}
                      </span>
                    ) : mathAttempts > 0 ? (
                      <span className="text-amber-800 font-bold animate-pulse">
                        "Don't worry! Tap me for a visual hint! 💡"
                      </span>
                    ) : (
                      <span className="font-semibold">
                        "Hi! I'm Dina! Tap me anytime you want a visual hint! 🦖"
                      </span>
                    )}
                  </div>

                  {!showHint && (
                    <button className="mt-2 text-[9px] font-mono font-black tracking-wider bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg border-b-2 border-purple-700 shadow-xs cursor-pointer uppercase">
                      Get Hint
                    </button>
                  )}
                </div>

                <VoiceCoachSelector
                  currentPersona={voicePersona}
                  setPersona={setVoicePersona}
                  speak={speak}
                />
              </div>

              {/* Math Interactive Playground Card */}
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-sm">
                  <div className="text-center pb-3 mb-3 border-b border-stone-100">
                    <span className="text-[9px] font-mono font-black tracking-widest text-stone-400 uppercase">Solve the equation</span>
                    <h3 className="text-3xl sm:text-4xl font-black font-display text-stone-900 mt-1 flex items-center justify-center gap-2">
                      <span className="bg-stone-50 border-2 border-stone-200 px-3 py-1 rounded-xl text-stone-800 shadow-xs">{currentProblem.num1}</span>
                      <span className="text-xl text-amber-500 font-black">{currentProblem.operator === "x" ? "×" : currentProblem.operator}</span>
                      <span className="bg-stone-50 border-2 border-stone-200 px-3 py-1 rounded-xl text-stone-800 shadow-xs">{currentProblem.num2}</span>
                      <span className="text-xl text-stone-400 font-black">=</span>
                      <span className="bg-amber-100 text-amber-600 border-3 border-dashed border-amber-400 px-4 py-1 rounded-xl animate-pulse">?</span>
                    </h3>
                  </div>

                  {/* Food visual grids representing groups */}
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 min-h-[140px] flex flex-col justify-center">
                    {/* Addition (+) visual representation */}
                    {currentProblem.operator === "+" && (
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className={`bg-emerald-50 p-2.5 rounded-xl relative min-h-[80px] flex flex-wrap justify-center items-center gap-1.5 transition-all duration-300 ${
                            showHint ? "border-4 border-dashed border-yellow-400 bg-yellow-50/50 ring-2 ring-yellow-400/25 scale-[1.01]" : "border border-dashed border-emerald-200"
                          }`}>
                            <span className="absolute top-1 left-2 text-[8px] font-mono font-black text-emerald-700 bg-emerald-100 px-1.5 rounded-full">First ({currentProblem.num1})</span>
                            {Array.from({ length: currentProblem.num1 }).map((_, i) => (
                              <motion.span
                                key={`add1-${i}`}
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                                className="text-xl filter drop-shadow relative w-6 h-6 flex items-center justify-center"
                              >
                                🍎
                                <span className="absolute -bottom-1 -right-1 bg-white text-[7px] font-mono font-bold text-stone-600 rounded-full w-3.5 h-3.5 flex items-center justify-center border border-stone-200 shadow-xs leading-none">{i + 1}</span>
                              </motion.span>
                            ))}
                          </div>

                          <div className="bg-sky-50 border border-dashed border-sky-200 p-2.5 rounded-xl relative min-h-[80px] flex flex-wrap justify-center items-center gap-1.5">
                            <span className="absolute top-1 left-2 text-[8px] font-mono font-black text-sky-700 bg-sky-100 px-1.5 rounded-full">Second ({currentProblem.num2})</span>
                            {Array.from({ length: currentProblem.num2 }).map((_, i) => (
                              <motion.span
                                key={`add2-${i}`}
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                                className="text-xl filter drop-shadow relative w-6 h-6 flex items-center justify-center"
                              >
                                🍌
                                <span className="absolute -bottom-1 -right-1 bg-white text-[7px] font-mono font-bold text-stone-600 rounded-full w-3.5 h-3.5 flex items-center justify-center border border-stone-200 shadow-xs leading-none">{currentProblem.num1 + i + 1}</span>
                              </motion.span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[9px] font-mono font-black text-stone-500 tracking-wider uppercase text-center mt-1">
                          Count them all together to find the sum!
                        </p>
                      </div>
                    )}

                    {/* Subtraction (-) visual representation */}
                    {currentProblem.operator === "-" && (
                      <div className="flex flex-col gap-2">
                        <div className={`bg-rose-50 p-3 rounded-xl relative min-h-[90px] flex flex-wrap justify-center items-center gap-1.5 transition-all duration-300 ${
                          showHint ? "border-4 border-dashed border-yellow-400 bg-yellow-50/50 ring-2 ring-yellow-400/25 scale-[1.01]" : "border border-dashed border-rose-200"
                        }`}>
                          <span className="absolute top-1 left-2 text-[8px] font-mono font-black text-rose-700 bg-rose-100 px-1.5 rounded-full">Takeaway math ({currentProblem.num1} start)</span>
                          {Array.from({ length: currentProblem.num1 }).map((_, i) => {
                            const isCrossed = i >= (currentProblem.num1 - currentProblem.num2);
                            return (
                              <div key={`sub-${i}`} className="relative select-none w-7 h-7 flex items-center justify-center">
                                <span className={`text-xl filter drop-shadow ${isCrossed ? "opacity-25" : ""}`}>🍓</span>
                                {isCrossed ? (
                                  <span className="absolute inset-0 flex items-center justify-center text-rose-500 font-black text-lg select-none leading-none">❌</span>
                                ) : (
                                  <span className="absolute -bottom-1 -right-1 bg-white text-[7px] font-mono font-bold text-stone-600 rounded-full w-3.5 h-3.5 flex items-center justify-center border border-stone-200 shadow-xs leading-none">{i + 1}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[9px] font-mono font-black text-stone-500 tracking-wider uppercase text-center">
                          Count the remaining strawberry items that are not crossed out!
                        </p>
                      </div>
                    )}

                    {/* Multiplication (x) visual representation */}
                    {currentProblem.operator === "x" && (
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                          {Array.from({ length: currentProblem.num1 }).map((_, g) => {
                            const isLastGroup = g === currentProblem.num1 - 1;
                            const isHintActive = showHint && isLastGroup;
                            return (
                              <div
                                key={`mul-group-${g}`}
                                className={`p-1.5 rounded-xl relative min-h-[55px] flex flex-wrap justify-center items-center gap-1 pt-3.5 transition-all duration-300 ${
                                  isHintActive
                                    ? "bg-amber-100 border-2 border-dashed border-purple-400 ring-2 ring-purple-300/20 scale-[1.01]"
                                    : "bg-amber-50 border border-dashed border-amber-200"
                                }`}
                              >
                                <span className={`absolute top-0.5 left-1 text-[7px] font-mono font-black px-1 rounded-xs uppercase ${
                                  isHintActive ? "bg-purple-500 text-white animate-pulse" : "bg-amber-100 text-amber-700"
                                }`}>
                                  {isHintActive ? "Dina Hint: +1 Group" : `Group ${g + 1}`}
                                </span>
                                {Array.from({ length: currentProblem.num2 }).map((_, itemIdx) => {
                                  const overallCount = (g * currentProblem.num2) + itemIdx + 1;
                                  return (
                                    <span key={`mul-item-${g}-${itemIdx}`} className="text-lg filter drop-shadow relative w-5 h-5 flex items-center justify-center">
                                      🍅
                                      <span className="absolute -bottom-1 -right-1 bg-white text-[6px] font-mono font-bold text-stone-600 rounded-full w-3.5 h-3.5 flex items-center justify-center border border-stone-200 shadow-xs leading-none">{overallCount}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[9px] font-mono font-black text-stone-500 tracking-wider uppercase text-center">
                          Count the tomatoes in each group basket!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Answer choices grids (Bento Cards Style) */}
                  <div className="grid grid-cols-2 gap-2.5 mt-3">
                    {currentProblem.choices.map((val, idx) => {
                      const colors = [
                        "bg-rose-500 border-rose-700 text-white hover:bg-rose-600",
                        "bg-sky-500 border-sky-700 text-white hover:bg-sky-600",
                        "bg-amber-500 border-amber-700 text-white hover:bg-amber-600",
                        "bg-purple-500 border-purple-700 text-white hover:bg-purple-600"
                      ];
                      return (
                        <button
                          key={`choice-${idx}`}
                          onClick={() => handleMathAnswer(val)}
                          className={`py-3.5 px-3 ${colors[idx]} font-display font-black text-2xl rounded-xl shadow border-b-4 active:scale-95 active:border-b-0 transition-all flex flex-col items-center justify-center relative overflow-hidden cursor-pointer`}
                        >
                          <span className="relative z-10 drop-shadow">{val}</span>
                          <div className="absolute top-1 right-2 w-4 h-4 bg-white/10 rounded-full" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Always-on Step-by-Step Teaching Blackboard Board */}
                <MathTeachBoard
                  num1={currentProblem.num1}
                  num2={currentProblem.num2}
                  operator={currentProblem.operator}
                  answer={currentProblem.answer}
                />
              </div>
            </motion.div>
          )}

          {/* EATING ANIMATION SCREEN */}
          {screen === "EATING" && (
            <motion.div
              key="eating"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl border-2 border-stone-200 p-6.5 shadow-sm flex flex-col items-center justify-between text-center min-h-[400px]"
            >
              <div className="space-y-1">
                <span className="text-4xl animate-bounce inline-block">🍕 🍉 🥩</span>
                <h3 className="text-2xl font-black font-display text-emerald-600 mt-1.5">
                  CHOMP CHOMP CHOMP!
                </h3>
                <p className="text-stone-600 text-xs font-semibold">
                  Woohoo! Rexy is eating! Thank you, Super Math Hero!
                </p>
              </div>

              <div className="relative my-3 flex justify-center items-center">
                <TRexSVG state="eating" />
                <motion.div
                  className="absolute text-2xl select-none"
                  animate={{
                    x: [-45, 12],
                    y: [18, -8],
                    scale: [1, 0.35],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: 4,
                    ease: "easeOut"
                  }}
                >
                  🥩
                </motion.div>
              </div>

              <div className="w-full max-w-xs space-y-2.5">
                <span className="text-[9px] font-mono font-bold tracking-wider text-stone-400 block uppercase">
                  Chiseling Tools Armed...
                </span>
                <button
                  onClick={startPhonicsDig}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black text-base rounded-2xl shadow hover:shadow-md border-b-4 border-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>CRACK PHONICS BOULDER! ➡️</span>
                </button>
              </div>

              {/* Autoplay chewing sounds */}
              <span className="hidden">
                {(() => {
                  setTimeout(() => playSound("eat"), 50);
                  setTimeout(() => playSound("eat"), 700);
                })()}
              </span>
            </motion.div>
          )}

          {/* PHONICS FOSSIL DIG SCREEN */}
          {screen === "FOSSIL_DIG" && level && activeAnimal && (
            <motion.div
              key="fossil"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {/* Left Column status */}
              <div className="md:col-span-1 flex flex-col gap-4">
                <CharacterStatusCard
                  screen={screen}
                  stars={stars}
                  soundEnabled={soundEnabled}
                  toggleSound={() => setSoundEnabled(!soundEnabled)}
                  speak={(txt) => speak(txt, true)}
                  useRealRexy={useRealRexy}
                  setUseRealRexy={setUseRealRexy}
                />

                <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-4 text-amber-950 flex flex-col justify-between min-h-[120px] relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-amber-100/40 rounded-full" />
                  <div className="relative z-10">
                    <span className="text-[8px] font-mono tracking-widest bg-amber-200/50 text-amber-800 px-2 py-0.5 rounded-full uppercase font-bold">Fossil Cave</span>
                    <h4 className="text-base font-black font-display mt-1.5">Phonics Hammer</h4>
                    <p className="text-[11px] text-stone-600 mt-0.5 font-semibold leading-relaxed">
                      Chisel the stone using phonics sounds! Which letter block makes the starting sound?
                    </p>
                  </div>
                  <button
                    onClick={repeatCurrentSpeech}
                    className="relative z-10 w-full mt-3 py-1.5 bg-white border border-amber-200 text-amber-800 font-black text-[10px] rounded-lg hover:bg-amber-100 transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer uppercase tracking-wider"
                  >
                    <Volume1 size={12} />
                    <span>Repeat Sound</span>
                  </button>
                </div>

                {/* Dina the Helper Dino Phonics Card */}
                <div 
                  onClick={() => {
                    setShowHint(true);
                    playSound("correct");
                    const hintSpeech = `Dina says: We need the starting sound ${activeAnimal.sound}! Look at the glowing golden block! Tap the correct block to smash the boulder!`;
                    speak(hintSpeech, true);
                  }}
                  className={`bg-purple-50 rounded-2xl border-2 transition-all p-4 flex flex-col items-center text-center cursor-pointer relative overflow-hidden select-none hover:shadow-md ${
                    showHint 
                      ? "border-purple-400 ring-2 ring-purple-300" 
                      : wrongLettersAttempted.length > 0 
                      ? "border-yellow-400 animate-pulse ring-4 ring-yellow-400/30 bg-yellow-50" 
                      : "border-purple-200"
                  }`}
                >
                  <span className="text-[8px] font-mono font-bold tracking-widest text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase">
                    Helper Companion
                  </span>
                  
                  <div className="scale-85 -my-2.5">
                    <HelperDinoSVG state={showHint ? "happy" : wrongLettersAttempted.length > 0 ? "pointing" : "idle"} />
                  </div>

                  <div className="bg-white border border-purple-200/60 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-stone-700 leading-snug relative w-full mt-1.5">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full border-4 border-transparent border-b-white" />
                    {showHint ? (
                      <span className="text-purple-700 font-bold">
                        "The starting letter is highlighted below! Tap the glowing amber key! ✨"
                      </span>
                    ) : wrongLettersAttempted.length > 0 ? (
                      <span className="text-amber-800 font-bold animate-pulse">
                        "Don't worry! Tap me for a visual hint! 💡"
                      </span>
                    ) : (
                      <span className="font-semibold">
                        "Hi! I'm Dina! Tap me anytime you want a visual hint! 🦖"
                      </span>
                    )}
                  </div>

                  {!showHint && (
                    <button className="mt-2 text-[9px] font-mono font-black tracking-wider bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg border-b-2 border-purple-700 shadow-xs cursor-pointer uppercase">
                      Get Hint
                    </button>
                  )}
                </div>

                <VoiceCoachSelector
                  currentPersona={voicePersona}
                  setPersona={setVoicePersona}
                  speak={speak}
                />
              </div>

              {/* Right Column Interactive Dig Screen */}
              <div className="md:col-span-2 bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-center border-b border-stone-100 pb-2 mb-3">
                    <span className="text-[9px] font-mono font-black tracking-widest text-stone-400 uppercase">Spelling fossil boulder</span>
                    <h3 className="text-base font-black text-stone-900 mt-0.5 font-display">
                      Let's Build the Word!
                    </h3>
                  </div>

                  {/* Fossil Rock Visual Box */}
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 min-h-[170px] flex flex-col justify-center items-center relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {shattered ? (
                        <motion.div
                          key="revealed"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center gap-2.5 text-center"
                        >
                          <SafeAnimalImage
                            src={activeAnimal.photoUrl}
                            alt={activeAnimal.name}
                            emoji={activeAnimal.emoji}
                            className="w-20 h-20 rounded-full object-cover border-4 border-emerald-400 shadow-sm animate-pulse" 
                          />

                          <div className="bg-white px-5 py-1.5 rounded-xl border-2 border-emerald-400 text-center shadow-xs">
                            <span className="text-[8px] font-mono font-black text-emerald-600 block uppercase tracking-wide leading-none">Fantastic Word Spelt!</span>
                            <span className="text-3xl font-display font-black text-emerald-600 tracking-widest block mt-0.5">
                              {activeAnimal.word}
                            </span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="rock"
                          className="flex flex-col items-center"
                          animate={wrongLettersAttempted.length > 0 ? { x: [-3, 3, -3, 3, 0] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="relative w-40 h-36 bg-gradient-to-b from-stone-400 to-stone-600 border-4 border-stone-700 rounded-[28px] flex flex-col items-center justify-center p-3 shadow text-center select-none border-b-6 active:scale-98">
                            <svg className="absolute inset-0 w-full h-full stroke-stone-800 stroke-[2] fill-none opacity-25 pointer-events-none">
                              <path d="M 12 22 Q 32 40 22 75" />
                              <path d="M 75 12 L 60 45 L 75 105" />
                            </svg>

                            <span className="absolute top-2 text-[8px] font-mono font-bold text-stone-200 tracking-wider bg-stone-700/80 px-2 py-0.5 rounded-full uppercase">
                              Smash the Rock!
                            </span>

                            <div className="text-3xl font-display font-black tracking-wider text-yellow-300 drop-shadow flex items-center justify-center gap-1 mt-1">
                              <span className={`px-2 py-0.5 rounded-lg border-2.5 transition-all ${
                                showHint ? "border-dashed border-yellow-300 bg-yellow-300/20 text-yellow-300 animate-pulse scale-105" : "border-transparent"
                              }`}>
                                _
                              </span>
                              <span>{activeAnimal.word.slice(1)}</span>
                            </div>

                            <div className="mt-2.5 flex items-center gap-1.5 bg-yellow-400 text-yellow-950 text-[9px] font-mono font-bold px-3 py-0.5 rounded-full border border-yellow-500 shadow-xs animate-pulse">
                              <Volume1 size={10} />
                              <span>FIND "{activeAnimal.sound.toUpperCase()}"</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Letter Selection blocks */}
                <div className="mt-3">
                  {!shattered ? (
                    <div className="space-y-1.5">
                      <p className="text-center font-mono font-bold text-stone-400 text-[9px] uppercase tracking-wider">
                        Tap correct starting letter to break:
                      </p>
                      <div className="flex justify-center gap-2.5">
                        {(() => {
                          const correctLetter = activeAnimal.word[0];
                          const allLetters = [correctLetter, ...activeAnimal.wrongLetters].sort();

                          return allLetters.map((letter) => {
                            const isWrong = wrongLettersAttempted.includes(letter);
                            const isCorrect = letter === correctLetter;
                            const isHighlighted = showHint && isCorrect;
                            return (
                              <button
                                key={`letter-${letter}`}
                                onClick={() => handlePhonicsLetter(letter)}
                                disabled={isWrong}
                                className={`w-14 h-14 rounded-xl font-display font-black text-2xl flex items-center justify-center border-b-4 shadow transition-all active:scale-90 active:border-b-0 cursor-pointer relative ${
                                  isWrong
                                    ? "bg-stone-200 border-stone-300 text-stone-400 line-through cursor-not-allowed opacity-50 shadow-none"
                                    : isHighlighted
                                    ? "bg-yellow-400 border-yellow-500 text-yellow-950 ring-4 ring-yellow-400 animate-bounce"
                                    : "bg-amber-400 border-amber-600 text-amber-950 hover:bg-amber-500"
                                }`}
                              >
                                {letter}
                                {isHighlighted && (
                                  <Sparkles className="absolute -top-2 -right-2 text-yellow-500 fill-yellow-200 w-4 h-4 animate-pulse" />
                                )}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      {showMeetButton && (
                        <motion.button
                          onClick={() => setScreen("RESCUE")}
                          initial={{ scale: 0.95 }}
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black text-base rounded-2xl shadow border-b-4 border-emerald-700 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>MEET RESCUED ANIMAL!</span>
                          <Sparkles size={14} className="text-yellow-300 animate-pulse fill-yellow-300" />
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* RESCUED ANIMAL SCREEN */}
          {screen === "RESCUE" && level && activeAnimal && (
            <motion.div
              key="rescue"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {/* Left Column Stats card */}
              <div className="md:col-span-1 flex flex-col gap-4">
                <CharacterStatusCard
                  screen={screen}
                  stars={stars}
                  soundEnabled={soundEnabled}
                  toggleSound={() => setSoundEnabled(!soundEnabled)}
                  speak={(txt) => speak(txt, true)}
                  useRealRexy={useRealRexy}
                  setUseRealRexy={setUseRealRexy}
                />
                
                <div className="bg-sky-500 text-white rounded-2xl border-2 border-sky-600/50 p-4 flex flex-col justify-between min-h-[120px] relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-white/15 rounded-full" />
                  <div className="relative z-10">
                    <span className="text-[8px] font-mono tracking-widest bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold">Rescue Award</span>
                    <h4 className="text-base font-black font-display mt-1.5">Terrific Job!</h4>
                    <p className="text-xs text-sky-100 mt-0.5 font-semibold leading-relaxed">
                      You used math and spelling to save a precious buddy! Rexy is super proud!
                    </p>
                  </div>
                  <button
                    onClick={() => speak(activeAnimal.funFact, true)}
                    className="relative z-10 w-full mt-3 py-1.5 bg-white text-sky-800 font-black text-[10px] rounded-lg hover:bg-sky-50 transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer uppercase tracking-wider"
                  >
                    <Volume1 size={12} />
                    <span>Speak Fun Fact</span>
                  </button>
                </div>
              </div>

              {/* Showcase Card */}
              <div className="md:col-span-2 bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-sm flex flex-col justify-between">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-950 font-mono font-bold text-[9px] px-3 py-0.5 rounded-full uppercase shadow-xs">
                    🏆 ANIMAL COMPANION RECOVERED!
                  </div>
                  <h3 className="text-xl font-black font-display text-emerald-600 uppercase">
                    {activeAnimal.name}
                  </h3>
                </div>

                <div className="bg-stone-50 border-3 border-dashed border-sky-200 rounded-2xl p-5 my-3.5 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none select-none">
                    <Sparkles className="w-8 h-8 text-yellow-300 absolute top-3 left-5 animate-spin" />
                    <Sparkles className="w-6 h-6 text-yellow-300 absolute bottom-5 right-5 animate-ping" />
                  </div>

                  {/* High Quality Real Photograph representation */}
                  <SafeAnimalImage
                    src={activeAnimal.photoUrl}
                    alt={activeAnimal.name}
                    emoji={activeAnimal.emoji}
                    className="w-44 h-44 rounded-2xl border-4 border-sky-300 object-cover shadow-md filter hover:brightness-105 transition-all" 
                  />

                  <div className="bg-white/95 p-3.5 rounded-xl border border-stone-200 mt-3.5 max-w-sm shadow-xs">
                    <span className="text-[8px] font-mono font-black text-amber-600 block uppercase tracking-wider text-center mb-0.5">
                      💡 AMAZING REAL ANIMAL FACT
                    </span>
                    <p className="text-[11px] md:text-xs font-sans font-black leading-relaxed text-stone-700 text-center">
                      "{activeAnimal.funFact}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRescueComplete}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black text-base rounded-2xl shadow hover:shadow-md border-b-4 border-emerald-700 active:scale-95 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>CONTINUE ADVENTURE! ➡️</span>
                </button>
              </div>

              {/* Autoplay read fact */}
              <span className="hidden">
                {(() => {
                  const fact = activeAnimal.funFact;
                  const str = `Awesome! You rescued the ${activeAnimal.name}! Let's hear an amazing fact: ${fact}`;
                  setTimeout(() => {
                    playSound("roar");
                    speak(str);
                  }, 50);
                })()}
              </span>
            </motion.div>
          )}

          {/* VICTORY SCREEN */}
          {screen === "VICTORY" && level && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-sm text-center max-w-xl mx-auto flex flex-col justify-between min-h-[440px]"
            >
              <div className="space-y-1">
                <div className="inline-block bg-yellow-400 text-yellow-950 font-mono font-bold text-[9px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs animate-bounce">
                  🏆 CERTIFICATE OF EXCELLENCE 🏆
                </div>
                <h2 className="text-2xl font-black font-display text-emerald-600 leading-tight">
                  SUPER MATH HERO <br />
                  <span className="text-yellow-500 text-xl uppercase">Trail Completed!</span>
                </h2>
              </div>

              <div className="relative w-full py-3 bg-emerald-50/50 rounded-2xl border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center my-3 overflow-hidden">
                <div className="absolute inset-0 opacity-15 pointer-events-none select-none text-4xl">
                  <span className="absolute top-2 left-6">✨</span>
                  <span className="absolute top-2 right-6">✨</span>
                </div>

                <div className="scale-70">
                  <TRexSVG state="happy" />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1 bg-white px-4 py-2 rounded-full border border-stone-200 shadow-xs">
                  {rescuedAnimalIds.slice(-5).map((id) => {
                    // find animal emoji
                    const anim = animals[1].find(a => a.id === id) || animals[2].find(a => a.id === id) || animals[3].find(a => a.id === id);
                    return anim ? (
                      <span key={id} className="text-2xl filter drop-shadow animate-bounce">
                        {anim.emoji}
                      </span>
                    ) : null;
                  })}
                </div>

                <p className="text-[9px] font-mono font-bold text-stone-500 mt-2 uppercase tracking-wider">
                  You successfully guided T-Rex across 5 milestones!
                </p>
              </div>

              <button
                onClick={resetGame}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 font-display font-black text-lg rounded-2xl shadow hover:shadow-md border-b-4 border-amber-700 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>START NEXT TRAIL!</span>
                <RotateCcw size={14} />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Science Facts Modal Dialog (Google Gemini Integration) */}
      <AnimatePresence>
        {dinaFactOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full border-4 border-purple-500 p-5 shadow-2xl relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setDinaFactOpen(false);
                  window.speechSynthesis.cancel();
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center text-lg font-black cursor-pointer transition-all"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl animate-bounce">💡</span>
                <div>
                  <h3 className="text-base font-black font-display text-purple-900 leading-none">Dina's AI Science Fact!</h3>
                  <p className="text-[9px] font-mono text-purple-500 uppercase tracking-widest mt-0.5">Powered by Google Gemini</p>
                </div>
              </div>

              {/* Topic Select Row */}
              <div className="flex gap-1 overflow-x-auto pb-2 border-b border-stone-100 mb-3 scrollbar-none">
                {["Volcano", "Space", "Dinosaur", "Science", "Manners", "Random"].map((topicName) => {
                  const slug = topicName.toLowerCase();
                  const isCurrent = dinaFactTopic === slug;
                  return (
                    <button
                      key={topicName}
                      onClick={() => handleOpenDinaFact(slug)}
                      className={`text-[8px] font-mono font-black px-2.5 py-1 rounded-lg border shrink-0 transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                          : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {topicName}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Fact Sandbox */}
              <div className="min-h-[220px] flex flex-col justify-center items-center">
                {dinaFactLoading ? (
                  <div className="text-center py-8 space-y-3 w-full">
                    <div className="relative flex justify-center">
                      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                      <span className="absolute text-xl animate-pulse">🦖</span>
                    </div>
                    <p className="text-xs text-purple-700 font-bold animate-pulse">Dina is researching the web using Gemini AI...</p>
                  </div>
                ) : dinaFactData ? (
                  <div className="space-y-3 w-full">
                    {dinaFactData.imageUrl && (
                      <div className="w-full h-32 rounded-xl overflow-hidden border border-stone-150 shadow-inner relative">
                        <SafeAnimalImage
                          src={dinaFactData.imageUrl}
                          alt={dinaFactData.title}
                          emoji="💡"
                          className="w-full h-full object-cover transition-all"
                        />
                        <div className="absolute top-2 left-2 bg-purple-600 text-white font-mono font-black text-[8px] px-2 py-0.5 rounded-md shadow-xs">
                          {dinaFactTopic.toUpperCase()} PHOTO
                        </div>
                      </div>
                    )}

                    <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                      <h4 className="font-black font-display text-purple-950 text-sm">{dinaFactData.title}</h4>
                      <p className="text-[11px] md:text-xs text-stone-700 font-semibold mt-1 leading-relaxed">
                        {dinaFactData.factText}
                      </p>
                    </div>

                    <button
                      onClick={() => speak(dinaFactData.voicePrompt || dinaFactData.factText, true)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-mono font-black text-[10px] rounded-xl border-b-4 border-purple-800 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                    >
                      <Volume1 size={14} />
                      <span>Hear Dina Speak Out Loud!</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-stone-500 font-bold">Select a category button above to fetch a live science fact!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info stamp */}
      <footer className="w-full max-w-4xl text-center text-[10px] font-mono font-black text-stone-400 mt-5 border-t border-stone-200/80 pt-2.5 flex items-center justify-between px-1">
        <span>🦖 T-REX RESCUE ADVENTURE</span>
        <span>STAGE {level ? `${tRexPosition + 1} / 5` : "SELECT ZONE"}</span>
      </footer>

    </div>
  );
}
