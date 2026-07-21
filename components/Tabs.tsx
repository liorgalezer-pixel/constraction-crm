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
}: {
  active: ArchiveStatus;
  onChange: (status: ArchiveStatus) => void;
}) {
  return (
    <div className="flex gap-2 px-4 py-2 overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
            active === tab.key
              ? "bg-blue-600 text-white"
              : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
