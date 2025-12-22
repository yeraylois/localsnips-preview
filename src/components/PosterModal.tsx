/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : PosterModal.tsx                                *
 *   Purpose : SCIENTIFIC POSTER PDF GENERATOR                *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { X, Download, Printer, FileText, Edit3, Settings } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import { marked } from "marked";
import { Item } from "../lib/types";

interface PosterModalProps {
  open: boolean;
  onClose: () => void;
  item: Item;
}

/**
 * GENERATES A PDF POSTER FROM A SNIPPET.
 * RENDERS HTML TO CANVAS/IMAGE THEN EXPORTS TO PDF.
 * FEATURES CUSTOMIZABLE TITLE AND CONTENT EDITING BEFORE EXPORT.
 * - Parameter open: Visibility state
 * - Parameter onClose: Callback to close modal
 * - Parameter item: Item to generate poster for
 */
export default function PosterModal({ open, onClose, item }: PosterModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // EDITABLE STATE
  const [title, setTitle] = useState(item.title || item.original_filename || "Untitled Snippet");
  const [readme, setReadme] = useState(item.doc_markdown || "");
  const [code, setCode] = useState(item.raw_content || "");

  // RESET STATE WHEN ITEM CHANGES
  useEffect(() => {
    setTitle(item.title || item.original_filename || "Untitled Snippet");
    setReadme(item.doc_markdown || "");
    setCode(item.raw_content || "");
  }, [item]);

  // CLEAN MARKDOWN LOGIC FOR PREVIEW
  const readmeHtml = useMemo(() => {
    if (!readme) return "";
    let md = readme;
    md = md.replace(/##\s+Related\s*\n+(N\/A|None|-|)\s*(\n|$)/gi, "");
    md = md.replace(/##\s+Unknown\s*\n/gi, "");
    return marked.parse(md);
  }, [readme]);
  
  if (!open) return null;

  const downloadPdf = async () => {
    if (!ref.current) return;
    setIsGenerating(true);
    // TURN OFF EDITING BEFORE GENERATING
    setIsEditing(false);
    
    // WAIT FOR RENDER UPDATE
    await new Promise(r => setTimeout(r, 100));

    try {
      const scale = 3; // HIGHER RES FOR CLEAR TEXT
      const node = ref.current;
      
      const blob = await htmlToImage.toPng(node, { 
        quality: 1.0, 
        pixelRatio: scale,
        backgroundColor: '#ffffff'
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(blob);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // SCALE TO FIT IF TOO TALL? FOR A POSTER, WE WANT IT TO FIT ON ONE PAGE.
      // IF CONTENT OVERFLOWS, WE MIGHT JUST CROP OR SCALE DOWN.
      // LET'S SCALE DOWN TO FIT FIT HEIGHT IF NEEDED
      if (imgHeight > pdfHeight) {
          const scaledWidth = (imgProps.width * pdfHeight) / imgProps.height;
          // CENTER IT
          pdf.addImage(blob, 'PNG', (pdfWidth - scaledWidth) / 2, 0, scaledWidth, pdfHeight);
      } else {
          pdf.addImage(blob, 'PNG', 0, 0, pdfWidth, imgHeight);
      }
      
      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_poster.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur-md animate-fade-in p-4 overflow-auto transition-colors duration-300">
      <div className="bg-surface-50 dark:bg-[#1e1e1e] rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col h-[95vh] border border-white/20 dark:border-white/10 overflow-hidden transition-colors duration-300">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-surface-900 dark:text-white">
                <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <FileText className="w-5 h-5" />
                </div>
                <h2 className="font-semibold text-lg tracking-tight">Scientific Poster</h2>
            </div>
            <div className="h-6 w-px bg-surface-200 dark:bg-white/10"></div>
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-200/50 dark:bg-surface-800 rounded-lg text-xs font-medium text-surface-600 dark:text-surface-300 border border-black/5 dark:border-white/5">
                 <Settings className="w-3.5 h-3.5" />
                 <span>A4 Portrait Layout</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isEditing 
                        ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" 
                        : "bg-surface-200/60 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-700"
                }`}
             >
                <Edit3 className="w-4 h-4" />
                {isEditing ? "Done Editing" : "Edit Content"}
             </button>

            <button
               onClick={downloadPdf}
               disabled={isGenerating}
               className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? <span className="animate-spin">⏳</span> : <Download className="w-4 h-4" />}
              Export PDF
            </button>
            <div className="w-px h-8 bg-surface-200 dark:bg-white/10 mx-1"></div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-200/60 dark:hover:bg-white/10 rounded-lg transition-colors text-surface-400 hover:text-surface-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY - SCROLLABLE PREVIEW */}
        <div className="flex-1 overflow-auto p-12 bg-surface-100/50 dark:bg-[#151516] flex justify-center relative">
            {/* THE POSTER NODE */}
            <div 
                ref={ref}
                className="w-[210mm] min-h-[297mm] bg-white text-black p-[15mm] flex flex-col shadow-2xl shrink-0 transition-all origin-top scale-95 relative overflow-hidden rounded-sm ring-1 ring-black/5"
                style={{ 
                    fontFamily: "'Times New Roman', Times, serif",
                    backgroundImage: "linear-gradient(to bottom, transparent 296mm, #ef4444 297mm, transparent 298mm)", // VISUAL PAGE BREAK GUIDE
                    backgroundSize: "100% 297mm"
                }} 
            >
                {/* POSTER CONTENT */}
                <header className="border-b-4 border-black pb-6 mb-8 flex justify-between items-end">
                    <div className="flex-1 pr-8">
                        {isEditing ? (
                            <input 
                                className="w-full text-2xl font-bold uppercase tracking-wide border-b border-brand-500 outline-none font-serif bg-brand-50/50 p-1"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        ) : (
                            <h1 className="text-2xl font-bold mb-2 uppercase tracking-wide leading-tight break-words">
                                {title}
                            </h1>
                        )}
                        <p className="text-xl text-gray-600 italic mt-2">
                             Automated Documentation via LocalSnips
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                         <div className="text-2xl font-bold text-brand-900">LocalSnips</div>
                         <div className="text-sm text-gray-500">Research Edition</div>
                    </div>
                </header>

                <div className="flex-1 flex flex-col gap-6">
                    {/* ABSTRACT */}
                    <div className="flex flex-col shrink-0">
                        <h3 className="text-sm font-bold uppercase border-b-2 border-black mb-3 pb-1">Abstract</h3>
                        {isEditing ? (
                            <textarea
                                className="w-full min-h-[120px] border border-brand-500 outline-none p-3 text-xs font-sans bg-brand-50/50 resize-y rounded-md"
                                value={readme}
                                onChange={e => setReadme(e.target.value)}
                                placeholder="Edit markdown abstract..."
                            />
                        ) : (
                            <div 
                                className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:uppercase prose-p:text-justify prose-p:leading-tight text-[11px] leading-snug text-gray-800"
                                dangerouslySetInnerHTML={{ __html: readmeHtml as string }} 
                            />
                        )}
                    </div>

                    {/* IMPLEMENTATION */}
                    <div className="flex flex-col">
                             <div className="flex items-center justify-between border-b-2 border-black mb-4 pb-1">
                                 <h3 className="text-sm font-bold uppercase">Implementation</h3>
                             </div>
                             
                             {/* CARBON STYLE WINDOW - LIGHT THEME FOR PRINT */}
                             <div className="flex flex-col rounded-lg overflow-hidden border border-gray-300 shadow-sm bg-gray-50 min-h-[100px] ring-1 ring-black/5">
                                 
                                 {/* WINDOW CHROME */}
                                 <div className="bg-white px-4 py-2 flex items-center gap-2 border-b border-gray-200 shrink-0">
                                     <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-black/10"></div>
                                     <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-black/10"></div>
                                     <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-black/10"></div>
                                     <div className="ml-4 text-[10px] items-center font-mono text-gray-500 opacity-80 flex gap-2">
                                         <span>snippet_source.sh</span>
                                     </div>
                                 </div>

                                 {/* CODE CONTENT */}
                                 <div className="relative bg-white p-0">
                                     {isEditing ? (
                                        <textarea 
                                            className="w-full bg-white text-gray-800 font-mono text-xs p-4 outline-none resize-none leading-relaxed min-h-[250px]"
                                            value={code}
                                            onChange={e => setCode(e.target.value)}
                                            spellCheck={false}
                                            style={{ height: `${Math.max(250, code.split('\n').length * 20)}px` }}
                                        />
                                     ) : (
                                        <div className="w-full p-4 overflow-hidden">
                                            <pre className="font-mono text-[10px] leading-relaxed text-gray-800 whitespace-pre-wrap break-all">
                                                {code}
                                            </pre>
                                        </div>
                                     )}
                                 </div>
                             </div>
                    </div>
                </div>

                {/* POSTER FOOTER */}
                <footer className="mt-8 pt-6 border-t border-gray-300 flex justify-between items-center text-xs text-gray-500">
                     <div className="flex items-center gap-4">
                         <span>© {new Date().getFullYear()} Yeray Lois Sánchez</span>
                         <span>•</span>
                         <span>Generated by LocalSnips AI</span>
                     </div>
                     <div className="flex gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600 border border-gray-200">CC</div>
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600 border border-gray-200">BY</div>
                     </div>
                </footer>

            </div>
        </div>
      </div>
    </div>
  );
}
