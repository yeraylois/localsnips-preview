/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : ItemList.tsx                                   *
 *   Purpose : SCROLLABLE LIST OF ITEMS (SIDEBAR/INBOX)       *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { Item } from "../lib/types";

/**
 * RENDERS A VERTICAL SCROLL_LIST OF SNIPPET ITEMS.
 * USED IN THE SIDEBAR AND INBOX VIEWS.
 * - Parameter items: Array of items to display
 * - Parameter selectedId: Currently active item ID
 * - Parameter onSelect: Callback when an item is clicked
 */
export default function ItemList({
  items,
  selectedId,
  onSelect
}: {
  items: Item[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex-1 overflow-auto">
      {items.length === 0 ? (
        <div className="p-6 text-sm text-neutral-500">No items. Paste something above or drop a file.</div>
      ) : (
        <div className="p-2 flex flex-col gap-2">
          {items.map(item => (
            <button
              key={item.id}
              className={`text-left w-full rounded-xl border px-3 py-3 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800 ${
                selectedId === item.id 
                ? "border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/20" 
                : "border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900"
              }`}
              onClick={() => onSelect(item.id)}
            >
              <div className="flex items-center gap-2">
                <div className="font-medium text-sm truncate text-surface-900 dark:text-surface-100">{item.title ?? "Untitled"}</div>
                {item.language && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                    {item.language}
                  </span>
                )}
                {item.status && item.status !== "done" && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {item.status}
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs text-surface-600 dark:text-surface-400 line-clamp-1">
                {item.summary ?? item.kind ?? ""}
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-surface-500 dark:text-surface-500">
                <span className="truncate">{item.collection ?? "—"}</span>
                <span>·</span>
                <span>{new Date(item.created_at).toLocaleString()}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
