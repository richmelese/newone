import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import clsx from 'clsx';

type TiltSurfaceProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  maxTilt?: number;
  lift?: number;
};

export default function TiltSurface({
  children,
  className,
  innerClassName,
  maxTilt = 6,
  lift = 7,
}: TiltSurfaceProps) {
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;

    const surface = event.currentTarget;
    const bounds = surface.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    surface.classList.add('is-tilting');
    surface.style.setProperty('--tilt-x', `${(-vertical * maxTilt * 2).toFixed(2)}deg`);
    surface.style.setProperty('--tilt-y', `${(horizontal * maxTilt * 2).toFixed(2)}deg`);
    surface.style.setProperty('--glow-x', `${((horizontal + 0.5) * 100).toFixed(1)}%`);
    surface.style.setProperty('--glow-y', `${((vertical + 0.5) * 100).toFixed(1)}%`);
  };

  const resetTilt = (event: ReactPointerEvent<HTMLDivElement>) => {
    const surface = event.currentTarget;
    surface.classList.remove('is-tilting');
    surface.style.setProperty('--tilt-x', '0deg');
    surface.style.setProperty('--tilt-y', '0deg');
    surface.style.setProperty('--glow-x', '50%');
    surface.style.setProperty('--glow-y', '20%');
  };

  const style = {
    '--tilt-x': '0deg',
    '--tilt-y': '0deg',
    '--glow-x': '50%',
    '--glow-y': '20%',
    '--tilt-lift': `${lift}px`,
  } as CSSProperties;

  return (
    <div
      className={clsx('tilt-surface', className)}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      <div className={clsx('tilt-surface__inner', innerClassName)}>
        {children}
        <span className="tilt-surface__glare" aria-hidden="true" />
      </div>
    </div>
  );
}
