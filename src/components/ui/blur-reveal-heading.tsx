'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface BlurRevealSegment {
  text: string;
  className?: string;
  /** Keep CSS `h2 span` accent styling instead of inheriting the parent heading color. */
  accent?: boolean;
  /** Insert a line break before this segment. */
  breakBefore?: boolean;
}

export interface BlurRevealHeadingProps {
  id?: string;
  as?: 'h1' | 'h2' | 'h3';
  text?: string;
  segments?: BlurRevealSegment[];
  className?: string;
  wordClassName?: string;
  stagger?: number;
  duration?: number;
}

interface FlatWord {
  word: string;
  className?: string;
  accent?: boolean;
  breakBefore?: boolean;
  spaceAfter: boolean;
}

export function BlurRevealHeading({
  id,
  as = 'h2',
  text,
  segments,
  className,
  wordClassName,
  stagger = 0.06,
  duration = 0.36,
}: BlurRevealHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const [useBlur, setUseBlur] = React.useState(false);

  React.useEffect(() => {
    // Only animate CSS blur on desktop fine-pointer devices; mobile uses pure GPU opacity + transform
    const desktopFine = window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
    setUseBlur(desktopFine);
  }, []);

  const resolvedSegments: BlurRevealSegment[] =
    segments && segments.length > 0
      ? segments
      : text
        ? [{ text }]
        : [];

  const flatWords: FlatWord[] = [];

  resolvedSegments.forEach((segment, segIdx) => {
    const words = segment.text.trim().split(/\s+/).filter(Boolean);
    words.forEach((word, wIdx) => {
      const isFirstInSegment = wIdx === 0;
      const isLastInSegment = wIdx === words.length - 1;
      const nextSegment = resolvedSegments[segIdx + 1];
      const nextHasBreak = Boolean(nextSegment?.breakBefore);
      const isLastOverall = segIdx === resolvedSegments.length - 1 && isLastInSegment;

      flatWords.push({
        word,
        className: segment.className,
        accent: segment.accent,
        breakBefore: isFirstInSegment && Boolean(segment.breakBefore),
        spaceAfter: !isLastOverall && !(isLastInSegment && nextHasBreak),
      });
    });
  });

  const initialState = prefersReducedMotion
    ? false
    : useBlur
      ? { opacity: 0, filter: 'blur(5px)', y: 12 }
      : { opacity: 0, y: 12 };

  const visibleState = useBlur
    ? { opacity: 1, filter: 'blur(0px)', y: 0 }
    : { opacity: 1, y: 0 };

  const content = flatWords.map((item, index) => {
    const inheritColor = !item.accent && !item.className;

    return (
      <React.Fragment key={`${item.word}-${index}`}>
        {item.breakBefore && <br />}
        <motion.span
          initial={initialState}
          whileInView={visibleState}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: prefersReducedMotion ? 0 : duration,
            delay: prefersReducedMotion ? 0 : index * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            display: 'inline-block',
            ...(inheritColor ? { color: 'inherit' } : {}),
          }}
          className={cn('inline-block', wordClassName, item.className)}
        >
          {item.word}
        </motion.span>
        {item.spaceAfter ? ' ' : null}
      </React.Fragment>
    );
  });

  if (as === 'h1') {
    return (
      <h1 id={id} className={className}>
        {content}
      </h1>
    );
  }

  if (as === 'h3') {
    return (
      <h3 id={id} className={className}>
        {content}
      </h3>
    );
  }

  return (
    <h2 id={id} className={className}>
      {content}
    </h2>
  );
}

export default BlurRevealHeading;
