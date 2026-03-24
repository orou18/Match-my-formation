"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

interface AnimatedCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDrag'> {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  hover?: boolean;
  children: React.ReactNode;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    variant = 'default', 
    hover = true, 
    children, 
    className = '',
    ...props 
  }, ref) => {
    const baseClasses = "rounded-2xl transition-all duration-300";
    
    const variants = {
      default: "bg-white shadow-md border border-gray-100",
      glass: "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg",
      gradient: "bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 shadow-lg",
      elevated: "bg-white shadow-xl border border-gray-200"
    };
    
    const hoverClasses = hover ? "hover:shadow-xl hover:scale-105 hover:-translate-y-1" : "";
    
    const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`;

    return (
      <motion.div
        ref={ref}
        className={classes}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={hover ? { 
          y: -4,
          transition: { duration: 0.2 }
        } : {}}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

export default AnimatedCard;
