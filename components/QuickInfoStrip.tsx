"use client";

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

export function QuickInfoStrip() {
  // Depends on the visitor's local clock, so server and client markup will
  // legitimately differ on first paint. suppressHydrationWarning tells React
  // that's expected here, per React's own guidance for date/time-based text
  // (https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content).
  const hoursToday = hoursByDay[new Date().getDay()];

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
          <span suppressHydrationWarning>{hoursToday}</span>
        </Item>
        <Item icon="📞" label="Call or Text">
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
