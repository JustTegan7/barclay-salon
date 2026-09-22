"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { trackLead } from "@/lib/analytics";

type Variant = "primary" | "ghost" | "light";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap " +
  "border-[1.5px] border-transparent transition-all duration-[250ms] ease-out cursor-pointer " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta";

const sizes: Record<Size, string> = {
  md: "px-6 py-3.5 text-[0.92rem]",
  sm: "px-4 py-2.5 text-[0.8rem]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-terracotta text-white shadow-[0_10px_24px_-8px_rgba(185,112,74,0.55)] " +
    "hover:bg-terracotta-dark hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-8px_rgba(185,112,74,0.65)]",
  ghost:
    "bg-transparent border-charcoal text-charcoal hover:bg-charcoal hover:text-white hover:-translate-y-0.5",
  light: "bg-white text-charcoal hover:bg-charcoal hover:text-white hover:-translate-y-0.5",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  /** GA4 generate_lead source label. When set, fires on click before navigating. */
  trackAs?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  trackAs,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      onClick={(e) => {
        if (trackAs) trackLead(trackAs);
        onClick?.(e);
      }}
      {...props}
    />
  );
}

type ButtonLinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  trackAs,
  href,
  onClick,
  ...props
}: ButtonLinkProps) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const isInternal = href.startsWith("/") || href.startsWith("#");

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (trackAs) trackLead(trackAs);
    onClick?.(e);
  };

  if (isInternal) {
    return (
      <Link href={href} className={classes} onClick={handleClick} {...props} />
    );
  }

  return (
    <a
      href={href}
      target={props.target ?? "_blank"}
      rel={props.rel ?? "noopener"}
      className={classes}
      onClick={handleClick}
      {...props}
    />
  );
}
