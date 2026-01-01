/*************************************************************
 *   Project : LocalSnips (Preview)                           *
 *   File    : SnapshotModal.tsx                              *
 *   Purpose : APPLE-STYLE CODE IMAGE GENERATOR               *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Download, ImageIcon, Monitor, Edit3, RefreshCw, ZoomIn, ZoomOut, RotateCcw, LayoutTemplate, Palette, Type, Check, Wand2, Minus, Maximize2, Square, Keyboard, Settings2, AppWindow, FileX } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { Item } from "../lib/types";
import AlertModal from "./AlertModal";

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

const BACKGROUNDS = [
  { id: "candy", name: "Candy", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { id: "midnight", name: "Midnight", value: "linear-gradient(135deg, #0f172a 0%, #334155 100%)" },
  { id: "sunset", name: "Sunset", value: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
  { id: "ocean", name: "Ocean", value: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" },
  { id: "emerald", name: "Emerald", value: "linear-gradient(135deg, #10b981 0%, #047857 100%)" },
  { id: "slate", name: "Slate", value: "#e2e8f0" },
  { id: "glass", name: "Glass", value: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)" },
  { id: "black", name: "Pitch", value: "#121212" },
  { id: "peach", name: "Peach", value: "linear-gradient(135deg, #FFC371 0%, #FF5F6D 100%)" },
  { id: "lavender", name: "Lavender", value: "linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)" },
  { id: "mint", name: "Mint", value: "linear-gradient(135deg, #5EE7DF 0%, #B490CA 100%)" },
];

const ACCENT_COLORS = [
    { id: 'blue', value: '#2563eb', label: 'Blue' },
    { id: 'purple', value: '#7c3aed', label: 'Purple' },
    { id: 'green', value: '#059669', label: 'Green' },
    { id: 'orange', value: '#ea580c', label: 'Orange' },
    { id: 'rose', value: '#e11d48', label: 'Rose' },
    { id: 'slate', value: '#334155', label: 'Slate' },
    { id: 'lime', value: '#4ade80', label: 'Terminal' },
    { id: 'black', value: '#000000', label: 'Black' },
    { id: 'white', value: '#ffffff', label: 'White' },
    { id: 'gray', value: '#8E8E93', label: 'Apple Gray' },
];

const WINDOW_STYLES = [
    { id: 'macos', label: 'macOS', icon: '●●●' },
    { id: 'windows-xp', label: 'Win XP', icon: 'XP' },
    { id: 'windows-7', label: 'Win 7', icon: '7' },
    { id: 'windows-10', label: 'Win 10', icon: '10' },
    { id: 'linux', label: 'Linux', icon: '🐧' },
    { id: 'custom', label: 'Custom', icon: '✨' },
];

const FONTS = [
    { id: 'mono', label: 'Mono', family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
    { id: 'jetbrains', label: 'Tech', family: '"JetBrains Mono", "Fira Code", monospace' },
    { id: 'clean', label: 'Clean', family: 'Inter, system-ui, sans-serif' },
];

interface SnapshotModalProps {
    item: Item;
    onClose: () => void;
}

export default function SnapshotModal({ item, onClose }: SnapshotModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  
  // CUSTOMIZATION STATE
  const [bg, setBg] = useState(BACKGROUNDS[0]);
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);
  const [padding, setPadding] = useState('4rem');
  const [windowStyle, setWindowStyle] = useState('macos');
  const [darkMode, setDarkMode] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [title, setTitle] = useState(item.original_filename || item.title || "untitled-snippet");
  const [zoomLevel, setZoomLevel] = useState(0.85);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // ALERT STATE
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    isDestructive?: boolean;
    Icon?: React.ElementType;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });
  
  // CUSTOM MODE STATE
  const [customFont, setCustomFont] = useState(FONTS[0]);
  const [showWindowFrame, setShowWindowFrame] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { 
      setMounted(true); 
      // DETECT MOBILE
      const checkMobile = () => {
          const mobile = window.innerWidth < 1024;
          setIsMobile(mobile);
          if (mobile) setZoomLevel(0.45); // Default zoom for mobile
          else setZoomLevel(0.85);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => {
          setMounted(false);
          window.removeEventListener('resize', checkMobile);
      };
  }, []);

  const handleReset = () => {
    setAlertConfig({
        isOpen: true,
        title: "Reset Settings",
        description: "This will revert your snapshot settings to their defaults.",
        confirmText: "Reset Settings",
        isDestructive: true,
        Icon: FileX,
        onConfirm: () => {
             setBg(BACKGROUNDS[0]);
             setAccentColor(ACCENT_COLORS[0]);
             setPadding('4rem');
             setWindowStyle('macos');
             setDarkMode(true);
             setShowLineNumbers(false);
             setZoomLevel(isMobile ? 0.45 : 0.85);
             setTitle(item.original_filename || item.title || "untitled-snippet");
             setCustomFont(FONTS[0]);
             setShowWindowFrame(true);
             setAlertConfig(prev => ({ ...prev, isOpen: false }));
        }
    });
  };

  const download = async () => {
    if (!ref.current) return;
    setLoading(true);
    
    // TEMPORARILY REMOVE SCROLL FOR FULL CAPTURE
    const codeContainer = codeContainerRef.current;
    const originalMaxHeight = codeContainer?.style.maxHeight;
    const originalOverflow = codeContainer?.style.overflow;
    if (codeContainer) { codeContainer.style.maxHeight = 'none'; codeContainer.style.overflow = 'visible'; }
    
    // ENFORCE DESKTOP WIDTH FOR MOBILE CAPTURE
    if (isMobile && ref.current) { ref.current.style.minWidth = '800px'; }

    await new Promise(r => setTimeout(r, 100)); // WAIT FOR RENDER

    try {
        const node = ref.current;
        const blob = await htmlToImage.toPng(node, { pixelRatio: 3, quality: 1.0 });
        
        // CHECK FOR NATIVE MACOS BRIDGE
        const win = window as any;
        const bridge = win.webkit?.messageHandlers?.windowControl;
        
        if (bridge) {
            bridge.postMessage({ action: 'saveImage', base64: blob, filename: `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${item.id.slice(0, 6)}.png` });
        } else {
             // FALLBACK WEB DOWNLOAD
             const link = document.createElement('a');
             link.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${item.id.slice(0, 6)}.png`;
             link.href = blob;
             link.click();
        }
    } catch (err) { console.error(err); } 
    finally { 
        if (codeContainer) { codeContainer.style.maxHeight = originalMaxHeight || ''; codeContainer.style.overflow = originalOverflow || ''; }
        if (isMobile && ref.current) { ref.current.style.minWidth = 'unset'; }
        setLoading(false); 
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col lg:flex-row bg-surface-50/40 dark:bg-surface-950/40 backdrop-blur-3xl animate-fade-in transition-colors duration-300">
      <AlertModal 
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        description={alertConfig.description}
        confirmText={alertConfig.confirmText}
        isDestructive={alertConfig.isDestructive}
        Icon={alertConfig.Icon}
      />
      
      {/* MOBILE HEADER (ORDER 0) */}
      <div className="px-5 py-3 border-b border-surface-200/50 dark:border-white/5 flex justify-between items-center bg-surface-50/95 dark:bg-surface-900/95 backdrop-blur-xl shrink-0 lg:hidden w-full order-0 z-50">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-gradient-to-br from-brand-500/10 to-brand-600/10 text-brand-600 dark:text-brand-400">
                <ImageIcon className="w-5 h-5" strokeWidth={2} />
             </div>
             <div>
                <h2 className="text-base font-bold text-brand-600 dark:text-brand-400 tracking-widest uppercase">Snapshot Studio</h2>
                <p className="text-[11px] font-medium text-surface-500 dark:text-surface-400 hidden sm:block">Export beautiful images</p>
             </div>
          </div>
          {/* CLOSE BUTTON FOR MOBILE HEADER CONSISTENCY */}
           <button onClick={onClose} className="p-2 rounded-xl bg-surface-100/80 dark:bg-white/5 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/5 hover:bg-surface-200 dark:hover:bg-white/10 active:scale-95 transition-all text-surface-500"> 
              <X className="w-4 h-4" /> 
           </button>
      </div>

      {/* LEFT PANEL: CONTROLS */}
      {/* MOBILE: BOTTOM HALF, TOGGLEABLE OR SCROLLABLE. DESKTOP: LEFT SIDEBAR */}
      <div className="w-full lg:w-[440px] lg:h-full bg-surface-100/50 dark:bg-surface-950/80 backdrop-blur-3xl border-t lg:border-t-0 lg:border-r border-surface-200/50 dark:border-white/5 flex flex-col shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] lg:shadow-2xl z-20 order-2 lg:order-1 min-h-0">
        
        {/* HEADER (DESKTOP ONLY) */}
        <div className="hidden lg:flex px-5 py-3 lg:py-4 border-b border-surface-200/50 dark:border-white/5 justify-between items-center bg-surface-50/95 dark:bg-surface-900/95 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-gradient-to-br from-brand-500/10 to-brand-600/10 text-brand-600 dark:text-brand-400">
                <ImageIcon className="w-5 h-5" strokeWidth={2} />
             </div>
             <div>
                <h2 className="text-base font-bold text-brand-600 dark:text-brand-400 tracking-widest uppercase">Snapshot Studio</h2>
                <p className="text-[11px] font-medium text-surface-500 dark:text-surface-400 hidden sm:block">Export beautiful images</p>
             </div>
          </div>
          {/* MOBILE COLLAPSE ICON COULD GO HERE IF WE WANTED A DRAWER, BUT SPLIT VIEW IS FINE FOR NOW */}
        </div>

        {/* SETTINGS SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-hide pb-32 lg:pb-5">
            
            {/* 1. BACKGROUNDS */}
            <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-surface-400 pl-1 flex items-center gap-2"><Palette className="w-3 h-3"/> Background</label>
                <div className="flex flex-wrap gap-1.5">
                    {BACKGROUNDS.map(b => (
                        <button
                            key={b.id}
                            onClick={() => setBg(b)}
                            className={`w-7 h-7 rounded-lg transition-all duration-300 shadow-sm border border-black/5 hover:scale-110 active:scale-95 group relative overflow-hidden flex items-center justify-center shrink-0 ${bg.id === b.id ? 'ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-surface-900' : ''}`}
                            style={{ background: b.value }}
                        >
                             {bg.id === b.id && <Check className="w-3 h-3 text-white drop-shadow-md relative z-10" strokeWidth={3} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. ACCENT COLOR */}
            <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-surface-400 pl-1 flex items-center gap-2"><Wand2 className="w-3 h-3"/> Window Accent</label>
                <div className="flex gap-1.5 flex-wrap items-center">
                    {/* COLORFUL ACCENTS */}
                    {ACCENT_COLORS.filter(c => !['black','white','gray'].includes(c.id)).map(c => (
                        <button
                            key={c.id}
                            onClick={() => setAccentColor(c)}
                            className={`w-7 h-7 rounded-lg transition-all duration-300 shadow-sm border border-black/5 hover:scale-110 active:scale-95 ring-offset-2 dark:ring-offset-surface-900 shrink-0 flex items-center justify-center ${accentColor.id === c.id ? 'ring-2 ring-brand-500' : 'ring-0'}`}
                            style={{ background: c.value }}
                        >
                             {accentColor.id === c.id && <Check className="w-3 h-3 text-white drop-shadow-md" strokeWidth={3} />}
                        </button>
                    ))}
                    
                    {/* APPLE-STYLE PIPE SEPARATOR */}
                    <div className="w-px h-5 bg-surface-300 dark:bg-white/10 mx-1 self-center" />

                    {/* MONO ACCENTS */}
                    {ACCENT_COLORS.filter(c => ['black','white','gray'].includes(c.id)).map(c => (
                        <button
                            key={c.id}
                            onClick={() => setAccentColor(c)}
                            className={`w-7 h-7 rounded-lg transition-all duration-300 shadow-sm border border-black/5 hover:scale-110 active:scale-95 ring-offset-2 dark:ring-offset-surface-900 shrink-0 flex items-center justify-center ${accentColor.id === c.id ? 'ring-2 ring-brand-500' : 'ring-0'}`}
                            style={{ background: c.value }}
                        >
                             {accentColor.id === c.id && <Check className={`w-3 h-3 drop-shadow-md ${c.id === 'white' ? 'text-black' : 'text-white'}`} strokeWidth={3} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. WINDOW STYLE */}
            <div className="space-y-3">
                 <label className="text-[10px] font-bold uppercase tracking-wider text-surface-400 pl-1 flex items-center gap-2"><LayoutTemplate className="w-3 h-3"/> Window Style</label>
                 <div className="grid grid-cols-3 gap-2">
                      {WINDOW_STYLES.map(s => {
                          const isActive = windowStyle === s.id;
                          return (
                            <button
                                key={s.id}
                                onClick={() => setWindowStyle(s.id)}
                                className={`py-2 rounded-lg text-xs font-semibold transition-all border ${isActive ? 'shadow-sm scale-[1.02]' : 'bg-white/50 dark:bg-white/5 border-transparent text-surface-500 hover:bg-white border-transparent hover:text-brand-600 dark:hover:text-brand-400'}`}
                                style={isActive ? { borderColor: 'var(--brand-500)', backgroundColor: 'var(--brand-500)', color: 'white' } : {}}
                            >
                                {s.label}
                            </button>
                          );
                      })}
                 </div>
            </div>

            {/* CUSTOM MODE DYNAMIC CONTROLS */}
            {windowStyle === 'custom' && (
                <div className="overflow-hidden animate-in slide-in-from-top-4 fade-in duration-500 ease-out origin-top ml-1">
                    <div className="space-y-3 pt-4 border-l-2 border-surface-200 dark:border-white/10 pl-4 my-1">
                         <label className="text-[10px] font-bold uppercase tracking-wider text-surface-400 pl-1 flex items-center gap-2"><Settings2 className="w-3 h-3"/> Custom Tweaks</label>
                         
                         <div className="grid grid-cols-2 gap-3">
                             {/* FONT SELECTOR DROPDOWN-ISH */}
                             <div className="flex flex-col gap-1.5 col-span-2">
                                 <label className="text-[10px] font-semibold text-surface-500 pl-1">Typography</label>
                                 <div className="grid grid-cols-3 gap-2">
                                     {FONTS.map(f => (
                                         <button
                                            key={f.id}
                                            onClick={() => setCustomFont(f)}
                                            className={`py-1.5 rounded-lg text-[10px] font-semibold transition-all border ${customFont.id === f.id ? 'shadow-sm' : 'bg-white/50 dark:bg-white/5 border-transparent text-surface-500 hover:bg-white border-transparent hover:text-brand-600 dark:hover:text-brand-400'}`}
                                            style={customFont.id === f.id ? { borderColor: 'var(--brand-500)', backgroundColor: 'var(--brand-500)', color: 'white' } : {}}
                                         >
                                             {f.label}
                                         </button>
                                     ))}
                                 </div>
                             </div>

                             {/* WINDOW TOGGLE */}
                             <button 
                                onClick={() => setShowWindowFrame(!showWindowFrame)}
                                className={`p-3 col-span-2 rounded-xl border transition-all text-left flex items-center justify-between group ${showWindowFrame ? 'shadow-sm' : 'bg-white dark:bg-white/5 border-surface-200 dark:border-white/10 text-surface-600 dark:text-surface-400 hover:bg-white hover:border-transparent hover:text-brand-600 dark:hover:text-brand-400'}`}
                                style={showWindowFrame ? { borderColor: 'var(--brand-500)', backgroundColor: 'var(--brand-500)', color: 'white' } : {}}
                            >
                                <div>
                                    <div className="text-[10px] font-bold uppercase opacity-70 mb-0.5">Window Frame</div>
                                    <div className="text-xs font-semibold">{showWindowFrame ? 'Visible' : 'Hidden'}</div>
                                </div>
                                <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 shadow-inner ${showWindowFrame ? 'bg-brand-500' : 'bg-surface-300 dark:bg-white/20'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 ${showWindowFrame ? 'left-4.5 translate-x-3.5' : 'left-0.5'}`} />
                                </div>
                             </button>
                         </div>
                    </div>
                </div>
            )}

             {/* 4. PADDING */}
             <div className="space-y-3">
                 <label className="text-[10px] font-bold uppercase tracking-wider text-surface-400 pl-1 flex items-center gap-2"><Monitor className="w-3 h-3"/> Padding</label>
                 <div className="relative pt-2">
                    {(() => {
                        const val = parseFloat(padding);
                        const min = 1;
                        const max = 8;
                        const percent = ((val - min) / (max - min)) * 100;
                        
                        return (
                            <input 
                                type="range" 
                                min={min} max={max} step="0.5" 
                                value={val} 
                                onChange={(e) => setPadding(`${e.target.value}rem`)}
                                style={{
                                    backgroundSize: `${percent}% 100%`,
                                    backgroundImage: `linear-gradient(var(--brand-500), var(--brand-500))`
                                }}
                                className="w-full h-1.5 bg-surface-200 dark:bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:shadow-lg cursor-grab active:cursor-grabbing hover:[&::-webkit-slider-thumb]:scale-110 bg-no-repeat"
                            />
                        );
                    })()}
                 </div>
            </div>

            {/* 5. DETAILS */}
            <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-surface-400 pl-1 flex items-center gap-2"><Type className="w-3 h-3"/> Details</label>
                <div className="grid grid-cols-2 gap-3">
                     <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`p-3 rounded-xl border transition-all text-left group ${darkMode ? 'shadow-sm scale-[1.02]' : 'bg-white dark:bg-white/5 border-surface-200 dark:border-white/10 text-surface-600 dark:text-surface-400 hover:bg-white hover:border-transparent hover:text-brand-600 dark:hover:text-brand-400'}`}
                        style={darkMode ? { borderColor: 'var(--brand-500)', backgroundColor: 'var(--brand-500)', color: 'white' } : {}}
                    >
                        <div className="text-[10px] font-bold uppercase opacity-70 mb-1">Theme</div>
                        <div className="text-xs font-semibold">{darkMode ? 'Dark Mode' : 'Light Mode'}</div>
                     </button>
                     <button 
                        onClick={() => setShowLineNumbers(!showLineNumbers)}
                        className={`p-3 rounded-xl border transition-all text-left group ${showLineNumbers ? 'shadow-sm scale-[1.02]' : 'bg-white dark:bg-white/5 border-surface-200 dark:border-white/10 text-surface-600 dark:text-surface-400 hover:bg-white hover:border-transparent hover:text-brand-600 dark:hover:text-brand-400'}`}
                        style={showLineNumbers ? { borderColor: 'var(--brand-500)', backgroundColor: 'var(--brand-500)', color: 'white' } : {}}
                    >
                        <div className="text-[10px] font-bold uppercase opacity-70 mb-1">Line Nums</div>
                        <div className="text-xs font-semibold">{showLineNumbers ? 'Visible' : 'Hidden'}</div>
                     </button>
                </div>
                
                <div className="pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-surface-400 pl-1 flex items-center gap-2 mb-2"><Keyboard className="w-3 h-3"/> Window Title</label>
                    <input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-surface-200 dark:border-white/10 bg-white dark:bg-black/20 text-base md:text-sm font-semibold ring-0 focus:ring-0 focus:border-brand-500 dark:focus:border-brand-400 outline-none transition-all placeholder:text-surface-400 text-surface-900 dark:text-surface-100"
                        placeholder="Snapshot Title..."
                    />
                </div>
            </div>

        </div>

        {/* BOTTOM ACTIONS */}
        <div className="p-4 lg:p-5 flex gap-3 items-center border-t border-surface-200/50 dark:border-white/5 bg-surface-50/95 dark:bg-surface-900/95 backdrop-blur-xl z-20 shrink-0">
           <button onClick={handleReset} className="h-10 w-10 shrink-0 rounded-xl bg-surface-100 dark:bg-white/10 hover:bg-surface-200 dark:hover:bg-white/20 text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center justify-center tooltip-top tooltip-surface" data-tooltip="Reset Settings"> <FileX className="w-4 h-4" /> </button>
           <button onClick={download} disabled={loading} className="flex-1 h-9 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:grayscale flex justify-center items-center gap-2 group border border-white/10">
            {loading ? <div className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" /> : <Download className="w-3.5 h-3.5" />}
            <span className="text-xs">Save Image</span>
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: CANVAS PREVIEW */}
      <div className="w-full lg:flex-1 h-[35%] lg:h-full flex flex-col bg-surface-100/50 dark:bg-surface-950/80 relative overflow-hidden order-1 lg:order-2 shrink-0">
        
        {/* TOOLBAR */}
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-30 flex flex-col lg:flex-row gap-2 lg:gap-3 items-end lg:items-center">
            <div className="flex flex-col-reverse lg:flex-row bg-surface-100/80 dark:bg-surface-800/80 backdrop-blur-md rounded-2xl lg:rounded-full shadow-sm border border-black/5 p-1 items-center justify-center">
                <button onClick={() => setZoomLevel(z => Math.max(0.3, z - 0.1))} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 hover:scale-110 active:scale-95 transition-all"> <ZoomOut className="w-3 h-3 lg:w-4 lg:h-4" /> </button>
                <span className="px-1 lg:px-2 text-[10px] lg:text-xs font-mono font-medium text-surface-500 min-w-[3ch] text-center vertical-writing-mode-mobile flex items-center justify-center">{Math.round(zoomLevel * 100)}%</span>
                <button onClick={() => setZoomLevel(z => Math.min(1.5, z + 0.1))} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 hover:scale-110 active:scale-95 transition-all"> <ZoomIn className="w-3 h-3 lg:w-4 lg:h-4" /> </button>
            </div>
            <button onClick={onClose} className="p-2 lg:p-2.5 rounded-xl bg-surface-100/80 dark:bg-white/5 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/5 hover:bg-surface-200 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 lg:block hidden"> <X className="w-4 h-4 lg:w-5 lg:h-5" /> </button>
        </div>
        

        {/* CANVAS CENTER */}
        <div className="flex-1 overflow-hidden flex items-center justify-center p-4 lg:p-20 scrollbar-hide w-full">
             <div 
                ref={ref}
                className="shadow-2xl transition-all duration-500 origin-center rounded-xl"
                style={{ 
                    padding: padding, 
                    background: bg.value,
                    transform: `scale(${loading ? 1 : zoomLevel})`,
                    minWidth: '600px', // Always keep base width for layout stability, scale handles fit
                    maxWidth: '1200px'
                }}
             >
                  {/* WINDOW FRAME */}
                  <div className={`rounded-lg shadow-2xl overflow-hidden ${(windowStyle === 'custom' && !showWindowFrame) ? 'shadow-none !rounded-xl' : ''} ${windowStyle === 'windows-xp' ? 'rounded-t-lg border-2 border-[#0055ea]' : (windowStyle === 'windows-7' ? 'rounded-lg border border-black/20 ring-1 ring-white/30 box-content' : ((windowStyle === 'custom' && !showWindowFrame) ? '' : 'border border-black/5 dark:border-white/10'))} ${windowStyle === 'windows-10' ? 'rounded-sm' : ''} ${darkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                      
                      {/* WINDOW BAR */}
                      {(windowStyle !== 'none' && !(windowStyle === 'custom' && !showWindowFrame)) && (
                        <>
                            {(windowStyle === 'macos' || windowStyle === 'custom') && (
                                <div className={`px-4 py-3 flex items-center gap-3 border-b ${darkMode ? 'bg-[#2d2d2d] border-white/5' : 'bg-gray-100 border-gray-200'}`}>
                                    <div className="flex gap-2 group">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10 flex items-center justify-center overflow-hidden">
                                            <X className="w-2 h-2 text-black/50 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
                                        </div>
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10 flex items-center justify-center overflow-hidden">
                                            <Minus className="w-2 h-2 text-black/50 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
                                        </div>
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10 flex items-center justify-center overflow-hidden">
                                            <Maximize2 className="w-1.5 h-1.5 text-black/50 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
                                        </div>
                                    </div>
                                    <div className={`flex-1 text-center text-xs font-semibold opacity-80 -ml-16`} style={{color: accentColor.value}}>
                                        {title}
                                    </div>
                                </div>
                            )}
                            
                            {windowStyle === 'windows-xp' && (
                                <div className="px-2 py-1.5 flex items-center justify-between bg-gradient-to-b from-[#0058ee] to-[#0055ea] shadow-md relative overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                                     <div className="flex items-center gap-2 pl-1 relative z-10">
                                         <span className="text-white font-bold text-xs drop-shadow-sm font-sans tracking-wide leading-none pt-0.5">{title}</span>
                                     </div>
                                     <div className="flex gap-1 relative z-10">
                                          {/* MINIMIZE */}
                                          <div className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#fff] to-[#cce6ff] border border-white/60 shadow-inner flex items-center justify-center cursor-pointer hover:brightness-110 opacity-80">
                                              <div className="w-2 h-[2px] bg-[#0055ea]/60" />
                                          </div>
                                          {/* MAXIMIZE */}
                                          <div className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#fff] to-[#cce6ff] border border-white/60 shadow-inner flex items-center justify-center cursor-pointer hover:brightness-110 opacity-80">
                                              <div className="w-2 h-2 border-[2px] border-[#0055ea]/60 rounded-[1px]" />
                                          </div>
                                          {/* CLOSE */}
                                          <div className="w-5 h-5 rounded-[3px] bg-[#d73f40] border border-white/50 shadow-inner flex items-center justify-center cursor-pointer hover:brightness-110">
                                              <X className="w-3.5 h-3.5 text-white drop-shadow-md" strokeWidth={3} />
                                          </div>
                                     </div>
                                </div>
                            )}

                             {windowStyle === 'windows-7' && (
                                <div className="relative pt-1 px-1 pb-0 rounded-t-lg bg-[#111]/10 backdrop-blur-xl overflow-hidden" 
                                     style={{
                                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 0 5px rgba(255,255,255,0.4)',
                                         background: `linear-gradient(to bottom, ${accentColor.value}60 0%, ${accentColor.value}40 35%, ${accentColor.value}10 100%)`
                                     }}>
                                     {/* GLASS REFLECTION SHINE */}
                                     <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/50 to-transparent opacity-60 pointer-events-none" />
                                     
                                     {/* HEADER CONTENT */}
                                     <div className="flex items-center justify-between px-2 pt-1.5 pb-2 relative z-10">
                                         <div className="flex items-center gap-2">
                                             <div className="w-4 h-4 shadow-sm">
                                                {/* GENERIC APP ICON */}
                                                <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-600 rounded-[3px] border border-black/20" />
                                             </div>
                                             <span className="text-[#1e1e1e] font-sans text-[11px] font-normal tracking-wide" style={{ textShadow: '0 0 5px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.5)' }}>
                                                {title}
                                             </span>
                                         </div>
                                         
                                         {/* WIN7 CONTROLS */}
                                         <div className="flex items-center -mr-1">
                                             <div className="w-7 h-5 flex items-center justify-center rounded-[2px] hover:bg-white/40 hover:shadow-inner border border-transparent hover:border-white/30 transition-all">
                                                  <div className="w-2.5 h-[2px] bg-slate-700 shadow-sm" />
                                             </div>
                                             <div className="w-7 h-5 flex items-center justify-center rounded-[2px] hover:bg-white/40 hover:shadow-inner border border-transparent hover:border-white/30 transition-all ml-[1px]">
                                                  <div className="w-2.5 h-2 border-[1.5px] border-slate-700 rounded-[1px] shadow-sm" />
                                             </div>
                                             <div className="w-11 h-5 flex items-center justify-center rounded-[2px] bg-[#d74246] hover:bg-[#e81123] border border-[#b02b2c] hover:border-[#b02b2c] ml-1 shadow-inner relative overflow-hidden group">
                                                  <div className="absolute inset-x-0 top-0 h-[50%] bg-gradient-to-b from-white/40 to-transparent" />
                                                  <X className="w-3.5 h-3.5 text-white drop-shadow-md relative z-10" strokeWidth={2.5} />
                                             </div>
                                         </div>
                                     </div>
                                </div>
                            )}

                            {windowStyle === 'windows-10' && (
                                <div className={`px-4 py-2 flex items-center justify-between ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} border-b ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
                                     <div className="flex-1 text-left text-[11px] font-normal tracking-wide">
                                        {title}
                                     </div>
                                     <div className="flex gap-4">
                                          <Minus className="w-3 h-3 opacity-50" />
                                          <Square className="w-2.5 h-2.5 opacity-50" />
                                          <X className="w-3.5 h-3.5 opacity-50 hover:text-red-500 hover:opacity-100 transition-colors cursor-pointer" />
                                     </div>
                                </div>
                            )}

                            {windowStyle === 'linux' && (
                                <div className="px-3 py-2 flex items-center justify-between bg-[#3e3e3e] border-b border-[#1b1b1d]">
                                     <div className="w-14"></div>
                                     <div className="text-[#f2f2f2] font-semibold text-xs tracking-wide opacity-90">{title}</div>
                                     <div className="flex gap-2 w-14 justify-end">
                                          <div className="w-4 h-4 rounded-full bg-[#E95420] flex items-center justify-center cursor-pointer hover:brightness-110 shadow-sm border border-black/10">
                                              <X className="w-2 h-2 text-white" strokeWidth={3} />
                                          </div>
                                     </div>
                                </div>
                            )}
                        </>
                      )}
                      
                      {/* CODE AREA */}
                      <div ref={codeContainerRef} className={`p-6 max-h-[600px] overflow-hidden relative ${darkMode ? 'bg-[#1e1e1e] text-gray-300' : 'bg-white text-gray-800'}`}>
                          {showLineNumbers && (
                              <div className="absolute left-4 top-6 select-none opacity-30 text-right font-mono text-[12px] leading-relaxed select-none pointer-events-none" style={{ color: accentColor.value }}>
                                  {item.raw_content.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                              </div>
                          )}
                          <pre 
                            className={`text-[12px] leading-relaxed whitespace-pre-wrap break-words ${showLineNumbers ? 'pl-8' : ''}`}
                            style={{ fontFamily: windowStyle === 'custom' ? customFont.family : 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
                          >
                              {item.raw_content}
                          </pre>
                      </div>


                  </div>
             </div>
        </div>

        {/* DESKTOP FOOTER - FIXED INSIDE RIGHT PANEL */}
        <footer className="hidden lg:block absolute bottom-0 left-0 right-0 z-50 px-4 py-2 text-[10px] text-surface-400 bg-surface-50/90 dark:bg-surface-950/90 backdrop-blur-sm rounded-tl-lg pointer-events-none select-none text-right leading-relaxed">
          <span>© 2025 Yeray Lois Sánchez — Proprietary preview build. All rights reserved.</span>
        </footer>

      </div>

      {/* COPYRIGHT FOOTER - ONLY VISIBLE ON MOBILE, FLOWS IN LAYOUT */}
      <footer className="lg:hidden w-full px-4 py-2 text-[9px] text-surface-400 bg-surface-50/90 dark:bg-surface-950/90 backdrop-blur-sm pointer-events-none select-none text-center leading-relaxed shrink-0 order-last">
        <span>© 2025 Yeray Lois Sánchez</span>
      </footer>
    
    </div>,
    document.body
  );
}
