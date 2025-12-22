/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : DiffModal.tsx                                  *
 *   Purpose : VISUAL DIFF VIEWER & CONFLICT RESOLUTION UI    *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useMemo, useState, useEffect } from "react";
import { diffLines } from "diff";
import { Item } from "../lib/types";
import { AlertTriangle, GitMerge, Link2, Save, X, Check, Undo2, CheckCircle } from "lucide-react";

type Conflict = { candidate_id: string; similarity: number; candidate: Item };

type ActionState = {
  type: "link" | "merge_docs" | null;
  status: "pending" | "completed";
};

/**
 * MODAL FOR COMPARING DUPLICATE/CONFLICTING ITEMS.
 * SHOWS SIDE-BY-SIDE DIFF AND RESOLUTION ACTIONS (SAVE AS NEW, LINK, MERGE).
 * - Parameter item: The new item causing the conflict
 * - Parameter conflicts: List of existing similar items
 * - Parameter onClose: Callback to close without action
 * - Parameter onResolved: Callback when a resolution is applied
 */
export default function DiffModal({
  item,
  conflicts,
  onClose,
  onResolved
}: {
  item: Item;
  conflicts: Conflict[];
  onClose: () => void;
  onResolved: () => void;
}) {
  const [picked, setPicked] = useState(conflicts[0]?.candidate_id ?? "");
  const [actionState, setActionState] = useState<ActionState>({ type: null, status: "pending" });
  const [isProcessing, setIsProcessing] = useState(false);
  const existing = conflicts.find(c => c.candidate_id === picked)?.candidate ?? conflicts[0]?.candidate ?? null;

  // IF NO CONFLICTS FOUND (STALE STATE), ALLOW ACCEPTING AS IS
  if (!existing && conflicts.length === 0) {
     // AUTO-RESOLVE IF NO CANDIDATES? OR SHOW "ACCEPT"?
  }

  const rawDiff = useMemo(() => {
    if (!existing) return [];
    return diffLines(existing.raw_content ?? "", item.raw_content ?? "");
  }, [existing, item]);

  async function resolve(action: "save_new" | "link" | "merge_docs" | "cancel") {
    setIsProcessing(true);
    await fetch(`/api/items/${item.id}/resolve-conflict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, targetId: picked })
    });
    
    if (action === "link" || action === "merge_docs") {
      setActionState({ type: action, status: "completed" });
      setIsProcessing(false);
    } else {
      onResolved();
    }
  }

  async function confirmAndClose() {
    onResolved();
  }

  async function undoAction() {
    // RESET STATE
    setActionState({ type: null, status: "pending" });
  }

  const hasCompletedAction = actionState.type !== null && actionState.status === "completed";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-7xl bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl rounded-2xl border border-surface-200/50 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER (DYNAMIC) */}
        <div className="px-6 py-4 border-b border-surface-200/50 dark:border-white/10 flex items-center gap-3 shrink-0 bg-gradient-to-b from-surface-50/80 to-transparent dark:from-white/5">
          {hasCompletedAction ? (
            <>
              <div className="p-2 rounded-xl bg-green-500/10 dark:bg-green-500/20 animate-in zoom-in duration-300">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-surface-900 dark:text-white tracking-tight">
                  {actionState.type === "link" ? "Items Linked" : "Documents Merged"}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-0.5 font-medium">
                  Action completed successfully
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={undoAction}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-surface-500 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-white/5 transition-all text-sm"
                  data-tooltip="Undo action"
                >
                  <Undo2 className="w-4 h-4" />
                  Undo
                </button>
                <button 
                  onClick={confirmAndClose}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all"
                  data-tooltip="Confirm and close"
                >
                  <Check className="w-4 h-4" />
                  Done
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/20">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-surface-900 dark:text-white tracking-tight">
                  {conflicts.length > 0 ? "Conflict Detected" : "Stale Conflict Status"}
                </div>
                <div className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                  {conflicts.length > 0 
                    ? `Similar content found · Similarity ≥ ${(conflicts[0]?.similarity * 100).toFixed(0)}%`
                    : "Original conflicting item(s) may have been deleted."
                  }
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-white/5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-all"
                data-tooltip="Close without action"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* CONTROLS BAR */}
        <div className="px-6 py-4 border-b border-surface-200/50 dark:border-white/10 flex items-center gap-4 shrink-0 bg-surface-50/50 dark:bg-surface-950/30">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">
              Compare with
            </span>
            <select
              className="px-4 py-2.5 rounded-xl border border-surface-200 dark:border-white/10 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-all cursor-pointer hover:border-surface-300 dark:hover:border-white/20 disabled:opacity-50"
              value={picked}
              onChange={(e) => setPicked(e.target.value)}
              disabled={hasCompletedAction}
            >
              {conflicts.length > 0 ? conflicts.map(c => (
                <option key={c.candidate_id} value={c.candidate_id}>
                  {c.candidate.title || "Untitled"} · {(c.similarity * 100).toFixed(1)}% match
                </option>
              )) : (
                <option disabled>No candidates found</option>
              )}
            </select>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            {conflicts.length === 0 ? (
                 <button 
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-600/20 active:scale-[0.98] transition-all"
                  onClick={() => resolve("save_new")}
                >
                  <Check className="w-4 h-4" />
                  Accept As Is
                </button>
            ) : (
                <>
                {/* SAVE AS NEW */}
            <button 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => resolve("save_new")}
              disabled={hasCompletedAction || isProcessing}
              data-tooltip="Keep both items separately"
            >
              <Save className="w-4 h-4" />
              Save as New
            </button>

            {/* LINK BUTTON (WITH ANIMATION) */}
            <button 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all overflow-hidden relative
                ${actionState.type === "link" && actionState.status === "completed"
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                  : "bg-surface-100 hover:bg-surface-200 dark:bg-white/5 dark:hover:bg-white/10 text-surface-700 dark:text-surface-200"
                }
                ${isProcessing || (hasCompletedAction && actionState.type !== "link") ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={() => !hasCompletedAction && !isProcessing && resolve("link")}
              disabled={hasCompletedAction || isProcessing}
              data-tooltip={actionState.type === "link" ? "Linked successfully" : "Create reference link"}
            >
              {actionState.type === "link" && actionState.status === "completed" ? (
                <>
                  <Check className="w-4 h-4 animate-in zoom-in duration-200" />
                  <span className="animate-in slide-in-from-left-2 duration-200">Linked</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span>Link</span>
                </>
              )}
            </button>

            {/* MERGE BUTTON (WITH ANIMATION) */}
            <button 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all overflow-hidden relative
                ${actionState.type === "merge_docs" && actionState.status === "completed"
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                  : "bg-surface-100 hover:bg-surface-200 dark:bg-white/5 dark:hover:bg-white/10 text-surface-700 dark:text-surface-200"
                }
                ${isProcessing || (hasCompletedAction && actionState.type !== "merge_docs") ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={() => !hasCompletedAction && !isProcessing && resolve("merge_docs")}
              disabled={hasCompletedAction || isProcessing}
              data-tooltip={actionState.type === "merge_docs" ? "Merged successfully" : "Merge documentation only"}
            >
              {actionState.type === "merge_docs" && actionState.status === "completed" ? (
                <>
                  <Check className="w-4 h-4 animate-in zoom-in duration-200" />
                  <span className="animate-in slide-in-from-left-2 duration-200">Merged</span>
                </>
              ) : (
                <>
                  <GitMerge className="w-4 h-4" />
                  <span>Merge</span>
                </>
              )}
            </button>
            </>
            )}

            {/* CANCEL BUTTON */}
            <button 
              className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => resolve("cancel")}
              disabled={hasCompletedAction || isProcessing}
              data-tooltip="Discard new item"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* CONTENT PANELS */}
        <div className="grid grid-cols-2 flex-1 min-h-0 divide-x divide-surface-200/50 dark:divide-white/10">
          <Panel title="Existing Item" subtitle={existing?.title ?? "Untitled"} contentRaw={existing?.raw_content ?? ""} />
          
          {/* DIFF PANEL */}
          <div className="flex flex-col min-w-0">
            <div className="px-6 py-3 border-b border-surface-200/50 dark:border-white/10 bg-surface-50/50 dark:bg-surface-900/30">
              <div className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">
                Changes Preview
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-surface-50/30 dark:bg-surface-950/50">
              <pre className="p-6 font-mono text-xs whitespace-pre-wrap break-words text-surface-800 dark:text-surface-200 leading-relaxed">
                {rawDiff.map((part, idx) => (
                  <span
                    key={idx}
                    className={
                      part.added 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200 px-1 rounded" 
                      : part.removed 
                      ? "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200 line-through opacity-60 px-1 rounded" 
                      : ""
                    }
                  >
                    {part.value}
                  </span>
                ))}
              </pre>
            </div>
          </div>
        </div>

        {/* FOOTER (DYNAMIC) */}
        <div className="px-6 py-3 border-t border-surface-200/50 dark:border-white/10 bg-gradient-to-t from-surface-50/80 to-transparent dark:from-surface-800/30">
          {hasCompletedAction ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">
                  {actionState.type === "link" 
                    ? "Items have been linked. Click 'Done' to confirm or 'Undo' to revert."
                    : "Documents have been merged. Click 'Done' to confirm or 'Undo' to revert."
                  }
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
              <div className="w-1 h-1 rounded-full bg-brand-500" />
              <span className="font-medium">Tip:</span>
              <span>"Link" creates a reference while keeping both items immutable</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, contentRaw }: { title: string; subtitle: string; contentRaw: string }) {
  return (
    <div className="flex flex-col min-w-0">
      <div className="px-6 py-3 border-b border-surface-200/50 dark:border-white/10 bg-surface-50/50 dark:bg-surface-900/30">
        <div className="text-sm font-semibold text-surface-900 dark:text-white tracking-tight">
          {title}
        </div>
        <div className="text-xs text-surface-500 dark:text-surface-400 truncate mt-0.5">
          {subtitle}
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-white/50 dark:bg-surface-950/50">
        <pre className="p-6 text-xs font-mono whitespace-pre-wrap break-words text-surface-800 dark:text-surface-200 leading-relaxed">
{contentRaw}
        </pre>
      </div>
    </div>
  );
}
