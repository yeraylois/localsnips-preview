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
import { MOCK_ITEMS } from "../lib/mock-data";
import { X } from "lucide-react";

/**
 * GLOBAL COMMAND PALETTE ACTIVATED BY CMD+K.
 * PROVIDES REAL-TIME SEARCH ACROSS ALL ITEMS AND NAVIGATION.
 * @param onPick CALLBACK WHEN AN ITEM IS SELECTED FROM RESULTS
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
    
    // CUSTOM EVENT SUPPORT FOR MOBILE BUTTON
    const onCustomOpen = () => setOpen(true);
    window.addEventListener("open-cmdk", onCustomOpen);
    
    return () => {
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("open-cmdk", onCustomOpen);
    };
  }, [open]);

  useEffect(() => {
    if (!open) { setQ(""); setRes([]); return; }
    const t = setTimeout(() => {
      const query = q.trim().toLowerCase();
      if (!query) { setRes([]); return; }
      setBusy(true);
      
      // LOCAL SEARCH
      const results = MOCK_ITEMS.filter(item => {
        const searchFields = [
          item.title,
          item.summary,
          item.raw_content,
          item.language,
          item.collection,
          ...(item.tags || [])
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchFields.includes(query);
      });
      
      setRes(results);
      setBusy(false);
    }, 200);
    return () => clearTimeout(t);
  }, [q, open]);

  const hint = useMemo(() => busy ? "Searching…" : "Type to search (text + semantic)", [busy]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 dark:bg-black/50 backdrop-blur-sm flex items-start justify-center pt-4 md:pt-20">
      <div className="w-[94%] md:w-[760px] bg-white dark:bg-surface-900 rounded-2xl border border-[color-mix(in_srgb,var(--brand-500),transparent_50%)] shadow-xl overflow-hidden flex flex-col max-h-[70vh] md:max-h-[520px]">
        <div className="p-3 border-b border-surface-200 dark:border-surface-800 flex items-center gap-2">
          <input
            autoFocus
            className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-base md:text-sm outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand-500),transparent_80%)] focus:border-brand-500 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 transtion-all"
            placeholder={hint}
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button 
            className="p-2.5 rounded-xl bg-surface-100/80 dark:bg-white/5 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/5 hover:bg-surface-200 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-surface-500 hover:text-brand-600 dark:hover:text-brand-400" 
            onClick={() => setOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
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
