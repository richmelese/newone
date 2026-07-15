import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, fadeUpTransition, revealViewport } from '@/lib/motion';
import { useRevealInView } from '@/lib/useRevealInView';

export default function Reveal({
  children,
  className,
  delay = 0,
  amount = revealViewport.amount,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  const { ref, visible, reduceMotion } = useRevealInView(amount);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : 'hidden'}
      animate={visible ? 'visible' : 'hidden'}
      variants={fadeUp}
      transition={fadeUpTransition(delay)}
    >
      {children}
    </motion.div>
  );
}
