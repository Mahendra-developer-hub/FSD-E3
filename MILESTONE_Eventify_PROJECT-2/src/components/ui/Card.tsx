import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface CardProps extends HTMLMotionProps<"div"> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  glass = true, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "rounded-2xl border transition-all duration-300 overflow-hidden";
  const glassStyles = "bg-white/70 dark:bg-stone-900/70 backdrop-blur-md border-white/20 dark:border-stone-700/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]";
  const solidStyles = "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm";

  return (
    <motion.div 
      className={`${baseStyles} ${glass ? glassStyles : solidStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
