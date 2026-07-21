"use client";

import { useState } from "react";
import type { Task, TaskStatus } from "@/lib/types";
import TaskDot from "@/components/TaskDot";

export default function TaskList({
  tasks,
  onChange,
}: {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
}) {
  const [input, setInput] = useState("");

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
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="flex-1 bg-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="button"
          onClick={addTask}
          disabled={!input.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl px-4 transition"
        >
          Add
        </button>
      </div>
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
            <span className="text-neutral-200 text-sm flex-1">{task.text}</span>
            {task.status === "green" && (
              <button
                type="button"
                onClick={() => handleDelete(task.id)}
                aria-label="Delete task"
                className="text-neutral-500 hover:text-red-400 transition shrink-0"
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
