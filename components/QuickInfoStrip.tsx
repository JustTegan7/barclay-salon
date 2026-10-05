"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const hoursByDay: Record<number, string> = {
  0: "Closed today",
  1: "Closed today",
  2: "Open today 10am–7pm",
  3: "Open today 10am–7pm",
  4: "Open today 10am–7pm",
  5: "Open today 9am–6pm",
  6: "Open today 9am–5pm",
};

// Shown in the prerendered HTML (and until the visitor's clock is known),
// so a static build never shows the wrong day's hours.
const fallbackHours = "Tue–Sat · Closed Sun & Mon";

export function QuickInfoStrip() {
  const [hoursToday, setHoursToday] = useState(fallbackHours);

  useEffect(() => {
    // Read the visitor's local day after mount; the page itself is static.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHoursToday(hoursByDay[new Date().getDay()]);
  }, []);

  return (
    <div className="bg-charcoal text-[#f6efe8]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 divide-y divide-white/12 md:grid-cols-4 md:divide-y-0">
        <Item icon="📍" label="Location">
          {siteConfig.address.street}
          <br />
          {siteConfig.address.city}, {siteConfig.address.state}{" "}
          {siteConfig.address.zip}
        </Item>
        <Item icon="🕐" label="Hours Today">
          {hoursToday}
        </Item>
        <Item icon="📞" label="Call Us">
          <a href={siteConfig.phoneHref} className="underline underline-offset-2">
            {siteConfig.phone}
          </a>
        </Item>
        <Item icon="🚶" label="Walk-ins">
          Always welcome —{" "}
          <Link href="/faq" className="underline underline-offset-2">
            see FAQ
          </Link>
        </Item>
      </div>
    </div>
  );
}

function Item({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5 px-6 py-5 md:border-l md:border-white/12 md:first:border-l-0">
      <span className="mt-0.5 text-[1.3rem] leading-none">{icon}</span>
      <div>
        <h4 className="mb-1 text-[0.72rem] font-bold tracking-[0.1em] text-gold uppercase">
          {label}
        </h4>
        <p className="m-0 text-[0.88rem] text-[#f0e6da]">{children}</p>
      </div>
    </div>
  );
}
