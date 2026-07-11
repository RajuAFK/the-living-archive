"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Footer contact form. POSTs to the PHP endpoint (MySQL + email delivery).
 * Honeypot field `website` — bots fill it, humans never see it.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    try {
      const res = await fetch("/api/public/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Something went wrong. Please try again.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex min-h-[280px] flex-col items-start justify-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-verdigris">
          ● received
        </p>
        <p className="display mt-4 text-2xl text-linen">
          Thank you — we&apos;ll be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Name" name="name" type="text" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
      </div>
      <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
      <div>
        <label htmlFor="cf-message" className="label-mono block">
          What are you looking to document?
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={4}
          className="mt-2 w-full resize-none border-b bg-transparent pb-2 text-[15px] text-fg outline-none transition-colors duration-300 focus:border-verdigris"
          style={{ borderColor: "var(--hairline-strong)" }}
        />
      </div>

      {/* honeypot — invisible to humans */}
      <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p className="text-[13px] text-[#c96f5a]" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-3 rounded-full border border-verdigris/60 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-verdigris transition-all duration-300 hover:bg-verdigris hover:text-ink-0 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = `cf-${name}`;
  return (
    <div>
      <label htmlFor={id} className="label-mono block">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full border-b bg-transparent pb-2 text-[15px] text-fg outline-none transition-colors duration-300 focus:border-verdigris"
        style={{ borderColor: "var(--hairline-strong)" }}
      />
    </div>
  );
}
