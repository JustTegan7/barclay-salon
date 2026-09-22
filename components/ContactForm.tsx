"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/lib/site-config";
import { trackLead } from "@/lib/analytics";

// TODO before launch: this currently hands off to the visitor's email client
// via a `mailto:` link (so it works with zero backend), rather than actually
// submitting anywhere. If you want it to land quietly in an inbox instead,
// wire it to a form backend (e.g. a Next.js Route Handler + Resend, or a
// service like Formspree) and swap the body of handleSubmit.

const services = [
  "Not sure yet",
  "Haircut",
  "Color / Balayage",
  "Texture / Treatment",
  "Waxing",
  "Package",
];

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const service = String(form.get("service") ?? "");
    const message = String(form.get("message") ?? "");

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Interested in: ${service}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    trackLead("contact_form");

    window.location.href = `mailto:?subject=${encodeURIComponent(
      `New inquiry from ${siteConfig.name} website`
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-[14px] border border-line bg-white p-8 text-center shadow-soft">
        <h3 className="font-display text-[1.3rem]">Almost there</h3>
        <p className="mt-2 text-charcoal-soft">
          Your email app should have opened with your message ready to send.
          If it didn&apos;t, you can reach us directly at{" "}
          <a href={siteConfig.phoneHref} className="font-semibold text-terracotta-dark">
            {siteConfig.phone}
          </a>
          .
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-[0.85rem] font-semibold text-terracotta-dark underline underline-offset-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[14px] border border-line bg-white p-7 shadow-soft sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
        <div>
          <label className="mb-1.5 block text-[0.85rem] font-semibold" htmlFor="service">
            Interested in
          </label>
          <select
            id="service"
            name="service"
            className="w-full rounded-[10px] border border-line bg-ivory px-3.5 py-2.5 text-[0.92rem] focus:border-terracotta focus:outline-none"
          >
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block text-[0.85rem] font-semibold" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us a little about what you're looking for..."
          className="w-full rounded-[10px] border border-line bg-ivory px-3.5 py-2.5 text-[0.92rem] focus:border-terracotta focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-transparent bg-terracotta px-6 py-3.5 text-[0.92rem] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(185,112,74,0.55)] transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-terracotta-dark"
      >
        Send Message
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[0.85rem] font-semibold" htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-[10px] border border-line bg-ivory px-3.5 py-2.5 text-[0.92rem] focus:border-terracotta focus:outline-none"
      />
    </div>
  );
}
