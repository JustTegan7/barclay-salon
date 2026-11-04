"use client";

import { useEffect, useRef } from "react";

const EMBED_SRC = "https://juniperbooking.com/embed.js";

// Mounts the Juniper booking iframe. The embed script only scans for
// [data-juniper-booking] when it executes, so on client-side navigation we
// re-add the script after the div renders, and remove it on unmount so it is
// never injected twice.
export function JuniperBooking({ slug }: { slug: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
      host.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      data-juniper-booking={slug}
      data-theme="light"
      className="min-h-[600px] w-full max-w-full [&_iframe]:block [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:border-0"
    />
  );
}
