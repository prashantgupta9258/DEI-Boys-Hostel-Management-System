import React from 'react';
import { motion } from 'motion/react';

interface AnimatedBlockProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  key?: React.Key;
}

export default function AnimatedBlock({ 
  children, 
  delay = 0, 
  className = "", 
  direction = 'up' 
}: AnimatedBlockProps) {
  const getInitialY = () => {
    if (direction === 'up') return 40;
    if (direction === 'down') return -40;
    return 0;
  };

  const getInitialX = () => {
    if (direction === 'left') return 40;
    if (direction === 'right') return -40;
    return 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: getInitialY(), x: getInitialX() }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 1.4, // Deliberate slow animation for each page block
        delay: delay,
        ease: [0.21, 0.85, 0.36, 1] // Custom smooth, slow decelerating ease
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
