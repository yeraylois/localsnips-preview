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
        <div className="flex items-center gap-2 mb-3 text-brand-600 dark:text-brand-400">
             <ImageIcon className="w-4 h-4" />
             <span 
                className="text-xs font-bold uppercase tracking-wider"
             >
                Quick Snippet Image
             </span>
             <button 
                onClick={() => setShowHelp(true)}
                className="ml-auto text-surface-400 hover:text-brand-600 transition-colors"
             >
                <HelpCircle className="w-4 h-4" />
             </button>
        </div>

        <div className="relative">
            <textarea
            className="w-full h-[80px] resize-none text-base md:text-sm font-mono bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-all placeholder:text-surface-400 dark:text-surface-100"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste code for instant image..."
            />
        </div>

        <div className="mt-3">
          <button
            className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 text-sm font-medium hover:bg-brand-600 hover:text-white hover:border-brand-600 dark:hover:bg-brand-500 dark:hover:text-white dark:hover:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-surface-600 dark:disabled:hover:bg-transparent dark:disabled:hover:text-surface-300 disabled:hover:border-surface-200 dark:disabled:hover:border-surface-700 transition-all flex items-center justify-center gap-2 group"
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

      {/* HELP MODAL - DYNAMIC WINDOW TINT */}
      {showHelp && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-900/60 dark:bg-black/70 backdrop-blur-md animate-fade-in p-4">
            <div className="bg-surface-50/80 dark:bg-surface-950/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden relative border border-surface-200/50 dark:border-white/10 animate-scale-in">
                <button 
                    onClick={() => setShowHelp(false)}
                    className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-brand-600 dark:text-brand-400 hover:bg-brand-500 hover:!text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
                
                <div className="pt-8 pb-6 px-8">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 text-brand-600 dark:text-brand-400">
                            <ImageIcon className="w-7 h-7" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-400 tracking-tight">Snippet Images</h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
                                Generate beautiful Carbon-style code screenshots ready for sharing.
                            </p>
                        </div>
                    </div>
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
            </div>
        </div>,
        document.body
      )}
    </>
  );
}
