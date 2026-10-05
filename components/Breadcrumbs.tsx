import Link from "next/link";

export function Breadcrumbs({
  items,
  className = "",
}: {
  items: { name: string; path: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap gap-1.5 text-[0.8rem] text-charcoal-soft ${className}`}>
      {items.map((item, i) => (
        <span key={item.path} className="flex items-center gap-1.5">
          {i > 0 ? <span aria-hidden>/</span> : null}
          {i === items.length - 1 ? (
            <span aria-current="page" className="font-medium text-charcoal">
              {item.name}
            </span>
          ) : (
            <Link href={item.path} className="hover:text-terracotta-dark">
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
