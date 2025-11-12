// ABOUTME: Animated wrapper for comparison view transitions
// ABOUTME: Handles smooth transitions when parties are added/removed from comparison

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedComparisonProps {
  children: ReactNode;
  partyKey: string;
  index: number;
}

export default function AnimatedComparison({ children, partyKey, index }: AnimatedComparisonProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={partyKey}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
