/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : ImportBox.tsx                                  *
 *   Purpose : QUICK IMPORT & DRAG-DROP INGESTION AREA        *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, X, HelpCircle, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import { useTheme } from "./ThemeProvider";

/**
 * COMPONENT FOR PASTING TEXT OR DRAGGING FILES TOG CREATE ITEMS.
 * HANDLES FILE UPLOAD, TEXT INPUT, AND DUPLICATE DETECTION FEEDBACK.
 * - Parameter onCreated: Callback when an item is successfully created
 */
export default function ImportBox({ onCreated }: { onCreated: (id: string) => void }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [duplicateToast, setDuplicateToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { theme } = useTheme();



  const create = useCallback(async () => {
    const content = text.trim();
    if (!content) return;

    setBusy(true);
    try {
      const r = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, source_type: "paste" })
      });
      const d = await r.json();
      if (d.duplicateOf) {
        // SHOW NOTIFICATION FOR DUPLICATE
        setDuplicateToast("This note already exists in your library");
        onCreated(d.duplicateOf);
        setTimeout(() => setDuplicateToast(null), 3000);
      } else {
        onCreated(d.id);
      }
      setText("");
    } finally {
      setBusy(false);
    }
  }, [text, onCreated]);

  async function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFile(file);
  }

  async function handleFile(file: File) {
     const fd = new FormData();
     fd.append("file", file);

     setBusy(true);
     try {
       const r = await fetch("/api/items/import", { method: "POST", body: fd });
       const d = await r.json();
       onCreated(d.duplicateOf ?? d.id);
     } finally {
       setBusy(false);
     }
  }

  return (
    <>
      <div
        className="rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-4 shadow-sm transition-shadow hover:shadow-md"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="flex items-center justify-between mb-3">
             <span 
               className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider"
               style={{ color: theme === 'custom' ? 'var(--title-color)' : undefined }}
             >
               Quick Add
             </span>
             <button 
                onClick={() => setShowHelp(true)}
                className="text-surface-400 hover:text-brand-600 transition-colors"
                title="Import Help"
             >
                 <HelpCircle className="w-4 h-4" />
             </button>
        </div>

        <div className="relative">
            <textarea
            className="w-full h-[120px] resize-none text-sm font-mono bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-all placeholder:text-surface-400 dark:text-surface-100"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste code snippet or notes here..."
            disabled={busy}
            />
            {busy && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                </div>
            )}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            className="flex-1 px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 disabled:opacity-50 transition-colors shadow-sm"
            onClick={create}
            disabled={busy || !text.trim()}
          >
            Save Note
          </button>

          <button
            className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 disabled:opacity-50 transition-colors flex items-center gap-2"
            onClick={() => {
                if (fileRef.current) {
                    fileRef.current.value = ""; 
                    fileRef.current.click();
                }
            }}
            disabled={busy}
          >
            <UploadCloud className="w-4 h-4" />
            Import File
          </button>
          
          <input
            ref={fileRef}
            type="file"
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await handleFile(file);
            }}
          />
        </div>
      </div>

      {/* DUPLICATE TOAST */}
      {duplicateToast && createPortal(
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
          <div className="px-4 py-3 rounded-xl bg-amber-500/90 text-white shadow-lg backdrop-blur-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{duplicateToast}</span>
          </div>
        </div>,
        document.body
      )}
      {showHelp && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white/80 dark:bg-[#121212]/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden relative border border-surface-200/50 dark:border-white/10 animate-scale-in">
                <button 
                    onClick={() => setShowHelp(false)}
                    className="absolute top-3.5 right-3.5 p-1 rounded-full bg-surface-100 dark:bg-white/10 text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
                
                <div className="pt-8 pb-4 px-8 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-surface-800 flex items-center justify-center text-brand-600 dark:text-surface-100 shadow-sm mb-5 border border-transparent dark:border-white/10">
                        <FileText className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-50 tracking-tight">Importing Files</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 leading-relaxed">
                        Drag and drop files to instantly load content. <br/>Original files are never modified.
                    </p>
                </div>
                
                <div className="px-6 pb-6 space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                        <div className="p-3.5 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-surface-50/50 dark:bg-surface-800/30 flex items-start gap-3">
                             <div className="mt-0.5 p-1 bg-surface-200 dark:bg-surface-700 rounded-md">
                                 <FileText className="w-3.5 h-3.5 text-surface-500" />
                             </div>
                             <div>
                                <span className="block text-sm font-medium text-surface-900 dark:text-surface-100">Code Files</span>
                                <span className="text-xs text-surface-500 dark:text-surface-400 leading-snug">.js, .py, .swift, .go, .rs, .md, .json</span>
                             </div>
                        </div>
                        <div className="p-3.5 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-surface-50/50 dark:bg-surface-800/30 flex items-start gap-3">
                             <div className="mt-0.5 p-1 bg-surface-200 dark:bg-surface-700 rounded-md">
                                 <FileText className="w-3.5 h-3.5 text-surface-500" />
                             </div>
                             <div>
                                <span className="block text-sm font-medium text-surface-900 dark:text-surface-100">Documents</span>
                                <span className="text-xs text-surface-500 dark:text-surface-400 leading-snug">.txt, .csv, .log</span>
                             </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 bg-surface-50/50 dark:bg-surface-950/30 border-t border-surface-100 dark:border-surface-800 flex justify-center">
                    <button 
                        onClick={() => setShowHelp(false)}
                        className="w-full py-2.5 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 rounded-xl text-sm font-semibold hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors shadow-sm"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>,
        document.body
      )}
    </>
  );
}
