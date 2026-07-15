import { useEffect, useRef } from 'react';

const SPARK_POOL_SIZE = 20;

export default function CursorBrandGlow() {
  const layerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);
  const navyRef = useRef<HTMLDivElement>(null);
  const coralRef = useRef<HTMLDivElement>(null);
  const amberRef = useRef<HTMLDivElement>(null);
  const rustRef = useRef<HTMLDivElement>(null);
  const emberRef = useRef<HTMLDivElement>(null);
  const copperRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const sparkRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduceMotion) return undefined;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let glowX = targetX;
    let glowY = targetY;
    let blueX = targetX;
    let blueY = targetY;
    let goldX = targetX;
    let goldY = targetY;
    let amberX = targetX;
    let amberY = targetY;
    let rustX = targetX;
    let rustY = targetY;
    let emberX = targetX;
    let emberY = targetY;
    let copperX = targetX;
    let copperY = targetY;
    let angle = 0;
    let energy = 0;
    let previousX = targetX;
    let previousY = targetY;
    let frame = 0;
    let sparkCursor = 0;
    let lastSparkTime = 0;

    const render = () => {
      glowX += (targetX - glowX) * 0.11;
      glowY += (targetY - glowY) * 0.11;
      blueX += (targetX - blueX) * 0.065;
      blueY += (targetY - blueY) * 0.065;
      goldX += (targetX - goldX) * 0.035;
      goldY += (targetY - goldY) * 0.035;
      angle += 0.012;
      energy *= 0.92;
      layerRef.current?.style.setProperty('--cursor-energy', energy.toFixed(3));
      layerRef.current?.style.setProperty('--cursor-brightness', (1 + energy * 0.75).toFixed(3));
      layerRef.current?.style.setProperty('--cursor-ring', `${(5 + energy * 7).toFixed(1)}px`);
      layerRef.current?.style.setProperty('--cursor-blur', `${(18 + energy * 34).toFixed(1)}px`);
      layerRef.current?.style.setProperty('--cursor-alpha', (0.38 + energy * 0.38).toFixed(3));
      layerRef.current?.style.setProperty('--cursor-scale', (1 + energy * 0.55).toFixed(3));
      glowRef.current?.style.setProperty('transform', `translate3d(${glowX}px, ${glowY}px, 0)`);
      blueRef.current?.style.setProperty(
        'transform',
        `translate3d(${blueX + Math.cos(angle) * 72}px, ${blueY + Math.sin(angle) * 46}px, 0)`,
      );
      goldRef.current?.style.setProperty(
        'transform',
        `translate3d(${goldX + Math.cos(angle + Math.PI) * 105}px, ${goldY + Math.sin(angle + Math.PI) * 62}px, 0)`,
      );
      navyRef.current?.style.setProperty(
        'transform',
        `translate3d(${blueX + Math.cos(angle * 0.7 + 1.4) * 145}px, ${blueY + Math.sin(angle * 0.7 + 1.4) * 92}px, 0)`,
      );
      coralRef.current?.style.setProperty(
        'transform',
        `translate3d(${glowX + Math.cos(-angle * 1.15) * 118}px, ${glowY + Math.sin(-angle * 1.15) * 78}px, 0)`,
      );
      amberX += (targetX - amberX) * 0.08;
      amberY += (targetY - amberY) * 0.08;
      rustX += (targetX - rustX) * 0.05;
      rustY += (targetY - rustY) * 0.05;
      emberX += (targetX - emberX) * 0.095;
      emberY += (targetY - emberY) * 0.095;
      copperX += (targetX - copperX) * 0.045;
      copperY += (targetY - copperY) * 0.045;
      amberRef.current?.style.setProperty(
        'transform',
        `translate3d(${amberX + Math.cos(angle * 1.3 + 0.6) * 88}px, ${amberY + Math.sin(angle * 1.3 + 0.6) * 58}px, 0)`,
      );
      rustRef.current?.style.setProperty(
        'transform',
        `translate3d(${rustX + Math.cos(-angle * 0.85 + 2.1) * 130}px, ${rustY + Math.sin(-angle * 0.85 + 2.1) * 80}px, 0)`,
      );
      emberRef.current?.style.setProperty(
        'transform',
        `translate3d(${emberX + Math.cos(angle * 1.6 + 3.4) * 70}px, ${emberY + Math.sin(angle * 1.6 + 3.4) * 45}px, 0)`,
      );
      copperRef.current?.style.setProperty(
        'transform',
        `translate3d(${copperX + Math.cos(-angle * 0.5 + 4.2) * 150}px, ${copperY + Math.sin(-angle * 0.5 + 4.2) * 95}px, 0)`,
      );
      frame = window.requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      const distance = Math.hypot(event.clientX - previousX, event.clientY - previousY);
      energy = Math.min(1, Math.max(energy, distance / 42));
      previousX = event.clientX;
      previousY = event.clientY;
      targetX = event.clientX;
      targetY = event.clientY;
      coreRef.current?.style.setProperty('transform', `translate3d(${targetX}px, ${targetY}px, 0)`);
      glowRef.current?.classList.add('is-visible');
      blueRef.current?.classList.add('is-visible');
      goldRef.current?.classList.add('is-visible');
      navyRef.current?.classList.add('is-visible');
      coralRef.current?.classList.add('is-visible');
      amberRef.current?.classList.add('is-visible');
      rustRef.current?.classList.add('is-visible');
      emberRef.current?.classList.add('is-visible');
      copperRef.current?.classList.add('is-visible');
      coreRef.current?.classList.add('is-visible');

      const now = event.timeStamp;
      if (distance > 6 && now - lastSparkTime > 40) {
        lastSparkTime = now;
        const el = sparkRefs.current[sparkCursor % SPARK_POOL_SIZE];
        sparkCursor += 1;
        if (el) {
          const size = 5 + Math.random() * 9;
          const jitterX = (Math.random() - 0.5) * 26;
          const jitterY = (Math.random() - 0.5) * 26;
          const drift = 18 + Math.random() * 30;
          const driftAngle = Math.random() * Math.PI * 2;
          el.style.setProperty('--spark-size', `${size.toFixed(1)}px`);
          el.style.setProperty('--spark-x', `${(targetX + jitterX).toFixed(1)}px`);
          el.style.setProperty('--spark-y', `${(targetY + jitterY).toFixed(1)}px`);
          el.style.setProperty('--spark-dx', `${(Math.cos(driftAngle) * drift).toFixed(1)}px`);
          el.style.setProperty('--spark-dy', `${(Math.sin(driftAngle) * drift).toFixed(1)}px`);
          el.classList.remove('is-active');
          void el.offsetWidth;
          el.classList.add('is-active');
        }
      }
    };

    const onLeave = () => {
      glowRef.current?.classList.remove('is-visible');
      blueRef.current?.classList.remove('is-visible');
      goldRef.current?.classList.remove('is-visible');
      navyRef.current?.classList.remove('is-visible');
      coralRef.current?.classList.remove('is-visible');
      amberRef.current?.classList.remove('is-visible');
      rustRef.current?.classList.remove('is-visible');
      emberRef.current?.classList.remove('is-visible');
      copperRef.current?.classList.remove('is-visible');
      coreRef.current?.classList.remove('is-visible');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={layerRef} className="cursor-brand-layer" aria-hidden="true">
      <svg className="cursor-brand-filter" width="0" height="0">
        <filter id="cursor-liquid" x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.022" numOctaves="3" seed="8" result="noise">
            <animate attributeName="baseFrequency" dur="12s" values="0.012 0.022;0.018 0.012;0.012 0.022" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="92" xChannelSelector="R" yChannelSelector="B" />
        </filter>
      </svg>
      <div className="cursor-brand-fluid">
        <div ref={glowRef} className="cursor-brand-glow" />
        <div ref={blueRef} className="cursor-brand-blue" />
        <div ref={goldRef} className="cursor-brand-gold" />
        <div ref={navyRef} className="cursor-brand-navy" />
        <div ref={coralRef} className="cursor-brand-coral" />
        <div ref={amberRef} className="cursor-brand-amber" />
        <div ref={rustRef} className="cursor-brand-rust" />
        <div ref={emberRef} className="cursor-brand-ember" />
        <div ref={copperRef} className="cursor-brand-copper" />
      </div>
      <div className="cursor-brand-sparks">
        {Array.from({ length: SPARK_POOL_SIZE }).map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              sparkRefs.current[index] = el;
            }}
            className="cursor-brand-spark"
          />
        ))}
      </div>
      <div ref={coreRef} className="cursor-brand-core" />
    </div>
  );
}
