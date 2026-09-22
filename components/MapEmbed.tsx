import { siteConfig } from "@/lib/site-config";

export function MapEmbed({ className = "" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[14px] border border-line shadow-soft ${className}`}
    >
      <iframe
        src={siteConfig.mapEmbedSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map to ${siteConfig.name}`}
        className="block h-full min-h-[360px] w-full border-0"
      />
    </div>
  );
}
