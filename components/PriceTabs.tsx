"use client";

import { useState } from "react";
import { serviceCategories } from "@/lib/services-data";

export function PriceTabs() {
  const [activeId, setActiveId] = useState(serviceCategories[0].id);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2.5" role="tablist">
        {serviceCategories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            id={`tab-${cat.id}`}
            aria-selected={cat.id === activeId}
            aria-controls={`panel-${cat.id}`}
            onClick={() => setActiveId(cat.id)}
            className={`rounded-full border-[1.5px] px-5.5 py-2.5 text-[0.85rem] font-semibold transition-colors ${
              cat.id === activeId
                ? "border-charcoal bg-charcoal text-white"
                : "border-line bg-white hover:border-terracotta"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/*
        Every category renders in the DOM (not just the active one) and
        visibility is toggled with CSS, so the full menu is present in the
        server-rendered HTML — crawlable and visible with JavaScript off,
        matching how the original static menu worked.
      */}
      {serviceCategories.map((cat) => (
        <div
          key={cat.id}
          id={`panel-${cat.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${cat.id}`}
          hidden={cat.id !== activeId}
          className="overflow-hidden rounded-[14px] border border-line bg-white shadow-soft"
        >
          {cat.items.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-5 border-b border-line px-7 py-4.5 transition-colors last:border-b-0 hover:bg-ivory-deep"
            >
              <span className="font-semibold">
                {item.name}
                {item.desc ? (
                  <span className="mt-0.5 block text-[0.85rem] font-normal text-charcoal-soft">
                    {item.desc}
                  </span>
                ) : null}
              </span>
              <span className="whitespace-nowrap font-display text-[1.15rem] text-terracotta-dark">
                {item.price}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
