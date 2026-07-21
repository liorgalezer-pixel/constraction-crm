"use client";

export default function Fab({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Add new client"
      className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-3xl font-light flex items-center justify-center shadow-lg shadow-blue-900/50 transition z-20"
    >
      +
    </button>
  );
}
