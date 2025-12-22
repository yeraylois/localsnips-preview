/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : CmdK.tsx                                       *
 *   Purpose : COMMAND PALETTE & GLOBAL SEARCH OVERLAY        *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useEffect, useMemo, useState } from "react";
import { Item } from "../lib/types";

/**
 * GLOBAL COMMAND PALETTE ACTIVATED BY CMD+K.
 * PROVIDES REAL-TIME SEARCH ACROSS ALL ITEMS AND NAVIGATION.
 * - Parameter onPick: Callback when an item is selected from results
 */
export default function CmdK({ onPick }: { onPick: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [res, setRes] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        setOpen(v => !v);
      }
      if (open && e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) { setQ(""); setRes([]); return; }
    const t = setTimeout(async () => {
      const query = q.trim();
      if (!query) { setRes([]); return; }
      setBusy(true);
      try {
        const r = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: query })
        });
        if (r.ok) {
          const d = await r.json();
          setRes(d.items);
        }
      } finally {
        setBusy(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [q, open]);

  const hint = useMemo(() => busy ? "Searching…" : "Type to search (text + semantic)", [busy]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 dark:bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
      <div className="w-[760px] bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-xl overflow-hidden">
        <div className="p-3 border-b border-surface-200 dark:border-surface-800 flex items-center gap-2">
          <input
            autoFocus
            className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 text-surface-900 dark:text-surface-100 placeholder:text-surface-400"
            placeholder={hint}
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button className="text-xs px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-500 dark:text-surface-400" onClick={() => setOpen(false)}>
            Esc
          </button>
        </div>
        <div className="max-h-[520px] overflow-auto custom-scrollbar">
          {res.length === 0 ? (
            <div className="p-6 text-sm text-surface-500 dark:text-surface-400">No results.</div>
          ) : (
            <div className="p-2 flex flex-col gap-2">
              {res.map(i => (
                <button
                  key={i.id}
                  className="text-left w-full rounded-xl border border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800 px-3 py-3 group transition-colors"
                  onClick={() => { onPick(i.id); setOpen(false); }}
                >
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-sm truncate text-surface-900 dark:text-surface-100">{i.title ?? "Untitled"}</div>
                    {i.language && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300">
                        {i.language}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-surface-600 dark:text-surface-400 line-clamp-1 group-hover:text-surface-900 dark:group-hover:text-surface-200">{i.summary ?? ""}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
