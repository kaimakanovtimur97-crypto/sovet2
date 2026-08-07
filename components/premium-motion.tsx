"use client";

import { motion, useScroll, useSpring } from "motion/react";

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
  const formatted = value.toLocaleString("ru-RU");

  return <span className={className}>{prefix}{formatted}{suffix}</span>;
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
