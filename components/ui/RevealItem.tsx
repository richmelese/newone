import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, fadeUpTransition, revealViewport } from '@/lib/motion';
import { useRevealInView } from '@/lib/useRevealInView';

export default function RevealItem({
  children,
  index = 0,
  className,
  amount = revealViewport.amount,
  delay = 0,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  amount?: number;
  delay?: number;
}) {
  const { ref, visible, reduceMotion } = useRevealInView(amount);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : fadeUp.hidden}
      animate={visible ? fadeUp.visible : fadeUp.hidden}
      transition={fadeUpTransition(delay, index)}
    >
      {children}
    </motion.div>
  );
}
