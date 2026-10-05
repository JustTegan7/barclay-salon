import { Breadcrumbs } from "./Breadcrumbs";

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs: { name: string; path: string }[];
}) {
  return (
    <section
      className="px-6 pt-12 pb-16 text-center"
      style={{
        backgroundImage:
          "radial-gradient(circle at 85% 20%, rgba(199,154,92,.18), transparent 45%), radial-gradient(circle at 10% 90%, rgba(185,112,74,.14), transparent 40%)",
        backgroundColor: "var(--color-ivory)",
      }}
    >
      <div className="mx-auto max-w-[720px]">
        <Breadcrumbs items={crumbs} className="mb-5 justify-center" />
        <span className="mb-2.5 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-terracotta-dark">
          {eyebrow}
        </span>
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.01em]">
          {title}
        </h1>
        {description ? (
          <p className="mx-auto mt-3.5 max-w-[60ch] text-[1.05rem] text-charcoal-soft">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
