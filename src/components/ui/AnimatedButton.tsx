import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
}

export function AnimatedButton({ children, className, onClick, disabled, type = 'button', style, ...props }: AnimatedButtonProps) {
  return (
    <motion.button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden'
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
