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
import { AlertTriangle, GitMerge, Link2, Save, X, Check, Undo2, CheckCircle, Trash2, Sparkles, Loader2, PanelRightClose, PanelRightOpen } from "lucide-react";

type Conflict = { candidate_id: string; similarity: number; candidate: Item };

type ActionState = {
  type: "link" | "merge_docs" | null;
  status: "pending" | "completed";
};

/**
 * MODAL FOR COMPARING DUPLICATE/CONFLICTING ITEMS.
 * SHOWS SIDE-BY-SIDE DIFF AND RESOLUTION ACTIONS (SAVE AS NEW, LINK, MERGE).
 * @param item THE NEW ITEM CAUSING THE CONFLICT
 * @param conflicts LIST OF EXISTING SIMILAR ITEMS
 * @param onClose CALLBACK TO CLOSE WITHOUT ACTION
 * @param onResolved CALLBACK WHEN A RESOLUTION IS APPLIED
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
  const [isDiffCollapsed, setIsDiffCollapsed] = useState(false);
  
  // EDITABLE CONTENT STATE
  const [editContent, setEditContent] = useState("");
  const existing = conflicts.find(c => c.candidate_id === picked)?.candidate ?? conflicts[0]?.candidate ?? null;

  useEffect(() => {
    if (existing) {
        setEditContent(existing.raw_content ?? "");
    }
  }, [existing]);

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
    
    // IF MERGING, SEND CUSTOM CONTENT
    const payload: any = { action, targetId: picked };
    if (action === "merge_docs") {
        payload.customContent = editContent;
    }

    // SIMULATED API CALL
    await new Promise(r => setTimeout(r, 800));
    
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
    setEditContent(existing?.raw_content ?? "");
  }

  const hasCompletedAction = actionState.type !== null && actionState.status === "completed";

  return (
    <div className="fixed inset-0 z-[70] bg-surface-50/40 dark:bg-surface-950/40 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-7xl bg-surface-50 dark:bg-surface-950 backdrop-blur-xl rounded-2xl border border-surface-200/50 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER (DYNAMIC) */}
        <div className="px-6 py-4 border-b border-surface-200/50 dark:border-white/10 flex items-center gap-3 shrink-0 bg-surface-50 dark:bg-surface-950">
          {hasCompletedAction ? (
            <>
              <div className="p-2 rounded-xl bg-green-500/10 dark:bg-green-500/20 animate-in zoom-in duration-300">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="text-base font-bold text-green-600 dark:text-green-400 tracking-tight uppercase">
                  {actionState.type === "link" ? "Items Linked" : "Documents Merged"}
                </div>
                <div className="text-xs text-green-600/80 dark:text-green-400/80 mt-0.5 font-medium">
                  {actionState.type === "merge_docs" ? "Merged content saved to item" : "Action completed successfully"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={undoAction}
                  className="tooltip-surface flex items-center gap-2 px-3 py-2 rounded-lg text-surface-500 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-white/5 transition-all text-sm"
                  data-tooltip="Undo action"
                >
                  <Undo2 className="w-4 h-4" />
                  Undo
                </button>
                <button 
                  onClick={confirmAndClose}
                  className="tooltip-surface flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all"
                  data-tooltip="Confirm and close"
                >
                  <Check className="w-4 h-4" />
                  Done
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 rounded-xl bg-brand-500/10 dark:bg-brand-500/20">
                <AlertTriangle className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div className="flex-1">
                <div className="text-base font-bold text-brand-600 dark:text-brand-400 tracking-widest uppercase">
                  {conflicts.length > 0 ? "Conflict Detected" : "Stale Conflict Status"}
                </div>
                <div className="text-xs text-brand-600/70 dark:text-brand-400/70 mt-0.5 font-medium">
                  {conflicts.length > 0 
                    ? `Similar content found · Similarity ≥ ${(conflicts[0]?.similarity * 100).toFixed(0)}%`
                    : "Original conflicting item(s) may have been deleted."
                  }
                </div>
              </div>
              <button 
                onClick={onClose}
                className="tooltip-surface p-2 rounded-lg text-brand-600 dark:text-brand-400 hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white dark:hover:text-white transition-all"
                data-tooltip="Close without action"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* CONTROLS BAR */}
        <div className="px-4 sm:px-6 py-4 border-b border-surface-200/50 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 bg-surface-50/50 dark:bg-surface-950/30">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1">
            <span className="text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">
              Compare with
            </span>
            {/* COMPARE WITH SELECTOR - APPLE STYLE */}
            <div className="relative group">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-600 dark:text-brand-400 group-hover:text-white transition-colors">
                  <GitMerge className="w-4 h-4" />
               </div>
               <select
                 className="w-full sm:w-auto pl-10 pr-10 py-2.5 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-100 dark:bg-white/5 text-sm font-medium text-brand-600 dark:text-brand-400 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-all cursor-pointer hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white dark:hover:text-white hover:border-transparent appearance-none shadow-sm shadow-brand-500/5"
                 value={picked}
                 onChange={(e) => setPicked(e.target.value)}
                 disabled={hasCompletedAction}
               >
                 {conflicts.length > 0 ? conflicts.map(c => (
                   <option key={c.candidate_id} value={c.candidate_id} className="text-surface-900 dark:text-white bg-white dark:bg-surface-900">
                     {c.candidate.title || "Untitled"} · {(c.similarity * 100).toFixed(1)}% match
                   </option>
                 )) : (
                   <option disabled className="text-surface-500">No candidates found</option>
                 )}
               </select>
               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-600 dark:text-brand-400 group-hover:text-white transition-colors">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
               </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            {conflicts.length === 0 ? (
                 <button 
                  className="col-span-2 sm:col-span-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-600/20 active:scale-[0.98] transition-all"
                  onClick={() => resolve("save_new")}
                >
                  <Check className="w-4 h-4" />
                  Accept As Is
                </button>
            ) : (
                <>
                {/* SAVE AS NEW */}
            <button 
              className="tooltip-surface flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-white/5 hover:!bg-brand-600 dark:hover:!bg-brand-500 text-brand-600 dark:text-brand-400 hover:!text-white dark:hover:!text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              onClick={() => resolve("save_new")}
              disabled={hasCompletedAction || isProcessing}
              data-tooltip="Keep both items separately"
            >
              <Save className="w-4 h-4" />
              <span className="truncate">Save New</span>
            </button>

            {/* LINK BUTTON (WITH ANIMATION) */}
            <button 
              className={`tooltip-surface flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all overflow-hidden relative
                ${actionState.type === "link" && actionState.status === "completed"
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                  : "bg-surface-100 dark:bg-white/5 hover:!bg-brand-600 dark:hover:!bg-brand-500 text-brand-600 dark:text-brand-400 hover:!text-white"
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
              className={`tooltip-surface flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all overflow-hidden relative
                ${actionState.type === "merge_docs" && actionState.status === "completed"
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                  : "bg-surface-100 dark:bg-white/5 hover:!bg-brand-600 dark:hover:!bg-brand-500 text-brand-600 dark:text-brand-400 hover:!text-white"
                }
                ${isProcessing || (hasCompletedAction && actionState.type !== "merge_docs") ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={() => !hasCompletedAction && !isProcessing && resolve("merge_docs")}
              disabled={hasCompletedAction || isProcessing}
              data-tooltip={actionState.type === "merge_docs" ? "Merged successfully" : "Merge custom content"}
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
            {/* AI SMART RESOLVE BUTTON */}
            <button 
              className={`tooltip-surface flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all relative overflow-hidden group
                bg-surface-100 dark:bg-white/5 hover:!bg-brand-600 dark:hover:!bg-brand-500 text-brand-600 dark:text-brand-400 hover:!text-white dark:hover:!text-white
                ${isProcessing || hasCompletedAction ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={async () => {
                if (hasCompletedAction || isProcessing) return;
                setIsProcessing(true);
                // SIMULATE AI DELAY
                await new Promise(r => setTimeout(r, 1500));
                
                // SIMULATE MERGE
                const merged = `# Merged Document (AI-Decided)\n\n${existing?.raw_content ?? ""}\n\n## Additional Notes\n\n${item.raw_content ?? ""}\n\n> Merged by AI simulation.`;
                setEditContent(merged);
                setIsDiffCollapsed(true); // Auto-collapse on success
                setIsProcessing(false);
              }}
              disabled={hasCompletedAction || isProcessing}
              data-tooltip="Let AI merge contents intelligently"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span className="truncate">{isProcessing ? "Thinking..." : "Smart Resolve"}</span>
            </button>
            </>
            )}

            {/* DISCARD BUTTON */}
            <button 
              className="tooltip-surface flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white dark:hover:text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => resolve("cancel")}
              disabled={hasCompletedAction || isProcessing}
              data-tooltip="Discard new item"
            >
              <Trash2 className="w-4 h-4" />
              Discard
            </button>
          </div>
        </div>

        {/* CONTENT PANELS (FLEX) */}
        <div className="flex flex-1 min-h-[500px] divide-x divide-surface-200/50 dark:divide-white/10">
          <EditablePanel 
            title={hasCompletedAction ? "Result Content" : "Resolution Editor"} 
            subtitle={hasCompletedAction ? "Use 'Undo' to edit again" : "Edit content before merging"} 
            content={
              actionState.type === "link" && actionState.status === "completed"
                ? editContent + `\n\n---\nReference Linked:\n[[${item.title}]]`
                : editContent
            }
            onContentChange={setEditContent}
            readOnly={hasCompletedAction}
            className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
          />
          
          {/* DIFF PANEL */}
          <div className={`flex flex-col min-w-0 min-h-0 bg-surface-100/50 dark:bg-surface-900/50 transition-all duration-300 ease-in-out ${isDiffCollapsed ? 'w-12 border-l border-surface-200/50 dark:border-white/10' : 'w-[50%]'}`}>
            <div className={`px-4 py-3 border-b border-surface-200/50 dark:border-white/10 bg-surface-50/50 dark:bg-surface-900/30 flex items-center ${isDiffCollapsed ? 'justify-center' : 'justify-between'}`}>
              {!isDiffCollapsed && (
                <div className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">
                  Changes Preview
                </div>
              )}
              <button 
                onClick={() => setIsDiffCollapsed(!isDiffCollapsed)}
                className="p-1 rounded-lg hover:bg-surface-200 dark:hover:bg-white/10 text-surface-500 transition-colors tooltip-surface"
                data-tooltip={isDiffCollapsed ? "Expand preview" : "Collapse preview"}
              >
                {isDiffCollapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden relative group">
              {isDiffCollapsed ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span 
                      className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider whitespace-nowrap origin-center"
                      style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    >
                        Changes Preview
                    </span>
                </div>
              ) : (
                <div className="h-full overflow-auto w-full">
                  <div className="min-w-[350px] p-6">
                    <pre className="font-mono text-xs whitespace-pre-wrap break-words text-surface-800 dark:text-surface-200 leading-relaxed">
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
              )}
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
                    : "Documents have been merged with your edits. Click 'Done' to confirm."
                  }
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full gap-2 text-xs text-surface-500 dark:text-surface-400">
              <div className="w-1 h-1 rounded-full bg-brand-500" />
              <span className="font-medium">Tip:</span>
              <span>Edit content in the left panel, then click "Merge" to save the combination.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditablePanel({ 
  title, 
  subtitle, 
  content, 
  onContentChange, 
  readOnly,
  className
}: { 
  title: string; 
  subtitle: string; 
  content: string; 
  onContentChange: (val: string) => void;
  readOnly: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col min-w-0 min-h-0 bg-surface-100/50 dark:bg-surface-900/50 ${className}`}>
      <div className="px-6 py-3 border-b border-surface-200/50 dark:border-white/10 bg-surface-50/50 dark:bg-surface-900/30 flex items-center justify-between">
        <div>
           <div className="text-sm font-semibold text-surface-900 dark:text-white tracking-tight flex items-center gap-2">
             {title}
             {!readOnly && <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider">Editable</span>}
           </div>
           <div className="text-xs text-surface-500 dark:text-surface-400 truncate mt-0.5">
             {subtitle}
           </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative group">
        <textarea 
          className="w-full h-full p-6 text-xs font-mono whitespace-pre-wrap break-words text-surface-800 dark:text-surface-200 leading-relaxed bg-transparent outline-none resize-none focus:bg-surface-50/50 dark:focus:bg-white/5 transition-colors"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          placeholder="Start editing to resolve conflict..."
        />
        {!readOnly && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="px-2 py-1 text-surface-500 dark:text-surface-400 text-[10px] font-medium">
                    Type to edit
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
