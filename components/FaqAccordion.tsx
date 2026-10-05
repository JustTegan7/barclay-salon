"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/faq-data";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const defaultIndex = items.findIndex((i) => i.defaultOpen);
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultIndex >= 0 ? defaultIndex : null
  );

  return (
    <div className="mx-auto max-w-[820px]">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.question}
            data-open={isOpen}
            className="faq-item border-b border-line"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-5 py-5.5 text-left font-display text-[1.08rem]"
            >
              <span>{item.question}</span>
              <span className="faq-plus flex-shrink-0 text-[1.4rem] text-terracotta transition-transform duration-300">
                +
              </span>
            </button>
            <div className="faq-answer">
              <div>
                <p className="max-w-[70ch] pb-5.5 text-charcoal-soft">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
