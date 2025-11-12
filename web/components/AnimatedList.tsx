// ABOUTME: Staggered list animation component for sequential item reveals
// ABOUTME: Creates a cascading entrance effect for list items

'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function AnimatedList({
  children,
  className = '',
  staggerDelay = 0.1,
}: AnimatedListProps) {
  const containerVariant = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div variants={containerVariant} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}

export function AnimatedListItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}
