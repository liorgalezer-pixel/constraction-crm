"use client";

import { useState } from "react";
import { parseLeadText, type ParsedLead } from "@/lib/parseLead";

export default function PasteLeadModal({
  onClose,
  onParsed,
  onSkip,
}: {
  onClose: () => void;
  onParsed: (lead: ParsedLead) => void;
  onSkip: () => void;
}) {
  const [text, setText] = useState("");

  function handleParse() {
    const lead = parseLeadText(text);
    onParsed(lead);
  }

  return (
    <div className="fixed inset-0 z-30 bg-black/60 flex items-end sm:items-center justify-center">
      <div className="bg-neutral-900 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl border border-neutral-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <h2 className="text-white font-bold text-lg">Paste Lead</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <p className="text-neutral-400 text-sm">
            Paste the lead notification text below and we&apos;ll pre-fill the
            new client form for you.
          </p>
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              "4:00 pm\n07-20-2026\nSONIA GUTIERREZ\n14641 Pavo Court, Victorville, California 92394\nFlooring"
            }
            rows={6}
            className="bg-neutral-800 text-white placeholder-neutral-600 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition resize-none font-mono"
          />

          <div className="flex gap-2">
            <button
              onClick={onSkip}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl py-3 text-sm font-medium transition"
            >
              Skip / Manual Entry
            </button>
            <button
              onClick={handleParse}
              disabled={!text.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition"
            >
              Parse & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
