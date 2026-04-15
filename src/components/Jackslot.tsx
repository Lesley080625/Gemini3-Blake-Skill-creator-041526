/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlowerTheme } from '../types';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

const flowers: { id: FlowerTheme; emoji: string; name: string }[] = [
  { id: 'rose', emoji: '🌹', name: 'Rose' },
  { id: 'lavender', emoji: '🪻', name: 'Lavender' },
  { id: 'sunflower', emoji: '🌻', name: 'Sunflower' },
  { id: 'cherry', emoji: '🌸', name: 'Cherry Blossom' },
  { id: 'orchid', emoji: '🌺', name: 'Orchid' },
  { id: 'lily', emoji: '🪷', name: 'Lily' },
  { id: 'tulip', emoji: '🌷', name: 'Tulip' },
  { id: 'daisy', emoji: '🌼', name: 'Daisy' },
  { id: 'lotus', emoji: '🪷', name: 'Lotus' },
  { id: 'marigold', emoji: '🏵️', name: 'Marigold' },
  { id: 'hibiscus', emoji: '🌺', name: 'Hibiscus' },
  { id: 'peony', emoji: '💮', name: 'Peony' },
  { id: 'jasmine', emoji: '⚪', name: 'Jasmine' },
  { id: 'bluebell', emoji: '🔔', name: 'Bluebell' },
  { id: 'poppy', emoji: '🥀', name: 'Poppy' },
  { id: 'violet', emoji: '🟣', name: 'Violet' },
  { id: 'camellia', emoji: '🏵️', name: 'Camellia' },
  { id: 'hydrangea', emoji: '💠', name: 'Hydrangea' },
  { id: 'magnolia', emoji: '🐚', name: 'Magnolia' },
  { id: 'iris', emoji: '🧿', name: 'Iris' },
];

interface JackslotProps {
  onSelect: (theme: FlowerTheme) => void;
  currentTheme: FlowerTheme;
}

export const Jackslot: React.FC<JackslotProps> = ({ onSelect, currentTheme }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(flowers.findIndex(f => f.id === currentTheme));

  const roll = () => {
    if (isRolling) return;
    setIsRolling(true);
    
    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      setDisplayIndex(Math.floor(Math.random() * flowers.length));
      count++;
      if (count >= maxCount) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * flowers.length);
        setDisplayIndex(finalIndex);
        onSelect(flowers[finalIndex].id);
        setIsRolling(false);
      }
    }, 100);
  };

  return (
    <div className="flex items-center gap-4 p-2 bg-secondary/50 rounded-full border border-primary/20">
      <div className="relative w-12 h-12 overflow-hidden bg-background rounded-full border-2 border-primary flex items-center justify-center text-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayIndex}
            initial={{ y: isRolling ? 20 : 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: isRolling ? -20 : 0, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {flowers[displayIndex].emoji}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Style</span>
        <span className="text-sm font-medium capitalize">{flowers[displayIndex].name}</span>
      </div>
      <Button 
        size="icon" 
        variant="ghost" 
        onClick={roll} 
        disabled={isRolling}
        className={isRolling ? "animate-spin" : ""}
      >
        <Sparkles className="w-4 h-4 text-primary" />
      </Button>
    </div>
  );
};
