"use client";

import type { ArchiveStatus } from "@/lib/types";

const TABS: { key: ArchiveStatus; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function Tabs({
  active,
  onChange,
  onAdd,
}: {
  active: ArchiveStatus;
  onChange: (status: ArchiveStatus) => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 pb-3">
      <div className="flex gap-2 overflow-x-auto flex-1 min-w-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-4 min-h-11 rounded-full text-sm font-medium whitespace-nowrap transition ${
              active === tab.key
                ? "bg-blue-600 text-white"
                : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button
        onClick={onAdd}
        aria-label="Add new client"
        className="shrink-0 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-500 text-white text-2xl font-light flex items-center justify-center transition"
      >
        +
      </button>
    </div>
  );
}
