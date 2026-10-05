import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[1180px] px-6 ${className}`}>{children}</div>
  );
}

export function Section({
  children,
  id,
  alt = false,
  className = "",
}: {
  children: ReactNode;
  id?: string;
  /** Slightly deeper ivory background, used to alternate sections. */
  alt?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${alt ? "bg-ivory-deep" : ""} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={`mb-10 md:mb-13 max-w-[640px] ${
        align === "center" ? "mx-auto text-center" : "text-left"
      } ${className}`}
    >
      {eyebrow ? (
        <span className="mb-2.5 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-terracotta-dark">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-medium tracking-[-0.01em]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-[1.02rem] text-charcoal-soft">{description}</p>
      ) : null}
    </div>
  );
}
