"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/lib/site-config";
import { trackLead } from "@/lib/analytics";

// Messages are delivered by Web3Forms (web3forms.com) to the inbox tied to
// this access key. Set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in Vercel's
// environment variables. The Contact page only shows the form when it's set.
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

const services = [
  "Not sure yet",
  "Haircut",
  "Color / Balayage",
  "Texture / Treatment",
  "Waxing",
  "Package",
];

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    form.append("access_key", accessKey);
    form.append("subject", `New message from the ${siteConfig.name} website`);
    form.append("from_name", `${siteConfig.name} Website`);

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as { success?: boolean };
      if (!res.ok || !data.success) throw new Error("Submit failed");
      trackLead("contact_form");
      formEl.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[14px] border border-line bg-white p-8 text-center shadow-soft">
        <h3 className="font-display text-[1.3rem]">Thanks, your message is on its way</h3>
        <p className="mt-2 text-charcoal-soft">
          We&apos;ll get back to you during business hours. Need us sooner?
          Call{" "}
          <a href={siteConfig.phoneHref} className="font-semibold text-terracotta-dark">
            {siteConfig.phone}
          </a>
          .
        </p>
        <button
          onClick={() => setStatus("idle")}
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
      {/* Spam honeypot: hidden from people, ignored by Web3Forms when empty. */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

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
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Tell us a little about what you're looking for..."
          className="w-full rounded-[10px] border border-line bg-ivory px-3.5 py-2.5 text-[0.92rem] focus:border-terracotta focus:outline-none"
        />
      </div>

      {status === "error" ? (
        <p className="mt-4 text-[0.88rem] text-terracotta-dark" role="alert">
          Sorry, something went wrong sending your message. Please try again,
          or call us at{" "}
          <a href={siteConfig.phoneHref} className="font-semibold underline">
            {siteConfig.phone}
          </a>
          .
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-transparent bg-terracotta px-6 py-3.5 text-[0.92rem] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(185,112,74,0.55)] transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-terracotta-dark disabled:cursor-wait disabled:opacity-70"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
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
