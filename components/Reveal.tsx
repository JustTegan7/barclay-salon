"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades + slides children into view the first time they cross the viewport.
 * Pass `stagger` to animate direct children one after another instead of
 * the wrapper as a single block (mirrors the original .reveal-stagger CSS).
 */
export function Reveal({
  children,
  stagger = false,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  stagger?: boolean;
  className?: string;
  as?: "div" | "ul";
}) {
  const ref = useRef<HTMLDivElement | HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = `${stagger ? "reveal-stagger" : "reveal"} ${className}`;

  if (Tag === "ul") {
    return (
      <ul ref={ref as React.RefObject<HTMLUListElement>} className={cls}>
        {children}
      </ul>
    );
  }

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={cls}>
      {children}
    </div>
  );
}
