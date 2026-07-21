"use client";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="px-4 py-2 border-b border-neutral-800">
      <div className="relative">
        <input
          type="text"
          dir="auto"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name, project type, address, or notes..."
          className="w-full bg-neutral-900 text-white placeholder-neutral-500 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition border border-neutral-800"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute left-1 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-800 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
