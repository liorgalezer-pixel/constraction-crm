"use client";

import { useState } from "react";
import type { ArchiveStatus, Client, Task } from "@/lib/types";
import TaskList from "@/components/TaskList";
import type { DragHandleProps } from "@/components/DraggableClientList";

const LEAD_STATUS_LABEL: Record<Client["lead_status"], string> = {
  follow_up: "Follow Up",
  sold: "Sold",
};

const LEAD_STATUS_CLASS: Record<Client["lead_status"], string> = {
  follow_up: "bg-yellow-900/40 text-yellow-400",
  sold: "bg-green-900/40 text-green-400",
};

function formatCurrency(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ClientCard({
  client,
  onUpdateTasks,
  onArchive,
  onEdit,
  dragHandle,
}: {
  client: Client;
  onUpdateTasks: (tasks: Task[]) => void;
  onArchive: (status: ArchiveStatus) => void;
  onEdit: () => void;
  dragHandle?: DragHandleProps;
}) {
  const [expanded, setExpanded] = useState(false);
  const [tasksVisible, setTasksVisible] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  async function copyToClipboard(field: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField((f) => (f === field ? null : f)), 1500);
  }

  const encodedAddress = client.address
    ? encodeURIComponent(client.address)
    : null;

  const navOptions = encodedAddress
    ? [
        {
          label: "Google Maps",
          href: `https://maps.google.com/?q=${encodedAddress}`,
        },
        {
          label: "Waze",
          href: `https://waze.com/ul?q=${encodedAddress}&navigate=yes`,
        },
        {
          label: "Apple Maps",
          href: `https://maps.apple.com/?q=${encodedAddress}`,
        },
      ]
    : null;

  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
      <div className="w-full flex items-center gap-1 px-2 py-3">
        {dragHandle && (
          <button
            type="button"
            onPointerDown={dragHandle.onPointerDown}
            onClick={(e) => e.stopPropagation()}
            aria-label="Drag to reorder"
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-300 active:text-neutral-300 transition cursor-grab active:cursor-grabbing touch-none"
          >
            ⠿
          </button>
        )}
        <div
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 min-w-0 flex items-center justify-between gap-2 text-left cursor-pointer"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p dir="auto" className="text-white font-semibold truncate">
                {client.full_name}
              </p>
              <span
                className={`text-xs font-medium rounded-md px-1.5 py-0.5 ${
                  LEAD_STATUS_CLASS[client.lead_status]
                }`}
              >
                {LEAD_STATUS_LABEL[client.lead_status]}
              </span>
            </div>
            <p dir="auto" className="text-neutral-400 text-xs truncate">
              {client.project_type}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              aria-label="Edit client"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-700 text-blue-400 transition"
            >
              ✎
            </button>
            <span className="text-neutral-400 text-sm">
              {expanded ? "▲" : "▼"}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 border-t border-neutral-800 pt-4">
        {tasksVisible ? (
          <TaskList
            tasks={client.tasks}
            onChange={onUpdateTasks}
            headerLeft={
              <button
                type="button"
                onClick={() => setTasksVisible(false)}
                className="text-neutral-500 hover:text-neutral-300 text-xs transition"
              >
                Hide tasks
              </button>
            }
          />
        ) : (
          <button
            type="button"
            onClick={() => setTasksVisible(true)}
            className="text-neutral-500 hover:text-neutral-300 text-xs transition"
          >
            Show tasks
          </button>
        )}
      </div>

      <div
        className={`grid transition-all duration-300 ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 flex flex-col gap-4 border-t border-neutral-800 pt-4">
            <div className="flex flex-col gap-2 text-sm">
              {client.phone && (
                <div className="flex items-center justify-between bg-neutral-800/50 rounded-lg px-3 py-2">
                  <span className="text-neutral-300">{client.phone}</span>
                  <button
                    onClick={() => copyToClipboard("phone", client.phone!)}
                    className="text-blue-400 hover:text-blue-300 text-xs p-2 -m-2"
                  >
                    {copiedField === "phone" ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
              {client.email && (
                <div className="flex items-center justify-between bg-neutral-800/50 rounded-lg px-3 py-2">
                  <span className="text-neutral-300 truncate">
                    {client.email}
                  </span>
                  <button
                    onClick={() => copyToClipboard("email", client.email!)}
                    className="text-blue-400 hover:text-blue-300 text-xs shrink-0 ml-2 p-2 -m-2"
                  >
                    {copiedField === "email" ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
              {client.address && (
                <div className="flex items-center justify-between bg-neutral-800/50 rounded-lg px-3 py-2">
                  <span dir="auto" className="text-neutral-300 truncate">
                    {client.address}
                  </span>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <button
                      onClick={() =>
                        copyToClipboard("address", client.address!)
                      }
                      className="text-blue-400 hover:text-blue-300 text-xs p-2 -m-2"
                    >
                      {copiedField === "address" ? "Copied!" : "Copy"}
                    </button>
                    {navOptions && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setNavMenuOpen((v) => !v)}
                          className="text-green-400 hover:text-green-300 text-xs p-2 -m-2"
                        >
                          Navigate
                        </button>
                        {navMenuOpen && (
                          <div className="absolute right-0 z-10 mt-2 w-36 bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-lg">
                            {navOptions.map((option) => (
                              <a
                                key={option.label}
                                href={option.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setNavMenuOpen(false)}
                                className="block px-4 py-3 text-xs text-neutral-200 hover:bg-neutral-700 transition"
                              >
                                {option.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-800/50 rounded-lg px-3 py-2">
                <p className="text-neutral-500 text-xs">Estimated Cost</p>
                <p className="text-white font-semibold">
                  {formatCurrency(client.estimated_cost)}
                </p>
              </div>
              <div className="bg-neutral-800/50 rounded-lg px-3 py-2">
                <p className="text-neutral-500 text-xs">Offered Price</p>
                <p className="text-white font-semibold">
                  {formatCurrency(client.offered_price)}
                </p>
              </div>
            </div>

            {client.has_mortgage && (
              <div className="bg-blue-950/40 border border-blue-900 rounded-lg px-3 py-2">
                <p className="text-blue-300 text-xs font-semibold mb-1">
                  Mortgage
                </p>
                <p className="text-neutral-300 text-sm">
                  Balance: {formatCurrency(client.mortgage_balance)}
                </p>
              </div>
            )}

            {client.description && (
              <div>
                <p className="text-neutral-500 text-xs mb-1">
                  Description / Notes
                </p>
                <p
                  dir="auto"
                  className="text-neutral-300 text-sm whitespace-pre-wrap"
                >
                  {client.description}
                </p>
              </div>
            )}

            {client.archive_status === "active" ? (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onArchive("completed")}
                  className="flex-1 bg-green-900/40 hover:bg-green-900/60 text-green-400 rounded-xl py-2.5 text-sm font-medium transition"
                >
                  ✓ Project Completed
                </button>
                <button
                  onClick={() => onArchive("cancelled")}
                  className="flex-1 bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded-xl py-2.5 text-sm font-medium transition"
                >
                  ✕ Work Cancelled
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  onClick={() => onArchive("active")}
                  className="w-full bg-blue-900/40 hover:bg-blue-900/60 text-blue-400 rounded-xl py-2.5 text-sm font-medium transition"
                >
                  ↩ Back to Active
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
