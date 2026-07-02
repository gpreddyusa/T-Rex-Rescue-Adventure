export interface Animal {
  id: string;
  name: string;
  emoji: string;
  photoUrl: string; // Real photograph from Unsplash
  funFact: string;
  word: string; // The CVC word, e.g. "CAN", "BUG"
  missingLetterIndex: number; // e.g. 0 for "_AN"
  wrongLetters: string[]; // 2 distractors
  sound: string; // Phonetic sound guide for Speech API, e.g. "cuh"
  blendedSound: string; // Slowly blended sound, e.g. "kuh ... ah ... nnn"
}

export interface MathProblem {
  num1: number;
  num2: number;
  operator: "+" | "-" | "x";
  answer: number;
  choices: number[];
}
