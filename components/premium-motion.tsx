"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";

export function PageScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 190,
    damping: 32,
    mass: 0.35,
  });

  return (
    <span className="nav-scroll-progress" aria-hidden="true">
      <motion.span style={{ scaleX }} />
    </span>
  );
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.65 });
  const reduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplayValue(value);
      return;
    }

    const controls = animate(0, value, {
      duration: value > 100 ? 1.45 : 1.05,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  const formatted = displayValue.toLocaleString("ru-RU");
  const accessibleValue = `${prefix}${value.toLocaleString("ru-RU")}${suffix}`;

  return (
    <span ref={ref} className={className} aria-label={accessibleValue}>
      <span aria-hidden="true">{prefix}{formatted}{suffix}</span>
    </span>
  );
}

export function AnimatedMetricText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const match = text.match(/\d(?:[\d\u00A0\u202F ]*\d)?/);
  if (!match || match.index === undefined) return <span className={className}>{text}</span>;

  const rawNumber = match[0];
  const value = Number(rawNumber.replace(/[\s\u00A0\u202F]/g, ""));
  if (!Number.isFinite(value)) return <span className={className}>{text}</span>;

  return (
    <AnimatedNumber
      className={className}
      value={value}
      prefix={text.slice(0, match.index)}
      suffix={text.slice(match.index + rawNumber.length)}
    />
  );
}
