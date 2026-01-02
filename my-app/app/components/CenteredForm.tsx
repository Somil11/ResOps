"use client";

import { useState } from "react";

export default function CenteredForm() {
  const [value, setValue] = useState("");
  // ensure a persistent user id per browser
  const uidKey = "resops_user_id";
  let userId = typeof window !== "undefined" ? localStorage.getItem(uidKey) : null;
  if (!userId && typeof window !== "undefined") {
    userId = `user_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem(uidKey, userId);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // POST to our server route which stores submissions for AI interpretation
    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value, userId }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        console.log("Saved:", data.item);
        setValue("");
      })
      .catch((err) => {
        console.error(err);
        // optional: show user-facing error state
      });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <form onSubmit={handleSubmit} className="flex w-full max-w-3xl items-center gap-3 px-4">
        <input
          name="text"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter text..."
          className="min-w-0 flex-1 rounded-md border border-black/[0.08] bg-white px-6 py-3 text-base outline-none dark:border-white/[0.08] dark:bg-[#0b0b0b] dark:text-zinc-50"
        />
        <button
          type="submit"
          className="rounded-full bg-black px-5 py-3 text-white hover:bg-[#222] dark:bg-zinc-50 dark:text-black"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
