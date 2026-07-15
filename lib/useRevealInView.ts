import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { revealViewport } from './motion';

export function useRevealInView(amount = revealViewport.amount) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount });
  const [fallbackVisible, setFallbackVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion === true || inView) return;

    const node = ref.current;
    if (!node) return;

    const isInViewport = () => {
      const rect = node.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const revealIfVisible = () => {
      if (isInViewport()) setFallbackVisible(true);
    };

    const raf = requestAnimationFrame(revealIfVisible);
    const timer = window.setTimeout(revealIfVisible, 600);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [reduceMotion, inView]);

  const visible = reduceMotion === true || inView || fallbackVisible;

  return { ref, visible, reduceMotion };
}
