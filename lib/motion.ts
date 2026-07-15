export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const fadeUpTransition = (delay = 0, index = 0) => ({
  duration: 0.55,
  ease: 'easeOut' as const,
  delay: delay + (index % 6) * 0.08,
});

export const revealViewport = { once: true, amount: 0.05 };

/** Staggered container for grids of children using `fadeUp`/`tiltCard` item variants. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Flatter hover lift for non-tilted surfaces (buttons, chips, list rows). */
export const hoverLift = {
  y: -3,
  transition: { type: 'spring' as const, stiffness: 300, damping: 22 },
};

export const tapScale = { scale: 0.96 };

/** Subtle whole-page fade/slide used for route transitions in _app.tsx. */
export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' as const } },
};
