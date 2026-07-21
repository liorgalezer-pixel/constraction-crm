"use client";

import type { TaskStatus } from "@/lib/types";

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  grey: "yellow",
  yellow: "green",
  green: "grey",
};

const COLOR_CLASS: Record<TaskStatus, string> = {
  grey: "bg-neutral-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
};

export default function TaskDot({
  status,
  onChange,
}: {
  status: TaskStatus;
  onChange: (next: TaskStatus) => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Task status: ${status}`}
      onClick={() => onChange(NEXT_STATUS[status])}
      className={`w-5 h-5 rounded-full shrink-0 transition-colors ${COLOR_CLASS[status]}`}
    />
  );
}
