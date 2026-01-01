/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : ItemList.tsx                                   *
 *   Purpose : SCROLLABLE LIST OF ITEMS (SIDEBAR/INBOX)       *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { Item } from "../lib/types";
import { Folder, Calendar, Clock, AlertCircle } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { detectTechnology, getTechIconUrl } from "../lib/tech-icons";

/**
 * RENDERS A VERTICAL SCROLL_LIST OF SNIPPET ITEMS.
 * USED IN THE SIDEBAR AND INBOX VIEWS.
 * @param items ARRAY OF ITEMS TO DISPLAY
 * @param selectedId CURRENTLY ACTIVE ITEM ID
 * @param onSelect CALLBACK WHEN AN ITEM IS CLICKED
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
  const { theme, customTheme } = useTheme();
  
  // FORMAT DATE APPLE-STYLE (FORCE ENGLISH LOCALE)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {items.length === 0 ? (
        <div className="p-6 text-sm text-neutral-500">No items. Paste something above or drop a file.</div>
      ) : (
        <div className="p-2 flex flex-col gap-1.5">
          {items.map(item => {
            const techInfo = detectTechnology(item.collection, item.tags);
            
            return (
              <button
                key={item.id}
                className={`
                  text-left w-full rounded-xl border px-3.5 py-3 
                  transition-all duration-200 
                  hover:bg-surface-50 dark:hover:bg-surface-800/50
                  hover:shadow-sm hover:scale-[1.01]
                  active:scale-[0.99]
                  ${selectedId === item.id 
                    ? "shadow-sm" 
                    : "border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900"
                  }
                `}
                style={selectedId === item.id ? {
                  backgroundColor: 'var(--background)',
                  borderColor: theme === 'custom' && customTheme?.brandHue !== undefined
                    ? `hsl(${customTheme.brandHue}, ${customTheme.brandSat}%, 45%)`
                    : 'var(--brand-500)',
                } : undefined}
                onClick={() => onSelect(item.id)}
              >
                {/* ROW 1: TITLE + BADGES */}
                <div className="flex items-center gap-2">
                  {/* TECH ICON */}
                  {techInfo && (
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ 
                        backgroundColor: theme === 'custom' && customTheme?.brandHue !== undefined
                          ? `hsla(${customTheme.brandHue}, ${customTheme.brandSat}%, 50%, 0.15)`
                          : `${techInfo.color}20`
                      }}
                    >
                      <img 
                        src={getTechIconUrl(techInfo.slug, techInfo.color.replace('#', ''))} 
                        alt={techInfo.name}
                        className="w-3.5 h-3.5"
                        style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))' }}
                      />
                    </div>
                  )}
                  
                  {/* TITLE */}
                  <div className="font-medium text-sm truncate flex-1 text-surface-900 dark:text-surface-100">
                    {item.title ?? "Untitled"}
                  </div>
                  
                  {/* LANGUAGE PILL */}
                  {item.language && (
                    <span 
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: theme === 'custom' && customTheme?.brandHue !== undefined
                          ? `hsl(${customTheme.brandHue}, ${customTheme.brandSat}%, 50%)`
                          : 'var(--brand-500, #10b981)',
                        color: 'white',
                      }}
                    >
                      {item.language}
                    </span>
                  )}
                  
                  {/* STATUS PILL */}
                  {item.status && item.status !== "done" && item.status !== "complete" && (
                    <span className={`
                      text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0
                      ${item.status === 'conflict_pending' 
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : item.status === 'failed' || item.status === 'error'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                      }
                    `}>
                      {item.status === 'conflict_pending' ? 'Conflict' : 
                       item.status === 'queue' ? 'Queued' :
                       item.status === 'processing' ? 'Processing...' :
                       item.status}
                    </span>
                  )}
                </div>
                
                {/* ROW 2: SUMMARY */}
                <div className="mt-1.5 text-xs text-surface-600 dark:text-surface-400 line-clamp-1">
                  {item.summary ?? item.kind ?? ""}
                </div>
                
                {/* ROW 3: METADATA - APPLE STYLE (ACCENT SYNCED) */}
                <div className="mt-2.5 flex items-center gap-3 text-[10px]">
                  {/* COLLECTION */}
                  <div 
                    className="flex items-center gap-1 truncate max-w-[45%]"
                    style={{
                      color: theme === 'custom' && customTheme?.brandHue !== undefined
                        ? `hsl(${customTheme.brandHue}, ${customTheme.brandSat}%, 40%)`
                        : 'var(--brand-600, #059669)'
                    }}
                  >
                    {(!item.collection || item.collection === "Uncategorized") ? (
                         <>
                            <AlertCircle className="w-3 h-3 shrink-0 text-amber-500 dark:text-amber-400" />
                            <span className="truncate text-amber-600 dark:text-amber-400 font-medium">Uncategorized</span>
                         </>
                    ) : (
                         <>
                            <Folder className="w-3 h-3 shrink-0 opacity-70" />
                            <span className="truncate">{item.collection}</span>
                         </>
                    )}
                  </div>
                  
                  {/* SEPARATOR */}
                  <div 
                    className="w-px h-3 opacity-30"
                    style={{
                      backgroundColor: theme === 'custom' && customTheme?.brandHue !== undefined
                        ? `hsl(${customTheme.brandHue}, ${customTheme.brandSat}%, 50%)`
                        : 'var(--brand-400, #34d399)'
                    }}
                  />
                  
                  {/* DATE/TIME */}
                  <div 
                    className="flex items-center gap-1 shrink-0"
                    style={{
                      color: theme === 'custom' && customTheme?.brandHue !== undefined
                        ? `hsl(${customTheme.brandHue}, ${customTheme.brandSat}%, 45%)`
                        : 'var(--brand-600, #059669)'
                    }}
                  >
                    <Clock className="w-3 h-3 opacity-70" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
