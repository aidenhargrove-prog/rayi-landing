"use client";

import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage(
        data?.duplicate
          ? "You’re already on the list ✅"
          : "You’re in. Launch updates soon 🚀"
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="text-xs tracking-widest uppercase text-white/60">
          Coming soon
        </p>

        {/* LOGO */}
        <h1 className="mt-3 text-5xl font-semibold tracking-tight">
          Ray
          <span className="text-[#1DA1F2]">.</span>
          i
        </h1>

        <p className="mt-4 text-white/75 text-base leading-relaxed">
        From mix to master to release — clear guidance at every step.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-white text-black py-3 font-medium active:scale-[0.99] disabled:opacity-60"
          >
            {status === "loading" ? "Joining..." : "Join the waitlist"}
          </button>
        </form>

        {message ? (
          <p
            className={`mt-4 text-sm ${
              status === "error" ? "text-red-400" : "text-white/80"
            }`}
          >
            {message}
          </p>
        ) : (
          <p className="mt-4 text-xs text-white/45">
            No spam. Just launch + early access updates.
          </p>
        )}
      </div>
    </main>
  );
}
