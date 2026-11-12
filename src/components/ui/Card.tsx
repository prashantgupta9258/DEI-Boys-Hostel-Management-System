import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <motion.div
      className={`bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
