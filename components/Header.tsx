"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Header({ email }: { email: string | null }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 bg-neutral-950/95 backdrop-blur border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold text-white">Constraction CRM</h1>
      <div className="flex items-center gap-3">
        {email && (
          <span className="text-xs text-neutral-400 hidden sm:inline">
            {email}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
