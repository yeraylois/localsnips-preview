/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : SnapshotModal.tsx                              *
 *   Purpose : CODE SNAPSHOT IMAGE GENERATOR                  *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Download, ImageIcon, Monitor, Edit3, RefreshCw } from "lucide-react";
import { toPng } from "html-to-image";
import { Item } from "../lib/types";

// NOTE: ENSURE 'HTML-TO-IMAGE' IS INSTALLED OR USE AN ALTERNATIVE.
const BACKGROUNDS = [
  { name: "Candy", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Midnight", value: "linear-gradient(135deg, #0f172a 0%, #334155 100%)" },
  { name: "Sunset", value: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
  { name: "Ocean", value: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" },
  { name: "Emerald", value: "linear-gradient(135deg, #10b981 0%, #047857 100%)" },
  { name: "Slate", value: "#e2e8f0" }
];

/**
 * GENERATES SHAREABLE IMAGES OF CODE SNIPPETS.
 * OFFERS CUSTOMIZABLE GRADIENT BACKGROUNDS AND WINDOW STYLES.
 * - Parameter item: Item to snapshot
 * - Parameter onClose: Callback to close modal
 */
export default function SnapshotModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [bg, setBg] = useState(BACKGROUNDS[0]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(item.original_filename || item.title || "untitled-snippet");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const download = async () => {
    if (!ref.current) return;
    setLoading(true);
    try {
        const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `snippet-${item.id.slice(0, 6)}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error("Failed to generate image", err);
        alert("Could not generate image. Ensure html-to-image is installed.");
    } finally {
        setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur-md animate-fade-in p-8 transition-colors duration-300">
      <div className="relative w-full max-w-5xl flex flex-col h-[90vh] bg-surface-50 dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden transition-colors duration-300">
         
         {/* HEADER */}
         <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl shrink-0">
             <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-surface-900 dark:text-white">
                    <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                        <ImageIcon className="w-5 h-5" /> 
                    </div>
                    <h3 className="font-semibold text-lg tracking-tight">Snapshot Mode</h3>
                 </div>
                 <div className="h-6 w-px bg-surface-200 dark:bg-white/10"></div>
                 <div className="flex gap-2">
                     {BACKGROUNDS.map(b => (
                         <div key={b.name} className="relative group p-1">
                            <button
                                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 relative overflow-hidden ${
                                    bg.name === b.name 
                                    ? "border-surface-900 dark:border-white scale-110 shadow-md ring-2 ring-white/20 dark:ring-black/20" 
                                    : "border-transparent opacity-80 hover:opacity-100 hover:scale-110 hover:shadow-sm"
                                }`}
                                onClick={() => setBg(b)}
                                title={b.name}
                            >
                                <div className="absolute inset-0" style={{ background: b.value }} />
                            </button>
                         </div>
                     ))}
                 </div>
             </div>
             <div className="flex gap-3">
                 <button 
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-200/60 dark:hover:bg-white/10 transition-colors"
                 >
                     Cancel
                 </button>
                 <button 
                    onClick={download}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                     {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                     <span>Save Image</span>
                 </button>
             </div>
         </div>

         {/* PREVIEW AREA */}
         <div className="flex-1 overflow-auto flex items-center justify-center p-12 bg-surface-100/50 dark:bg-[#151516] relative">
             {/* THE CAPTURE NODE */}
             <div 
                ref={ref}
                className="p-16 min-w-[680px] shadow-2xl transition-all duration-500 rounded-3xl"
                style={{ background: bg.value }}
             >
                 {/* WINDOW CHROME */}
                 <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-black/5 dark:border-white/10">
                     <div className="bg-surface-50 dark:bg-[#2d2d2d] px-4 py-3.5 flex items-center gap-3 border-b border-surface-100 dark:border-white/5">
                         <div className="flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/5"></div>
                             <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/5"></div>
                             <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/5"></div>
                         </div>
                         <div className="flex-1 text-center flex justify-center group relative -ml-14">
                             <input 
                                className="text-xs font-mono text-surface-500 dark:text-gray-400 bg-transparent text-center outline-none border-b border-transparent focus:border-surface-300 dark:focus:border-gray-500 focus:text-surface-800 dark:focus:text-gray-200 transition-colors w-48 placeholder:text-surface-300"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                spellCheck={false}
                             />
                             <Edit3 className="w-3 h-3 text-surface-400 absolute -right-5 top-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                     </div>
                     
                     <div className="p-8 bg-white dark:bg-[#1e1e1e]">
                         <pre className="font-mono text-[13px] leading-relaxed text-surface-800 dark:text-gray-300 whitespace-pre-wrap break-words">
                             {item.raw_content}
                         </pre>
                     </div>
                     
                     <div className="bg-surface-50 dark:bg-[#2d2d2d] px-5 py-3 flex justify-between items-center border-t border-surface-100 dark:border-white/5">
                         <div className="flex items-center gap-2.5">
                             <div className="w-6 h-6 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center">
                                 <Monitor className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                             </div>
                             <span className="text-[10px] uppercase font-bold text-surface-400 dark:text-gray-500 tracking-wider">LocalSnips</span>
                         </div>
                         <div className="text-[10px] font-medium text-surface-400 dark:text-gray-600">
                             {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                         </div>
                     </div>
                 </div>
             </div>
         </div>
      </div>
    </div>,
    document.body
  );
}
