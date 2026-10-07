"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThinkingSpinner } from './ThinkingSpinner';

// Status lines shown while Digital Max writes an answer. The first two always
// come first, the rest are shuffled so repeat visitors don't see the same order.
const STATUS_LINES = {
  en: {
    opening: ['Thinking initiated 🚀', 'Starting up the brain 🧠'],
    rest: [
      'Blacked out for a bit 😵‍💫',
      'Back to thinking 💭',
      'Slept badly last night 😴',
      'Grabbing a coffee first ☕',
      'Cooking up some pasta 🍝',
      'Asking the bunnies for advice 🐰',
      'Lining up the putt ⛳',
      'Untangling the Figma file 🧶',
      'Aligning with my stakeholders 🤝',
      'Trying not to over-explain 🤐',
      "Solving a Rubik's cube on the side 🧩",
      "Dusting off the piano 🎹",
      "Thinking three moves ahead ♟️",
      "Squeezing in a ping pong match 🏓",
      "One more round of CS 🎮",
      "Checking with Ebba ❤️",
      "Asking my big sister, she's 5 minutes older 👯",
      "Fixing something in the house 🔨",
      "Adjusting the kerning 🔤",
      "Feeding Benny the bunny 🥕",
      "Putting Thomas Stenström on repeat 🎶",
      "Hitting the gym, definitely not jogging 🏋️",
      "Squeezing lemons for the pasta 🍋",
      "Looking for my ball in the rough 🏌️",
      "Drawing it on a whiteboard first ✏️",
      "On the 6 am bus to Alvesta 🚌",
      "Asking a dumb question, it rarely is 🤔",
      "Removing the bullshit 🧹",
      "Choosing between purple and orange 💜🧡",
      "Booking a meeting about the meeting 📅",
    ],
  },
  sv: {
    opening: ['Tänkandet initierat 🚀', 'Startar upp hjärnan 🧠'],
    rest: [
      'Blackade ut en stund 😵‍💫',
      'Tillbaka till tänkandet 💭',
      'Sov dåligt i natt 😴',
      'Tar en kaffe först ☕',
      'Kokar lite pasta 🍝',
      'Frågar kaninerna om råd 🐰',
      'Läser greenen ⛳',
      'Reder ut Figma-filen 🧶',
      'Alignar med mina stakeholders 🤝',
      'Försöker att inte överförklara 🤐',
      "Löser en Rubiks kub vid sidan av 🧩",
      "Dammar av elpianot 🎹",
      "Tänker tre drag framåt ♟️",
      "Klämmer in en pingismatch 🏓",
      "En runda CS till 🎮",
      "Kollar med Ebba ❤️",
      "Frågar storasyster, hon är 5 minuter äldre 👯",
      "Fixar något i huset 🔨",
      "Justerar kerningen 🔤",
      "Matar Benny the bunny 🥕",
      "Sätter Thomas Stenström på repeat 🎶",
      "Gymmar, joggar definitivt inte 🏋️",
      "Pressar citron till pastan 🍋",
      "Letar efter bollen i ruffen 🏌️",
      "Ritar upp det på en whiteboard först ✏️",
      "Sitter på 06-bussen till Alvesta 🚌",
      "Ställer en dum fråga, det är den sällan 🤔",
      "Tar bort bullshiten 🧹",
      "Väljer mellan lila och orange 💜🧡",
      "Bokar ett möte om mötet 📅",
    ],
  },
};

const LINE_DURATION = 2000;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function ThinkingStatus({ language, color }: { language: 'en' | 'sv'; color: string }) {
  // Shuffled once per answer, as indexes so a language switch keeps the order
  const [order] = useState(() => shuffle(STATUS_LINES.en.rest.map((_, i) => i)));
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep((s) => s + 1), LINE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const { opening, rest } = STATUS_LINES[language];
  // After the opening lines, loop through the shuffled rest
  const line = step < opening.length
    ? opening[step]
    : rest[order[(step - opening.length) % order.length]];

  return (
    <div className="flex items-center gap-[10px]" role="status" aria-live="polite">
      <div style={{ color }}>
        <ThinkingSpinner />
      </div>
      <span className="relative h-[20px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="block text-[14px] leading-[20px] whitespace-nowrap"
            style={{ color }}
          >
            {line}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
