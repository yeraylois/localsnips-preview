/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : QuickImageBox.tsx                              *
 *   Purpose : QUICK CODE-TO-IMAGE GENERATION WIDGET          *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Image as ImageIcon, Loader2, HelpCircle, X } from "lucide-react";
import SnapshotModal from "./SnapshotModal";
import { Item } from "../lib/types";
import { useTheme } from "./ThemeProvider";

/**
 * DASHBOARD WIDGET FOR INSTANT CODE IMAGE GENERATION.
 * ALLOWS PASTING CODE AND OPENING SNAPSHOT MODAL WITHOUT CREATING AN ITEM.
 */
export default function QuickImageBox() {
  const [text, setText] = useState("");
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { theme } = useTheme();

  // TEMPORARY ITEM MOCK FOR SNAPSHOT PREVIEW
  const fakeItem: Item = {
      id: "quick-" + Date.now(),
      created_at: new Date(),
      updated_at: new Date(),
      source_type: "paste",
      raw_content: text,
      raw_sha256: "temp",
      kind: "snippet",
      status: "processed",
      no_ai: true,
      raw_content_lines: text.split('\n').length,
  } as any; 

  return (
    <>
      <div className="rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-4 shadow-sm transition-shadow hover:shadow-md mt-4">
        <div className="flex items-center gap-2 mb-3 text-surface-500 dark:text-surface-400">
             <ImageIcon className="w-4 h-4" />
             <span 
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: theme === 'custom' ? 'var(--title-color)' : undefined }}
             >
                Quick Snippet Image
             </span>
             <button 
                onClick={() => setShowHelp(true)}
                className="ml-auto p-1 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
             >
                <HelpCircle className="w-3.5 h-3.5 text-surface-400 cursor-help" />
             </button>
        </div>

        <div className="relative">
            <textarea
            className="w-full h-[80px] resize-none text-sm font-mono bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-all placeholder:text-surface-400 dark:text-surface-100"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste code for instant image..."
            />
        </div>

        <div className="mt-3">
          <button
            className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            onClick={() => setShowSnapshot(true)}
            disabled={!text.trim()}
          >
            <ImageIcon className="w-4 h-4" />
            Generate Image
          </button>
        </div>
      </div>

      {showSnapshot && (
        <SnapshotModal 
            item={fakeItem} 
            onClose={() => setShowSnapshot(false)} 
        />
      )}

      {/* HELP MODAL - SAME PATTERN AS IMPORTBOX */}
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
                        <ImageIcon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-50 tracking-tight">Snippet Images</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 leading-relaxed">
                        Generate beautiful Carbon-style code screenshots ready for sharing.
                    </p>
                </div>
                
                <div className="px-6 pb-6">
                    {/* PREVIEW EXAMPLE */}
                    <div className="text-[10px] font-medium text-surface-500 dark:text-surface-400 mb-2 text-center uppercase tracking-wider">Preview</div>
                    <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl p-4 shadow-lg">
                        <div className="bg-surface-900 rounded-lg p-3 shadow-inner">
                            <div className="flex gap-1.5 mb-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            <pre className="text-[10px] font-mono text-surface-300 leading-relaxed"><span className="text-purple-400">const</span> <span className="text-blue-400">greet</span> = () =&gt; {"{"}
  <span className="text-yellow-400">console</span>.<span className="text-green-400">log</span>(<span className="text-orange-300">"Hello!"</span>);
{"}"}</pre>
                        </div>
                    </div>
                    <p className="text-[10px] text-surface-400 mt-3 text-center">Choose from multiple gradient backgrounds</p>
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
