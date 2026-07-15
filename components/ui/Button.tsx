import Link from 'next/link';
import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const MotionLink = motion(Link);
const tapProps = { whileTap: { scale: 0.96 } };

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'dark';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent-500 text-white shadow-cta hover:bg-accent-600 active:bg-accent-700',
  secondary: 'bg-white text-primary-700 border-2 border-primary-600 hover:bg-primary-50',
  outline: 'bg-transparent text-ink-800 border border-neutral-300 hover:bg-neutral-100',
  ghost: 'bg-transparent text-primary-700 hover:bg-primary-50',
  dark: 'bg-primary-700 text-white shadow-soft hover:bg-primary-800 active:bg-primary-900',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2',
};

const base =
  'inline-flex items-center justify-center rounded-pill font-semibold transition-all duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0 whitespace-nowrap';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
};

// framer-motion's `motion.*` components redefine drag/animation event handlers with
// their own (incompatible) signatures, so they're omitted from the native HTML attrs here.
type MotionSafeHandlers = 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration';

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, MotionSafeHandlers> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, MotionSafeHandlers> & {
    href: string;
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, className, children, ...props },
  ref,
) {
  const classes = clsx(base, variantClasses[variant], sizeClasses[size], fullWidth && 'w-full', className);

  if ('href' in props && props.href) {
    const { href, external, ...rest } = props as ButtonAsLink;
    if (external) {
      return (
        <motion.a
          ref={ref as never}
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...tapProps}
          {...rest}
        >
          {children}
        </motion.a>
      );
    }
    return (
      <MotionLink ref={ref as never} href={href} className={classes} {...tapProps} {...rest}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button ref={ref as never} className={classes} {...tapProps} {...(props as ButtonAsButton)}>
      {children}
    </motion.button>
  );
});

export default Button;
