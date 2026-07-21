"use client";

import { useState } from "react";
import type { Task, TaskStatus } from "@/lib/types";
import TaskDot from "@/components/TaskDot";

export default function TaskList({
  tasks,
  onChange,
  headerLeft,
}: {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
  headerLeft?: React.ReactNode;
}) {
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);

  function addTask() {
    if (!input.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: input.trim(),
      status: "grey",
    };
    onChange([...tasks, newTask]);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  }

  function handleStatusChange(taskId: string, status: TaskStatus) {
    onChange(tasks.map((t) => (t.id === taskId ? { ...t, status } : t)));
  }

  function handleDelete(taskId: string) {
    onChange(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <div className="flex flex-col gap-2">
      {adding ? (
        <div className="flex items-center gap-2">
          {headerLeft}
          <input
            autoFocus
            dir="auto"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!input.trim()) setAdding(false);
            }}
            placeholder="Add a task..."
            className="flex-1 bg-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="button"
            onClick={() => {
              addTask();
              setAdding(false);
            }}
            disabled={!input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl px-4 min-h-11 transition"
          >
            Add
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          {headerLeft}
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="text-blue-400 hover:text-blue-300 text-xs font-medium transition p-2 -m-2"
          >
            + Add task
          </button>
        </div>
      )}
      <ul className="flex flex-col gap-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 bg-neutral-800/60 rounded-lg px-3 py-2"
          >
            <TaskDot
              status={task.status}
              onChange={(status) => handleStatusChange(task.id, status)}
            />
            <span dir="auto" className="text-neutral-200 text-sm flex-1">
              {task.text}
            </span>
            {task.status === "green" && (
              <button
                type="button"
                onClick={() => handleDelete(task.id)}
                aria-label="Delete task"
                className="text-neutral-500 hover:text-red-400 transition shrink-0 p-2 -m-2"
              >
                🗑
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
