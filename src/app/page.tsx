/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : page.tsx                                       *
 *   Purpose : MAIN WEB APPLICATION ENTRY POINT (DASHBOARD)   *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import useSWR, { useSWRConfig } from "swr";
import { MOCK_ITEMS, MOCK_STATUS, MOCK_TAGS, MOCK_COLLECTIONS } from "../lib/mock-data";
import { useTheme } from "../components/ThemeProvider";
import { 
  Trash2, Copy, Search, Tag, Filter, Plus, FileCode, Check, ChevronDown, ChevronRight, ChevronLeft,
  LayoutGrid, List as ListIcon, Palette, Moon, Sun, Monitor, Minimize2, Maximize2, 
  Layers, Bell, X, AlertTriangle, Loader2, CheckCircle2, Image as ImageIcon, Inbox, Settings as SettingsIcon, HelpCircle, Minus, RotateCcw 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import Sidebar from "../components/Sidebar";
import ItemList from "../components/ItemList";
import ItemDetail from "../components/ItemDetail";
import CmdK from "../components/CmdK";
import ImportBox from "../components/ImportBox";
import QuickImageBox from "../components/QuickImageBox";
import AlertModal from "../components/AlertModal";
import ResizableDivider from "../components/ResizableDivider";
import Link from "next/link";
import { Item, ASSET_PREFIX } from "../lib/types";
import { useMediaQuery } from "../hooks/use-media-query";

import { MobileBanner } from "../components/MobileBanner";
import { Menu, ArrowLeft } from "lucide-react";

/**
 * UTILITY TO MERGE TAILWIND CLASSES CONDITIONALLY.
 * COMBINES CLSX AND TAILWIND-MERGE.
 * @param inputs CLASS NAMES OR CONDITIONAL OBJECTS
 * @returns MERGED CLASS STRING
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Filter =
  | { kind: "inbox" }
  | { kind: "recent" }
  | { kind: "collection"; value: string }
  | { kind: "tag"; value: string }
  | { kind: "all" }
  | { kind: "settings" }
  | { kind: "quickControls" };

/**
 * SIMPLE FETCH WRAPPER FOR SWR.
 * @param url ENDPOINT URL
 * @returns JSON RESPONSE PROMISE
 */
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const THEMES = [
  { name: "Indigo", hue: 239, sat: "84%", primary: "#6366f1", variable: "245, 100, 255" },
  { name: "Emerald", hue: 161, sat: "91%", primary: "#10b981", css: {
      "50": "#ecfdf5", "100": "#d1fae5", "500": "#10b981", "600": "#059669", "700": "#047857", "900": "#064e3b"
  }},
  { name: "Rose", hue: 343, sat: "89%", primary: "#f43f5e", css: {
      "50": "#fff1f2", "100": "#ffe4e6", "500": "#f43f5e", "600": "#e11d48", "700": "#be123c", "900": "#881337"
  }},
  { name: "Amber", hue: 38, sat: "92%", primary: "#f59e0b", css: {
      "50": "#fffbeb", "100": "#fef3c7", "500": "#f59e0b", "600": "#d97706", "700": "#b45309", "900": "#78350f"
  }},
  { name: "Slate", hue: 215, sat: "16%", primary: "#64748b", css: {
      "50": "#f8fafc", "100": "#f1f5f9", "500": "#64748b", "600": "#475569", "700": "#334155", "900": "#0f172a"
  }},
  { name: "Cyber (HC)", hue: 51, sat: "100%", primary: "#FFD700", css: {
      "50": "#fffde7", "100": "#fff9c4", "500": "#fbc02d", "600": "#f9a825", "700": "#f57f17", "900": "#212121"
  }}
];

import { useSearchParams } from "next/navigation";

/**
 * MAIN DASHBOARD PAGE COMPONENT.
 * HANDLES CLIENT-SIDE SUSPENSE LOADING STATE.
 */
export default function Home() {
  const themeHook = useTheme();
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-surface-50 dark:bg-surface-950 text-surface-400"><Loader2 className="w-8 h-8 animate-spin"/></div>}>
      <HomeContent />
    </Suspense>
  );
}

/**
 * PRIMARY DASHBOARD CONTENT.
 * MANAGES GLOBAL APP STATE (SIDEBAR, MODALS, THEMES, FILTERS).
 * ORCHESTRATES SUB-COMPONENTS LIKE ITEMLIST, ITEMDETAIL, AND CMDK.
 */
function HomeContent() {
  const { mutate } = useSWRConfig();
  const themeHook = useTheme();
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [titleHover, setTitleHover] = useState(false);
  


  // PREVENT HYDRATION MISMATCH / FLASH
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // MOBILE STATE
  const isMobile = useMediaQuery("(max-width: 900px)");

  // SAFARI IOS SCROLL FIX - RESTORE SCROLL AFTER INPUT BLUR
  useEffect(() => {
    if (!isMobile) return;
    
    const handleInputBlur = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // DELAY TO LET SAFARI FINISH ITS VIEWPORT ADJUSTMENTS
        setTimeout(() => {
          // FORCE SCROLL RESET TO RESTORE HEADER VISIBILITY
          window.scrollTo(0, 0);
        }, 100);
      }
    };
    
    document.addEventListener('focusout', handleInputBlur);
    return () => document.removeEventListener('focusout', handleInputBlur);
  }, [isMobile]);


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileQuickActionsOpen, setMobileQuickActionsOpen] = useState(true);




  // SELECT DAILY QUOTE
  const [quote, setQuote] = useState(() => {
    const quotes = [
      "Capture knowledge, build mastery.",
      "Every snippet is a step forward.",
      "Code once, reuse forever.",
      "Small pieces, big impact.",
      "Your personal knowledge base.",
      "Learn, save, grow.",
      "Organize today, succeed tomorrow.",
      "Ideas worth keeping.",
      "From chaos to clarity.",
      "Build your coding arsenal."
    ];
    // PREVIEW: RETURN STATIC INITIAL STATE TO PREVENT HYDRATION MISMATCH
    return quotes[0]; 
  });

  // RANDOMIZE QUOTE ON MOUNT (CLIENT-ONLY)
  useEffect(() => {
    const quotes = [
      "Capture knowledge, build mastery.",
      "Every snippet is a step forward.",
      "Code once, reuse forever.",
      "Small pieces, big impact.",
      "Your personal knowledge base.",
      "Learn, save, grow.",
      "Organize today, succeed tomorrow.",
      "Ideas worth keeping.",
      "From chaos to clarity.",
      "Build your coding arsenal."
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    const handleNativeFS = (e: any) => {
        setIsFullscreen(e.detail === true);
    };
    if (typeof window !== 'undefined') {
        window.addEventListener('native-fullscreen-change', handleNativeFS);
        
        // INITIAL WINDOW STATE HEURISTIC
        if (window.innerHeight === window.screen.height) setIsFullscreen(true);
         
        // SYNC WITH NATIVE WINDOW STATE
        const win = window as any;
        if (win.webkit?.messageHandlers?.windowControl) {
            win.webkit.messageHandlers.windowControl.postMessage('checkFullscreen');
        }
    }
    return () => {
        if (typeof window !== 'undefined') window.removeEventListener('native-fullscreen-change', handleNativeFS);
    };
  }, []);
  
  const [filter, setFilter] = useState<Filter>(() => {
    // INITIALIZE FILTER FROM URL
    const f = searchParams.get("filter");
    const val = searchParams.get("value");
    if (f === "collection" && val) return { kind: "collection", value: val };
    if (f === "tag" && val) return { kind: "tag", value: val };
    if (f === "recent") return { kind: "recent" };
    if (f === "all") return { kind: "all" };
    return { kind: "inbox" };
  });

  const [selectedId, setSelectedId] = useState<string | null>(() => {
    return searchParams.get("selectedId") || null;
  });
  
  // TRACK IF USER CLICKED AN ITEM WHILE IN SETTINGS MODE
  const [showDetailInSettings, setShowDetailInSettings] = useState(false);
  
  // RESET showDetailInSettings WHEN ENTERING SETTINGS MODE
  useEffect(() => {
    if (filter.kind === 'settings') {
      setShowDetailInSettings(false);
    }
  }, [filter.kind]);

  // AUTO-SWITCH TO DETAIL ON SELECTION (MOBILE)
  useEffect(() => {
    if (isMobile && selectedId) {
      setMobileView('detail');
    }
  }, [selectedId, isMobile]);



  const [zenMode, setZenMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // MOBILE STATE
  const [mobileView, setMobileView] = useState<'list' | 'detail'>(() => {
      // START IN DETAIL VIEW IF ID IS PRESENT IN URL
      return searchParams.get("selectedId") ? 'detail' : 'list';
  });
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [listWidth, setListWidth] = useState(420);
  const [sidebarToggleTop, setSidebarToggleTop] = useState(75); // Percent
  const isDraggingToggleRef = useRef(false);
  const toggleDragStartRef = useRef(0);

  const handleToggleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingToggleRef.current = false;
    toggleDragStartRef.current = e.clientY;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (Math.abs(moveEvent.clientY - toggleDragStartRef.current) > 5) {
        isDraggingToggleRef.current = true;
      }
      // Calculate new percentage
      const newPercent = (moveEvent.clientY / window.innerHeight) * 100;
      setSidebarToggleTop(Math.max(10, Math.min(90, newPercent)));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (!isDraggingToggleRef.current) {
        setSidebarCollapsed(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  // RESIZE OPTIMIZATION REFS
  const sidebarRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sidebarWidthRef = useRef(sidebarWidth);
  const listWidthRef = useRef(listWidth);

  // SYNC REFS
  useEffect(() => {
    sidebarWidthRef.current = sidebarWidth;
    listWidthRef.current = listWidth;
  }, [sidebarWidth, listWidth]);
  
  // AUTO-TRIGGER LOGO ANIMATION ON MOBILE SIDEBAR OPEN
  useEffect(() => {
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout;
    
    // ON MOBILE: CHECK MOBILEMENUOPEN
    // ON DESKTOP: CHECK !SIDEBARCOLLAPSED (IF WE WANTED IT THERE TOO, BUT USER SPECIFIED MOBILE)
    const isOpen = isMobile ? mobileMenuOpen : !sidebarCollapsed;

    if (isMobile && isOpen) {
       // DELAY 1S (1000MS) BEFORE REVEALING QUOTE
       t1 = setTimeout(() => setTitleHover(true), 1000); 
       // REVERT TO LOGO AFTER 3S (TOTAL 4S)
       t2 = setTimeout(() => setTitleHover(false), 4000); 
    } else {
       // IMMEDIATELY RESET STATE WHEN CLOSED
       setTitleHover(false);
    }

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isMobile, sidebarCollapsed, mobileMenuOpen]);
  
  // SETTINGS STATE (PERSISTED)
  // DERIVE ACTIVE THEME FROM GLOBAL STATE
  const { customTheme, setCustomTheme, setTheme } = themeHook;
  
  const activeTheme = useMemo(() => {
      // SIMPLE HEURISTIC: MATCH HUE AND SAT
      const current = THEMES.find(t => 
          t.hue === customTheme.brandHue && 
          parseInt(t.sat) === customTheme.brandSat
      );
      return current ? current.name : "Custom";
  }, [customTheme]);

  const [recentLimit, setRecentLimit] = useState(4);

  // LOAD LOCALSTORAGE SETTINGS (LIMIT ONLY)
  useEffect(() => {
    const savedLimit = localStorage.getItem("ls_recent_limit");
    if (savedLimit) setRecentLimit(parseInt(savedLimit, 10));
  }, []);

  // UPDATE SETTINGS
  const handleThemeChange = (tName: string) => {
      const t = THEMES.find(theme => theme.name === tName);
      if (t) {
          setTheme("custom");
          setCustomTheme(prev => ({
              ...prev,
              brandHue: t.hue,
              brandSat: parseInt(t.sat.replace("%", "")),
              // PRESERVE OTHER CUSTOM SETTINGS LIKE DARK BG
          }));
      }
  };
  const handleLimitChange = (n: number) => {
      setRecentLimit(n);
      localStorage.setItem("ls_recent_limit", n.toString());
  };

  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);
  
  // ALERT STATE
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });
  const prevItemsLength = useRef(0);

  // REMOVED CONFLICTING USEEFFECT - GLOBAL THEME PROVIDER NOW HANDLES STYLES

  // MOCK: USE STATIC DATA INSTEAD OF API
  const status = MOCK_STATUS;

  const queryString = useMemo(() => {
    switch (filter.kind) {
      case "inbox": return "filter=inbox";
      case "recent": return "filter=all"; 
      case "all": return "filter=all";
      case "collection": return `filter=collection&value=${encodeURIComponent(filter.value)}`;
      case "tag": return `filter=tag&value=${encodeURIComponent(filter.value)}`;
      case "settings": return null;
      default: return "filter=inbox";
    }
  }, [filter]);

  // MOCK: USE STATIC ITEMS INSTEAD OF API
  const itemsData = { items: MOCK_ITEMS };
  const mutateItems = () => {}; // No-op for static
  const itemsLoading = false;

  const items: Item[] = useMemo(() => {
    let list = (itemsData?.items ?? []) as Item[];
    
    // APPLY FILTER BASED ON KIND (MATCHING STACK BEHAVIOR)
    switch (filter.kind) {
      case "inbox":
        // INBOX = ITEMS WITHOUT COLLECTION (COLLECTION IS NULL OR UNDEFINED)
        list = list.filter(item => !item.collection);
        break;
      case "recent":
        // RECENT = ALL ITEMS, LIMITED BY RECENTLIMIT
        return list.slice(0, recentLimit);
      case "all":
        // ALL = RETURN ALL ITEMS
        break;
      case "collection":
        // FILTER BY COLLECTION NAME
        list = list.filter(item => item.collection === filter.value);
        break;
      case "tag":
        // FILTER BY TAG
        list = list.filter(item => item.tags?.includes(filter.value));
        break;
      case "settings":
        // SETTINGS VIEW - KEEP CURRENT LIST
        break;
    }
    
    return list;
  }, [itemsData, filter, recentLimit]);

  // NEW ITEM NOTIFICATION TRIGGER
  useEffect(() => {
     if (itemsData?.items && itemsData.items.length > prevItemsLength.current && prevItemsLength.current > 0) {
         setNotification({
             title: "AI Processing Complete",
             message: "New snippet analyzed and categorized."
         });
         setTimeout(() => setNotification(null), 4000);
     }
     if (itemsData?.items) prevItemsLength.current = itemsData.items.length;
  }, [itemsData]);


  useEffect(() => {
    // DESKTOP ONLY: AUTO-SELECT FIRST ITEM IF NOTHING SELECTED
    if (!mounted || isMobile) return;
    
    if (items.length > 0 && !selectedId) {
      setSelectedId(items[0].id);
    } else if (selectedId && !items.find((i) => i.id === selectedId)) {
      setSelectedId(items[0]?.id ?? null);
    }
  }, [items, selectedId, isMobile, mounted]);

  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [items, selectedId]
  );

  // PRELOADER TO PREVENT SIDEBAR FLASH
  if (!mounted) {
      return (
          <div className="flex flex-col h-screen w-full items-center justify-center bg-surface-50 dark:bg-surface-950 text-surface-400 animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center shadow-sm border border-surface-200 dark:border-white/5 animate-pulse">
                      <img src={`${ASSET_PREFIX}/logo.png`} alt="Logo" className="w-8 h-8 opacity-50" />
                  </div>
                  <Loader2 className="w-5 h-5 animate-spin text-brand-500 opacity-80" />
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-1 w-full bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-50 font-sans flex-col lg:flex-row min-h-[100svh] h-[100svh] lg:h-[100dvh] overflow-hidden">
      {isMobile && (
        <>
          <MobileBanner />
           <header className="sticky top-0 flex items-center justify-between px-4 pb-3 pt-[calc(env(safe-area-inset-top)_+_0.75rem)] border-b border-surface-200/60 dark:border-white/5 bg-surface-50 dark:bg-surface-950 backdrop-blur-2xl backdrop-saturate-150 z-50 shrink-0 shadow-sm transition-all duration-300 font-medium tracking-tight">
             {/* LEFT - MENU/BACK */}
             <div className="flex items-center w-10">
                {selectedItem || filter.kind === 'settings' ? (
                    <button 
                        onClick={() => { 
                          if (searchParams.get("from") === "graph") {
                              const viewMode = searchParams.get("viewMode");
                              window.location.href = `/collections/graph${viewMode ? `?viewMode=${viewMode}` : ''}`;
                              return;
                          }
                          if (filter.kind === 'settings') {
                            setFilter({ kind: 'all' });
                          } else {
                            setSelectedId(null);
                          }
                          setMobileView('list');
                        }} 
                        className="p-2 -ml-2 rounded-lg text-brand-600 dark:text-brand-400 active:opacity-60 transition-opacity"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                ) : (
                    <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 rounded-lg text-brand-600 dark:text-brand-400 active:opacity-60 transition-opacity">
                        <Menu className="w-5 h-5" />
                    </button>
                )}
             </div>
             
             {/* CENTER - TITLE */}
             <span className="text-xs font-bold tracking-widest uppercase text-brand-600 dark:text-brand-400">LOCALSNIPS</span>
             
             {/* RIGHT - SEARCH */}
             <div className="flex items-center w-10 justify-end">
                 <button 
                    onClick={() => window.dispatchEvent(new CustomEvent("open-cmdk"))}
                    className="p-2 rounded-lg text-brand-600 dark:text-brand-400 active:opacity-60 transition-opacity"
                 >
                    <Search className="w-5 h-5" />
                 </button>
             </div>
          </header>
        </>
      )}
      <CmdK
        onPick={(id) => {
          setSelectedId(id);
          setFilter({ kind: "all" });
        }}
      />
      <AlertModal 
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        description={alertConfig.description}
        confirmText="Nuke Database"
        isDestructive
      />
      
      
      {/* SIDEBAR (HIDDEN IN ZEN MODE, DRAWER ON MOBILE) */}
      {!zenMode && (
          <>
          {/* MOBILE BACKDROP */}
          {isMobile && mobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm animate-fade-in"
                onClick={() => setMobileMenuOpen(false)}
              />
          )}
          <aside 
            ref={sidebarRef}
            className={cn(
                "flex-shrink-0 border-r border-surface-200 dark:border-surface-800 relative flex flex-col transition-all duration-300",
                isMobile 
                    ? `fixed inset-y-0 left-0 z-[60] bg-surface-50 dark:bg-surface-950 w-[280px] shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
                    : "animate-fade-in-left"
            )}
            style={!isMobile ? { width: sidebarCollapsed ? 0 : sidebarWidth, opacity: sidebarCollapsed ? 0 : 1, overflow: sidebarCollapsed ? 'hidden' : 'visible' } : {}}
          >
            {/* BACKDROP OPACITY */}
            <div className="absolute inset-0 bg-surface-50 dark:bg-surface-950 transition-opacity duration-300 -z-10" style={{ opacity: 'var(--sidebar-opacity, 0.8)' }} />
            
            <div className="p-4 h-full flex flex-col relative z-10">
                {/* DYNAMIC WINDOW HEADER */}
                <div 
                    className="relative flex items-center justify-start min-h-[3rem] px-3 mb-4 select-none py-1"
                    style={{ WebkitAppRegion: "drag" } as any}
                    onMouseEnter={() => setTitleHover(true)}
                    onMouseLeave={() => {
                        setTimeout(() => setTitleHover(false), 300);
                    }}
                >
                    {/* UNIFIED ANIMATION: LOGO & TITLE */}
                    <div 
                        className={`flex items-center gap-3 transition-all duration-300 ease-in-out absolute pointer-events-none 
                        ${titleHover ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0 delay-100"}
                        `}
                        style={{ left: isFullscreen ? '12px' : '18px' }}
                    >
                        <div className="w-8 h-8 flex items-center justify-center bg-surface-100 dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-1.5">
                            <img src={`${ASSET_PREFIX}/logo.png`} alt="LocalSnips Logo" className="w-full h-full object-contain opacity-90" />
                        </div>
                        <span className="text-[13px] font-bold tracking-[0.15em] uppercase text-brand-600 dark:text-brand-400" style={{ color: theme === 'custom' ? 'var(--title-color)' : undefined }}>LocalSnips</span>
                    </div>

                    {/* UNIFIED HOVER: STATS & QUOTE */}
                    <div 
                        className={`absolute flex items-center gap-3 transition-all duration-300 ease-in-out
                        ${titleHover ? "opacity-100 translate-x-0 delay-75" : "opacity-0 -translate-x-4 pointer-events-none"}
                        `}
                        style={{ left: isFullscreen ? '12px' : '18px' }}
                    >
                        <div 
                            className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-surface-100 dark:bg-white/10"
                            style={theme === 'custom' ? { 
                                backgroundColor: 'rgba(var(--title-color-rgb, 100, 100, 100), 0.15)'
                            } : undefined}
                        >
                            <div 
                                className={`w-2 h-2 rounded-full shrink-0 ${(status?.counts?.inbox ?? 0) > 0 ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}
                            />
                            <span 
                                className="text-xs font-medium text-surface-700 dark:text-surface-200 whitespace-nowrap"
                                style={theme === 'custom' ? { color: 'var(--title-color)' } : undefined}
                            >
                                {(status?.counts?.inbox ?? 0) > 0 
                                    ? `${status?.counts?.inbox} waiting`
                                    : 'All organized'}
                            </span>
                        </div>
                        <div 
                            className="text-xs text-surface-500 dark:text-surface-400 italic whitespace-normal leading-tight max-w-[180px]"
                            style={theme === 'custom' ? { color: 'var(--title-color)', opacity: 0.8 } : undefined}
                        >
                            "{quote}"
                        </div>
                    </div>
                </div>
                
                <Sidebar
                    status={status}
                    onPickFilter={(f) => { 
                        setFilter(f); 
                        if (f.kind === 'all' || f.kind === 'recent') {
                            setMobileQuickActionsOpen(false);
                        }
                        if (isMobile) {
                            setMobileView('list');
                            setMobileMenuOpen(false);
                        }
                    }}
                    active={filter}
                />

                <div className="mt-auto px-2 pb-2 pt-2 border-t border-surface-200 dark:border-white/5 flex flex-col gap-1">
                         <button
                            onClick={() => { 
                                setFilter({ kind: "settings" }); 
                                setShowDetailInSettings(false); // ALWAYS RESET TO SHOW APPEARANCE VIEW
                                if (isMobile) {
                                    setMobileView('detail');
                                    setMobileMenuOpen(false);
                                }
                            }}
                            className={clsx(
                                "flex items-center w-full px-2 py-1.5 rounded-lg text-sm transition-all group",
                                filter.kind === "settings" 
                                    ? "bg-white dark:bg-surface-800 shadow-sm text-surface-900 dark:text-white" 
                                    : "text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white"
                            )}
                        >
                            <div className={clsx(
                                "w-6 h-6 rounded-md flex items-center justify-center mr-2 transition-colors",
                                // MATCHING PALETTE: LIGHT (BRAND 50/600), DARK (SURFACE 800/100)
                                "bg-brand-50 dark:bg-surface-800 text-brand-600 dark:text-surface-100",
                                // SUBTLE BORDER
                                "border border-black/5 dark:border-white/10"
                            )}>
                                <Palette className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-medium text-surface-400" style={{ color: theme === 'custom' ? 'var(--title-color)' : undefined }}>Appearance</span>
                        </button>

                        <div
                            role="button"
                            onClick={() => window.location.href = "/service-manager"}
                            className="flex items-center w-full px-2 py-1.5 rounded-lg text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white transition-all group cursor-pointer"
                        >
                             <div className="w-6 h-6 rounded-md flex items-center justify-center mr-2 bg-brand-50 dark:bg-surface-800 text-brand-600 dark:text-surface-100 border border-black/5 dark:border-white/10">
                                <SettingsIcon className="w-3.5 h-3.5" />
                             </div>
                             <span className="font-medium text-surface-400" style={{ color: theme === 'custom' ? 'var(--title-color)' : undefined }}>Service Manager</span>
                        </div>

                        {/* COLLAPSE SIDEBAR */}
                        <button
                            onClick={() => {
                                if (isMobile) {
                                    setMobileMenuOpen(false);
                                } else {
                                    setSidebarCollapsed(true);
                                }
                            }}
                            className="flex items-center w-full px-2 py-1.5 rounded-lg text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white transition-all group"
                        >
                             <div className="w-6 h-6 rounded-md flex items-center justify-center mr-2 bg-brand-50 dark:bg-surface-800 text-brand-600 dark:text-surface-100 border border-black/5 dark:border-white/10">
                                <ChevronLeft className="w-3.5 h-3.5" />
                             </div>
                            <span className="font-medium text-surface-400" style={{ color: theme === 'custom' ? 'var(--title-color)' : undefined }}>Hide Sidebar</span>
                        </button>
                    </div>
            </div>
          </aside>
          </>
      )}

      {/* EXPAND SIDEBAR TOGGLE */}
      {!zenMode && sidebarCollapsed && !isMobile && (
        <button
          onMouseDown={handleToggleDragStart}
          className="tooltip-surface tooltip-right fixed z-40 left-0 -translate-y-1/2 w-5 h-24 flex items-center justify-center bg-surface-100/90 dark:bg-surface-800/90 hover:bg-surface-200 dark:hover:bg-surface-700 border-r border-t border-b border-surface-200 dark:border-surface-700 rounded-r-xl transition-colors backdrop-blur-sm shadow-sm group cursor-ns-resize"
          style={{ top: `${sidebarToggleTop}%` }}
          data-tooltip={isDraggingToggleRef.current ? undefined : "Show Sidebar"}
        >
          <ChevronRight className="w-3.5 h-3.5 text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-300 transition-colors pointer-events-none" />
        </button>
      )}

      {/* RESIZABLE DIVIDER (SIDEBAR/LIST) */}
      {!zenMode && !sidebarCollapsed && (
        <ResizableDivider
          onResize={(delta) => {
              const newWidth = Math.max(200, Math.min(400, sidebarWidthRef.current + delta));
              sidebarWidthRef.current = newWidth;
              if (sidebarRef.current) sidebarRef.current.style.width = `${newWidth}px`;
          }}
          onResizeEnd={() => setSidebarWidth(sidebarWidthRef.current)}
        />
      )}

      {/* ZEN MODE TOGGLE */}
      
      {/* ITEM LIST PANEL */}

      {/* ITEM LIST PANEL */}

      <div 
        ref={listRef}
        className={cn(
            "flex-shrink-0 border-r border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 flex flex-col min-w-0 min-h-0 transition-all duration-300",
            isMobile 
                ? (mobileView === 'list' ? "w-full flex-1" : "hidden") 
                : (zenMode ? "w-0 opacity-0 overflow-hidden border-none" : "")
        )}
        style={!isMobile ? { width: zenMode ? 0 : listWidth } : {}}
      >
        <div className={`py-4 px-4 border-b border-surface-100 dark:border-surface-800 bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-sm z-10`}>
              <div className="flex flex-col">
                  <button 
                    onClick={() => setMobileQuickActionsOpen(!mobileQuickActionsOpen)}
                    className="flex items-center justify-between w-full text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider"
                  >
                      <span>Quick Tools</span>
                      {mobileQuickActionsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-out ${mobileQuickActionsOpen ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"}`}
                  >
                      <div className="space-y-4">
                          <ImportBox
                            onCreated={(id) => {
                              mutateItems();
                              setSelectedId(id);
                              setFilter({ kind: "inbox" });
                            }}
                          />
                          <QuickImageBox />
                      </div>
                  </div>
              </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pb-4">
            {itemsLoading && items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-surface-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs">Loading items...</span>
                </div>
            ) : (
                <div className="animate-fade-in pb-24 lg:pb-0">
                    <ItemList
                        items={items}
                        selectedId={selectedId}
                        onSelect={(id) => {
                          setSelectedId(id);
                          if (filter.kind === 'settings') {
                            setShowDetailInSettings(true);
                          }
                        }}
                    />
                    {items.length === 0 && !itemsLoading && (
                        <div className="flex flex-col items-center justify-center h-64 text-surface-400 text-center p-8">
                            <Inbox className="w-8 h-8 mb-2 opacity-50" />
                            <p className="text-sm font-medium">No items found</p>
                            {filter.kind === "recent" && <p className="text-xs mt-1 text-surface-400 opacity-70">Showing last {recentLimit} items</p>}
                            <p className="text-xs mt-3 text-surface-400 opacity-60">Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300 font-mono text-[10px]">⌘K</kbd> to search all items</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* RESIZABLE DIVIDER (LIST/DETAIL) */}
      {!zenMode && !isMobile && (
        <ResizableDivider
          onResize={(delta) => {
              const newWidth = Math.max(300, Math.min(800, listWidthRef.current + delta));
              listWidthRef.current = newWidth;
              if (listRef.current) listRef.current.style.width = `${newWidth}px`;
          }}
          onResizeEnd={() => setListWidth(listWidthRef.current)}
        />
      )}

      <main className={cn(
        "flex-1 min-w-0 bg-surface-50 dark:bg-surface-950 flex flex-col relative",
        isMobile ? "overflow-y-auto" : "overflow-hidden",
        isMobile && mobileView !== 'detail' ? "hidden" : "w-full"
      )}>
        {/* MOBILE BACK BUTTON */}


        {!isMobile && (
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
             <button 
                onClick={() => setZenMode(!zenMode)}
                className="tooltip-surface p-2 rounded-lg bg-surface-100/50 dark:bg-white/5 hover:bg-surface-100 dark:hover:bg-white/10 text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-all backdrop-blur-sm"
                data-tooltip={zenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
             >
                {zenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
             </button>
        </div>
        )}
        {/* MAIN CONTENT AREA - SETTINGS VS DETAIL LOGIC */}
        {filter.kind === "settings" && !showDetailInSettings ? (
          <AppearanceView 
            activeTheme={activeTheme} 
            onSelectTheme={handleThemeChange}
            recentLimit={recentLimit}
            onLimitChange={handleLimitChange}
            isMobile={isMobile}
            onBack={() => {
              setFilter({ kind: "all" });
              setMobileView('list');
            }}
            onResetLayout={() => {
              setSidebarWidth(260);
              setListWidth(420);
              setSidebarCollapsed(false);
            }}
            totalItems={status?.counts?.total ?? 20}
          />
        ) : selectedItem ? (
          <div className="flex-1 min-h-0 md:overflow-y-auto">
            <ItemDetail
              key={selectedItem.id}
              item={selectedItem}
              onMutated={() => {
                mutateItems();
                mutate("/api/facets");
              }}
            />
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="h-full flex items-center justify-center text-surface-300">
              <div className="text-center">
                <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Select an item to view details</p>
              </div>
            </div>
          </div>
        )}

        {notification && (
            <div className="absolute bottom-6 right-6 z-50 animate-fade-in">
                <div className="bg-surface-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-start gap-3 w-80">
                    <div className="bg-brand-500 rounded-full p-1 mt-0.5">
                        <Bell className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold">{notification.title}</h4>
                        <p className="text-xs text-surface-300 mt-1 leading-relaxed">{notification.message}</p>
                    </div>
                    <button 
                        onClick={() => setNotification(null)}
                        className="text-surface-400 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

// APPEARANCE VIEW COMPONENT
function AppearanceView({ 
    activeTheme, 
    onSelectTheme,
    recentLimit,
    onLimitChange,
    onResetLayout,
    isMobile,
    onBack,
    totalItems = 20
}: { 
    activeTheme: string, 
    onSelectTheme: (t: string) => void,
    recentLimit: number,
    onLimitChange: (n: number) => void,
    onResetLayout: () => void,
    isMobile?: boolean,
    onBack?: () => void;
    totalItems?: number;
}) {
  const themeHook = useTheme();
  // ALERT STATE
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  return (
    <>
    <AlertModal 
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        description={alertConfig.description}
        confirmText="Nuke Database"
        isDestructive
    />
    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
    <div className="max-w-4xl mx-auto w-full p-4 md:p-12 pb-32 md:pb-12 animate-fade-in flex-1 flex flex-col justify-center">
      <div className="flex flex-col items-center text-center mb-12 animate-fade-in-down">
        <div className="w-16 h-16 rounded-[1.2rem] bg-surface-100/50 dark:bg-white/5 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm mb-5 border border-surface-200/50 dark:border-white/10">
            <Palette className="w-8 h-8" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-brand-600 dark:text-brand-400 tracking-tight mb-2">Appearance</h1>
            <p 
              className="text-base font-medium leading-relaxed max-w-md mx-auto text-balance"
              style={{ color: themeHook.theme === 'custom' ? 'var(--title-color)' : undefined }}
            >
                Customize the look and feel of your workspace
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* COLUMN 1: THEMES */}
        <div className="bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-surface-500 dark:text-surface-400">
                <Palette className="w-5 h-5"/>
                <h3 className="font-semibold text-lg" style={{ color: themeHook.theme === 'custom' ? 'var(--title-color)' : undefined }}>Appearance</h3>
            </div>
            
            <div className="space-y-6">
                 {/* 1. MAIN MODE SELECTOR - APPLE STYLE SEGMENTED CONTROL */}
                 <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl gap-1">
                        {[
                            { id: 'light', label: 'Light', icon: Sun },
                            { id: 'dark', label: 'Dark', icon: Moon },
                            { id: 'system', label: 'System', icon: Monitor },
                            { id: 'custom', label: 'Custom', icon: Palette }
                        ].map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => themeHook.setTheme(mode.id as any)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                                    themeHook.theme === mode.id
                                    ? "bg-brand-600 dark:bg-brand-500 text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                    : "text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200"
                                )}
                            >
                                <mode.icon className="w-4 h-4" />
                                {mode.label}
                            </button>
                        ))}
                    </div>
                 </div>
                 
                 {/* 2. DYNAMIC SUB-MENUS */}
                 <div className="animate-fade-in space-y-4">
                    
                    {/* LIGHT MODE VARIANTS */}


                    {/* DARK MODE VARIANTS */}


                    {/* CUSTOM MODE - AUXILIARY MENU */}
                    {themeHook.theme === 'custom' && (
                        <div className="animate-scale-in origin-top">
                      <div className="space-y-8 animate-fade-in">
                                {/* WINDOW TINT (REPLACING OLD DARK PALETTE) */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium text-surface-900 dark:text-surface-100">Window Tint</label>
                                        <div className="group relative">
                                            <HelpCircle className="w-3.5 h-3.5 text-surface-400 cursor-help" />
                                            <div 
                                                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-3 backdrop-blur-xl text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none"
                                                style={{ 
                                                    backgroundColor: 'var(--tooltip-bg)', 
                                                    color: 'var(--tooltip-text)',
                                                    borderWidth: '1px',
                                                    borderColor: 'var(--tooltip-border)'
                                                }}
                                            >
                                                Manually select the base background color for your custom theme.
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 bg-surface-100/50 dark:bg-surface-800/30 rounded-xl border border-surface-200/50 dark:border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            {[
                                                { hex: "#000000", name: "Pure" },
                                                { hex: "#09090b", name: "Zinc" },
                                                { hex: "#0f172a", name: "Slate" },
                                                { hex: "#171717", name: "Neutral" },
                                                { hex: "#1c1917", name: "Stone" },
                                                { hex: "#1e1b4b", name: "Cosmic" },
                                                { hex: "#022c22", name: "Forest" },
                                                { hex: "#450a0a", name: "Crimson" },
                                            ].map(bg => (
                                                <button
                                                    key={bg.hex}
                                                    onClick={() => themeHook.setCustomTheme(prev => ({ ...prev, darkBg: bg.hex }))}
                                                    className={cn(
                                                        "group relative w-7 h-7 rounded-lg border border-surface-200 dark:border-white/10 shadow-sm transition-transform hover:scale-110 shrink-0",
                                                        themeHook.customTheme.darkBg === bg.hex ? "ring-2 ring-offset-2 ring-brand-500 ring-offset-surface-50 dark:ring-offset-surface-900 scale-110" : ""
                                                    )}
                                                    title={bg.name}
                                                    style={{ backgroundColor: bg.hex }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ACCENT COLOR - APPLE STYLE */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium text-surface-900 dark:text-surface-100">Accent Color</label>
                                            <div className="group relative">
                                                <HelpCircle className="w-3.5 h-3.5 text-surface-400 cursor-help" />
                                                <div 
                                                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 p-3 backdrop-blur-xl text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none"
                                                    style={{ 
                                                        backgroundColor: 'var(--tooltip-bg)', 
                                                        color: 'var(--tooltip-text)',
                                                        borderWidth: '1px',
                                                        borderColor: 'var(--tooltip-border)'
                                                    }}
                                                >
                                                    Applies to buttons, links, code snippets, and interactive elements.
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 transition-colors duration-300">Preview</span>
                                    </div>
                                    <div className="p-4 bg-surface-100/50 dark:bg-surface-800/30 rounded-xl border border-surface-200/50 dark:border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            {[
                                                { hue: 215, color: '#3b82f6', label: 'Blue' },
                                                { hue: 270, color: '#a855f7', label: 'Purple' },
                                                { hue: 330, color: '#ec4899', label: 'Pink' },
                                                { hue: 0,   color: '#ef4444', label: 'Red' },
                                                { hue: 30,  color: '#f97316', label: 'Orange' },
                                                { hue: 45,  color: '#eab308', label: 'Yellow' },
                                                { hue: 142, color: '#22c55e', label: 'Green' },
                                            ].map((accent) => (
                                                <button
                                                    key={accent.label}
                                                    onClick={() => themeHook.setCustomTheme(prev => ({ 
                                                        ...prev, 
                                                        brandHue: accent.hue, 
                                                        brandSat: 70,
                                                        titleHue: accent.hue, // AUTO-SYNC TITLE
                                                        titleSat: 20          // SUBTLE SATURATION
                                                    }))}
                                                    className={cn(
                                                        "w-7 h-7 rounded-lg transition-transform hover:scale-110 shadow-sm shrink-0",
                                                        themeHook.customTheme.brandHue === accent.hue ? "ring-2 ring-offset-2 ring-brand-500 ring-offset-surface-50 dark:ring-offset-surface-900 scale-110" : ""
                                                    )}
                                                    style={{ backgroundColor: accent.color }}
                                                    title={accent.label}
                                                />
                                            ))}
                                        </div>
                                        <div className="h-px bg-surface-200 dark:bg-surface-700/50 w-full" />
                                        {/* HUE SLIDER */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-surface-500 uppercase">Hue</span>
                                            <input 
                                                type="range" min="0" max="360"
                                                className="flex-1 h-1.5 cursor-pointer appearance-none rounded-full"
                                                style={{ background: `linear-gradient(to right, hsl(0,75%,50%), hsl(60,75%,50%), hsl(120,75%,50%), hsl(180,75%,50%), hsl(240,75%,50%), hsl(300,75%,50%), hsl(360,75%,50%))` }}
                                                value={themeHook.customTheme.brandHue}
                                                onChange={(e) => themeHook.setCustomTheme({ ...themeHook.customTheme, brandHue: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION TITLES */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium text-surface-900 dark:text-surface-100">Header Highlight</label>
                                            <div className="group relative">
                                                <HelpCircle className="w-3.5 h-3.5 text-surface-400 cursor-help" />
                                                <div 
                                                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 p-3 backdrop-blur-xl text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none"
                                                    style={{ 
                                                        backgroundColor: 'var(--tooltip-bg)', 
                                                        color: 'var(--tooltip-text)',
                                                        borderWidth: '1px',
                                                        borderColor: 'var(--tooltip-border)'
                                                    }}
                                                >
                                                    Color for section headers and category titles in sidebar. Presets adjust based on your window tint.
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider transition-colors duration-300" style={{ color: `hsl(${themeHook.customTheme.titleHue}, ${themeHook.customTheme.titleSat}%, 65%)` }}>Preview</span>
                                    </div>
                                    
                                    <div className="p-4 bg-surface-100/50 dark:bg-surface-800/30 rounded-xl border border-surface-200/50 dark:border-white/5 space-y-4">
                                        {/* DYNAMIC PRESETS BASED ON WINDOW TINT */}
                                        <div className="flex items-center justify-between">
                                            {(() => {
                                                // PARSE DARK_BG TO GET HUE FOR COMPLEMENTARY COLORS
                                                const hexToHsl = (hex: string): [number, number, number] => {
                                                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                                    if (!result) return [210, 15, 50];
                                                    const r = parseInt(result[1], 16) / 255;
                                                    const g = parseInt(result[2], 16) / 255;
                                                    const b = parseInt(result[3], 16) / 255;
                                                    const max = Math.max(r, g, b), min = Math.min(r, g, b);
                                                    let h = 0, s = 0;
                                                    const l = (max + min) / 2;
                                                    if (max !== min) {
                                                        const d = max - min;
                                                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                                                        switch (max) {
                                                            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                                                            case g: h = ((b - r) / d + 2) / 6; break;
                                                            case b: h = ((r - g) / d + 4) / 6; break;
                                                        }
                                                    }
                                                    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
                                                };
                                                
                                                const [bgHue] = hexToHsl(themeHook.customTheme.darkBg || '#1d1d1d');
                                                
                                                // GENERATE COMPLEMENTARY COLORS FOR READABILITY
                                                const presets = [
                                                    { hue: (bgHue + 180) % 360, sat: 25, label: 'Complement' },      // OPPOSITE
                                                    { hue: (bgHue + 30) % 360, sat: 30, label: 'Warm' },             // WARM SHIFT
                                                    { hue: (bgHue + 210) % 360, sat: 35, label: 'Cool' },            // COOL COMPLEMENT
                                                    { hue: 210, sat: 15, label: 'Slate' },                           // CLASSIC SLATE
                                                    { hue: 45, sat: 20, label: 'Gold' },                             // WARM GOLD
                                                    { hue: 190, sat: 25, label: 'Cyan' },                            // TECH CYAN
                                                    { hue: 280, sat: 20, label: 'Lavender' },                        // SOFT LAVENDER
                                                ];
                                                
                                                return presets.map((preset) => (
                                                    <button
                                                        key={preset.label}
                                                        onClick={() => themeHook.setCustomTheme({ 
                                                            ...themeHook.customTheme, 
                                                            titleHue: preset.hue,
                                                            titleSat: preset.sat
                                                        })}
                                                        className={cn(
                                                            "w-7 h-7 rounded-lg transition-transform hover:scale-110 shadow-sm shrink-0",
                                                            themeHook.customTheme.titleHue === preset.hue && themeHook.customTheme.titleSat === preset.sat 
                                                                ? "ring-2 ring-offset-2 ring-offset-surface-50 dark:ring-offset-surface-900 scale-110" 
                                                                : ""
                                                        )}
                                                        style={{ 
                                                            backgroundColor: `hsl(${preset.hue}, ${preset.sat}%, 65%)`,
                                                            ...(themeHook.customTheme.titleHue === preset.hue && themeHook.customTheme.titleSat === preset.sat 
                                                                ? { '--tw-ring-color': `hsl(${themeHook.customTheme.titleHue}, ${themeHook.customTheme.titleSat}%, 65%)` } as React.CSSProperties
                                                                : {})
                                                        }}
                                                        title={preset.label}
                                                    />
                                                ));
                                            })()}
                                        </div>
                                        <div className="h-px bg-surface-200 dark:bg-surface-700/50 w-full" />
                                        {/* HUE SLIDER */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg shadow-sm border border-surface-200 dark:border-white/10" style={{ backgroundColor: `hsl(${themeHook.customTheme.titleHue}, ${themeHook.customTheme.titleSat}%, 65%)` }} />
                                            <div className="flex-1 space-y-2">
                                                <input 
                                                    type="range" min="0" max="360"
                                                    className="w-full h-1.5 cursor-pointer appearance-none rounded-full"
                                                    style={{ background: `linear-gradient(to right, hsl(0,40%,60%), hsl(60,40%,60%), hsl(120,40%,60%), hsl(180,40%,60%), hsl(240,40%,60%), hsl(300,40%,60%), hsl(360,40%,60%))` }}
                                                    value={themeHook.customTheme.titleHue}
                                                    onChange={(e) => themeHook.setCustomTheme({ ...themeHook.customTheme, titleHue: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                 </div>
            </div>
        </div>

        {/* COLUMN 2: INTERFACE PREFS */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-surface-500 dark:text-surface-400">
                <LayoutGrid className="w-5 h-5"/>
                <h3 className="font-semibold text-lg" style={{ color: themeHook.theme === 'custom' ? 'var(--title-color)' : undefined }}>Interface Preferences</h3>
            </div>
            
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-950 rounded-xl border border-surface-100 dark:border-surface-800">
                        <div>
                        <label className="text-sm font-medium text-surface-900 dark:text-surface-100 block">Recently Saved Limit</label>
                        <p className="text-xs text-surface-500 mt-1">Number of items to show in the "Recently Saved" sidebar view.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onLimitChange(Math.max(1, recentLimit - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 active:scale-95 transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input 
                              type="number" 
                              min="1" 
                              max={totalItems}
                              className="w-16 px-0 py-2 rounded-lg border-none bg-transparent text-center font-mono text-lg font-bold text-surface-900 dark:text-surface-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              value={recentLimit}
                              onChange={(e) => onLimitChange(Math.min(parseInt(e.target.value) || 1, totalItems))}
                          />
                          <button
                            onClick={() => onLimitChange(Math.min(totalItems, recentLimit + 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 active:scale-95 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                </div>
            </div>

        </div>

        {/* LAYOUT */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-surface-500 dark:text-surface-400">
                <LayoutGrid className="w-5 h-5"/>
                <h3 className="font-semibold text-lg" style={{ color: themeHook.theme === 'custom' ? 'var(--title-color)' : undefined }}>Layout</h3>
            </div>
            
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-950 rounded-xl border border-surface-100 dark:border-surface-800">
                    <div>
                        <label className="text-sm font-medium text-surface-900 dark:text-surface-100 block">Reset Layout</label>
                        <p className="text-xs text-surface-500 mt-1">Restore sidebar and panel sizes to their original dimensions.</p>
                    </div>
                    <button 
                        onClick={onResetLayout}
                        className="px-4 py-2 bg-surface-100 dark:bg-surface-800 hover:bg-red-500 hover:text-white dark:hover:text-white hover:border-red-600 text-surface-700 dark:text-surface-200 rounded-lg text-sm font-medium transition-all border border-surface-200 dark:border-surface-700 active:scale-95 flex items-center gap-2 group"
                    >
                        <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-180" />
                        Reset
                    </button>
                </div>
            </div>
        </div>

        {/* COLUMN 3: DANGER ZONE */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-red-200 dark:border-red-900/30 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-red-700 dark:text-red-400">
                <Trash2 className="w-5 h-5"/>
                <h3 className="font-semibold text-lg">Data Management</h3>
            </div>
            
            <div className="space-y-6">
                <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 flex items-center justify-between">
                        <div>
                        <label className="text-sm font-bold text-red-900 dark:text-red-400 block">Reset Database</label>
                        <p className="text-xs text-red-600 dark:text-red-300 mt-1">Permanently delete ALL items, tags, and collections.</p>
                        </div>
                        <button 
                            onClick={async () => {
                                setAlertConfig({
                                    isOpen: true,
                                    title: "Reset Database",
                                    description: "Are you sure you want to reset the database? This will permanently delete all items, tags, and collections. This action cannot be undone.",
                                    onConfirm: async () => {
                                        try {
                                            const res = await fetch('/api/nuke', { method: 'DELETE' });
                                            if (!res.ok) throw new Error("Server error");
                                            window.location.reload();
                                        } catch(e) {
                                            alert("Failed to reset database. Check console logs.");
                                            console.error(e);
                                        }
                                    }
                                });
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:!bg-red-600 hover:!text-white transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Nuke Database
                        </button>
                </div>
            </div>
        </div>

      </div>
    </div>
    </div>
    </>
  );
}
