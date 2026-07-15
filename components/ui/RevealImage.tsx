import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUpTransition, revealViewport } from '@/lib/motion';
import { useRevealInView } from '@/lib/useRevealInView';

const hidden = { opacity: 0, y: 24, scale: 0.98 };
const visible = { opacity: 1, y: 0, scale: 1 };

export default function RevealImage({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const { ref, visible: show, reduceMotion } = useRevealInView(revealViewport.amount);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : hidden}
      animate={show ? visible : hidden}
      transition={fadeUpTransition(0, index)}
    >
      {children}
    </motion.div>
  );
}
