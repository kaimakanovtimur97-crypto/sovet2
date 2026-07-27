"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

export function AnimatedFaq({
  question,
  answer,
  index = 0,
}: {
  question: string;
  answer: string;
  index?: number;
}) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.38;

  return (
    <motion.div
      className={`animated-faq liquid-glass${open ? " is-open" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : index * 0.055 }}
      layout={!reduceMotion}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{question}</span>
        <motion.i
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0, scale: open ? 1.08 : 1 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChevronDown size={18} />
        </motion.i>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="animated-faq-answer"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
