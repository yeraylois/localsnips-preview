/*************************************************************
 *   Project : LocalSnips                                     *
 *   File    : page.tsx                                       *
 *   Purpose : NEURAL GRAPH VISUALIZATION OF SNIPPET DATA     *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";

// PREVIEW: Import mock data instead of SWR
import { MOCK_ITEMS } from "../../../lib/mock-data";

import dynamic from "next/dynamic";
import { ChevronLeft, Filter, Layers, Search, RotateCcw, MousePointer2, Code, FileCode, Folder } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../components/ThemeProvider";
import { detectTechnology, getTechIconUrl, TECH_ICONS } from "../../../lib/tech-icons";

// DYNAMIC IMPORT FOR FORCEGRAPH2D
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-surface-400 font-mono text-sm">Initializing Neural Map...</div>
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * RENDERS A 2D FORCE-DIRECTED GRAPH OF COLLECTIONS AND ITEMS.
 * VISUALIZES RELATIONSHIPS BETWEEN SNIPPETS IN A "NEURAL MAP".
 * SUPPORTS DRILL-DOWN, SEARCH, AND DOUBLE-CLICK NAVIGATION.
 */
export default function CollectionsGraphPage() {
  // PREVIEW: Use mock items instead of API
  const items = MOCK_ITEMS;
  const router = useRouter();
  const { theme, customTheme } = useTheme();
  
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [mounted, setMounted] = useState(false);
  const fgRef = useRef<any>(null);
  
  // STATE MANAGEMENT
  const [selectedRoot, setSelectedRoot] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoverNode, setHoverNode] = useState<any>(null);
  
  // ICON IMAGE CACHE
  const iconCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const [iconsLoaded, setIconsLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const updateDim = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
      updateDim();
      window.addEventListener("resize", updateDim);
      return () => window.removeEventListener("resize", updateDim);
    }
  }, []);

  const availableRoots = useMemo(() => {
     if (!items) return [];
     const roots = new Set<string>();
     items.forEach((item: any) => {
         if (item.collection) roots.add(item.collection.split("/")[0]);
     });
     return Array.from(roots).sort();
  }, [items]);

  useEffect(() => {
    if (!items) return;

    let filteredItems = items.filter((item: any) => !!item.collection);

    // FILTER BY ROOT (DRILL DOWN)
    if (selectedRoot !== "ALL") {
        filteredItems = filteredItems.filter((item: any) => item.collection.startsWith(selectedRoot));
    }

    // FILTER BY SEARCH
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filteredItems = filteredItems.filter((item: any) => 
            (item.title && item.title.toLowerCase().includes(q)) ||
            (item.collection && item.collection.toLowerCase().includes(q))
        );
    }

    const nodes = new Map<string, any>();
    const links: any[] = [];
    const rootId = selectedRoot === "ALL" ? "ROOT" : selectedRoot; 
    
    // CHECK LIGHT MODE PREFERENCE
    const prefersLight = typeof window !== "undefined" && !window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isLightMode = theme === "light" || 
      (theme === "system" && prefersLight) ||
      (theme === "custom" && prefersLight);
    
    // COLOR ADJUSTMENT HELPER
    const adjustColorForTheme = (hexColor: string): string => {
      if (!hexColor) return isLightMode ? "#52525b" : "#a1a1aa";
      
      // PARSE HEX COLOR (HANDLE BOTH #RGB AND #RRGGBB)
      let hex = hexColor.replace('#', '');
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      // CALCULATE RELATIVE LUMINANCE (0-1, WHERE 1 IS WHITE)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      if (isLightMode) {
        // IN LIGHT MODE, DARKEN COLORS THAT ARE TOO LIGHT (LUMINANCE > 0.7)
        if (luminance > 0.7) {
          const factor = 0.5; // DARKEN BY 50%
          const nr = Math.floor(r * factor);
          const ng = Math.floor(g * factor);
          const nb = Math.floor(b * factor);
          return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
        }
      } else {
        // DARK MODE: LIGHTEN COLORS THAT ARE TOO DARK
        if (luminance < 0.15) {
          const factor = 2.5; // LIGHTEN
          const nr = Math.min(255, Math.floor(r * factor) + 50);
          const ng = Math.min(255, Math.floor(g * factor) + 50);
          const nb = Math.min(255, Math.floor(b * factor) + 50);
          return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
        }
      }
      
      return hexColor; // RETURN ORIGINAL IF NO ADJUSTMENT NEEDED
    };
    
    // AESTHETIC PALETTE CONFIGURATION
    let COLORS = {
        root: theme === "dark" ? "#fafafa" : "#18181b",      // ZINC-50 / ZINC-900
        group: theme === "dark" ? "#a1a1aa" : "#71717a",     // ZINC-400 / ZINC-500
        item: theme === "dark" ? "#52525b" : "#d4d4d8",      // ZINC-600 / ZINC-300
        link: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"
    };

    if (theme === 'custom') {
        // USE CUSTOM HUES BUT KEEP RELATIVE LIGHTNESS/SATURATION LOGIC SIMILAR TO ZINC
        // ROOT: USE BRAND HUE
        COLORS.root = `hsl(${customTheme.brandHue}, ${customTheme.brandSat}%, 60%)`;
        
        // GROUP: USE SURFACE HUE, BUT LIGHTER/VISIBLE
        COLORS.group = `hsl(${customTheme.surfaceHue}, ${customTheme.surfaceSat}%, 50%)`;
        
        // ITEM: USE SURFACE HUE, DARKER/MUTED
        COLORS.item = `hsl(${customTheme.surfaceHue}, ${customTheme.surfaceSat}%, 30%)`;
        
        // LINKS: TINTED
        COLORS.link = `hsla(${customTheme.surfaceHue}, ${customTheme.surfaceSat}%, 70%, 0.2)`;
        
        // CHECK IF 'DARK MODE' PREFERENCE IS ACTIVE
        if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
             COLORS.root = `hsl(${customTheme.brandHue}, ${customTheme.brandSat}%, 60%)`;
             COLORS.group = `hsl(${customTheme.surfaceHue}, ${customTheme.surfaceSat}%, 60%)`;
             COLORS.item = `hsl(${customTheme.surfaceHue}, ${customTheme.surfaceSat}%, 40%)`; // DARKER THAN GROUP
             COLORS.link = `hsla(${customTheme.surfaceHue}, ${customTheme.surfaceSat}%, 80%, 0.2)`;
        } else {
             // LIGHT MODE CUSTOM
             COLORS.root = `hsl(${customTheme.brandHue}, ${customTheme.brandSat}%, 50%)`;
             COLORS.group = `hsl(${customTheme.surfaceHue}, ${customTheme.surfaceSat}%, 50%)`;
             COLORS.item = `hsl(${customTheme.surfaceHue}, ${customTheme.surfaceSat}%, 70%)`;
             COLORS.link = `hsla(${customTheme.surfaceHue}, ${customTheme.surfaceSat}%, 20%, 0.2)`;
        }
    }

    // ROOT NODE
    nodes.set(rootId, { 
        id: rootId, 
        name: selectedRoot === "ALL" ? "Universe" : selectedRoot.split("/").pop(), 
        val: 40, 
        color: COLORS.root, 
        type: "root",
        fullPath: selectedRoot === "ALL" ? "" : selectedRoot
    });

    filteredItems.forEach((item: any) => {
        const parts = item.collection.split("/").filter(Boolean);
        let parentId = rootId;
        let currentPath = "";

        // IF DRILLED DOWN, HANDLE PATH RELATIVE TO SELECTEDROOT
        // BUILDING THE FULL PATH USUALLY WORKS, LINK THE "TOP" OF THIS VIEW TO THE "ROOT"
        
        parts.forEach((part: string, index: number) => {
            currentPath = currentPath ? `${currentPath}/${part}` : part;
            
            // SKIP PARENT NODES IN DRILL-DOWN
            if (selectedRoot !== "ALL" && selectedRoot.startsWith(currentPath) && currentPath !== selectedRoot) {
                return;
            }

            if (!nodes.has(currentPath)) {
                // IF THIS IS THE SELECTED ROOT, WE ALREADY MADE IT ABOVE.
                if (currentPath === selectedRoot) {
                     // NO ACTION
                } else {
                    // DETECT GROUP TECHNOLOGY
                    const groupTechInfo = detectTechnology(currentPath);
                    
                    nodes.set(currentPath, {
                        id: currentPath,
                        name: part,
                        val: 15, 
                        color: groupTechInfo ? adjustColorForTheme(groupTechInfo.color) : COLORS.group,
                        type: "group",
                        fullPath: currentPath,
                        tech: groupTechInfo
                    });
                    
                    // LINK LOGIC
                    const source = (index === 0 || (selectedRoot !== "ALL" && index === parts.length - 1)) 
                                   ? rootId 
                                   : parentId;
                                   
                    let effectiveSource = parentId;
                    if (selectedRoot !== "ALL" && parentId === rootId) {
                         // FIRST CHILD NODE OF THE NEW ROOT
                         effectiveSource = rootId;
                    }
                    
                    // PREVENT SELF-LOOPS
                    if (effectiveSource !== currentPath) {
                        links.push({ source: effectiveSource, target: currentPath });
                    }
                }
            }
            parentId = currentPath;
        });

        // LEAF NODE (ITEM)
        const itemId = `ITEM_${item.id}`;
        
        // DETECT ITEM TECHNOLOGY
        const techInfo = detectTechnology(item.collection, item.tags);
        
        nodes.set(itemId, {
            id: itemId,
            name: item.title || "Untitled",
            val: 8,
            color: techInfo ? adjustColorForTheme(techInfo.color) : COLORS.item,
            type: "item",
            realId: item.id,
            collection: item.collection,
            tech: techInfo
        });
        
        // LINK ITEM TO ITS IMMEDIATE PARENT FOLDER
        const itemParent = item.collection === selectedRoot ? rootId : item.collection;
        
        if (nodes.has(itemParent)) {
             links.push({ source: itemParent, target: itemId });
        } else {
             links.push({ source: rootId, target: itemId });
        }
    });

    setGraphData({
      nodes: Array.from(nodes.values()),
      links
    });

  }, [items, selectedRoot, searchQuery, theme, customTheme]);

  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) || (theme === "custom" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  // CUSTOM BACKGROUND LOGIC
  let bgColor = isDark ? "#09090b" : "#ffffff";
  if (theme === 'custom' && isDark && customTheme.darkBg) {
      bgColor = customTheme.darkBg;
  }

  const linkColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
  const txtColor = isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)";

  // DOUBLE CLICK LOGIC
  const lastClick = useRef<{ id: string; time: number }>({ id: "", time: 0 });

  const handleNodeClick = useCallback((node: any) => {
      const now = Date.now();
      const isDoublClick = lastClick.current.id === node.id && (now - lastClick.current.time) < 300;
      
      if (isDoublClick) {
          // DOUBLE CLICK ACTION
          if (node.type === "group") {
             setSelectedRoot(node.fullPath);
          } else if (node.type === "root") {
             setSelectedRoot("ALL");
          }
          // RESET
          lastClick.current = { id: "", time: 0 };
      } else {
          // SINGLE CLICK ACTION
          lastClick.current = { id: node.id, time: now };
          
          if (node.type === "item") {
               router.push(`/?filter=collection&value=${encodeURIComponent(node.collection)}&selectedId=${node.realId}`);
          } else {
               // FOCUS CAMERA
               if (fgRef.current) {
                   fgRef.current.centerAt(node.x, node.y, 1000);
                   fgRef.current.zoom(4, 1000);
               }
          }
      }
  }, [router, selectedRoot]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans" style={{ backgroundColor: bgColor }}>
        
        {/* TOP BAR */}
        <div className="absolute top-0 left-0 right-0 z-50 p-6 pointer-events-none flex justify-center"> 
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-full shadow-2xl border border-zinc-200 dark:border-zinc-800 flex items-center p-2 gap-4 pointer-events-auto min-w-[600px] max-w-4xl transition-all hover:scale-[1.01]">
                
                 {/* 1. Back */}
                <Link 
                    href="/" 
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>

                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 mx-1"></div>

                {/* 2. Collection Navigator */}
                <div className="flex items-center gap-3 flex-1">
                     <div className="relative group flex-1">
                        <select 
                             value={selectedRoot}
                             onChange={(e) => setSelectedRoot(e.target.value)}
                             className="w-full appearance-none bg-transparent border-none text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:ring-0 cursor-pointer outline-none pr-8 truncate text-center"
                             style={{ textAlignLast: 'center' }}
                        >
                            <option value="ALL">Universe (All Collections)</option>
                            {availableRoots.length > 0 && <hr />}
                            {availableRoots.map(root => (
                                <option key={root} value={root}>{root}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-zinc-400">
                             <Filter className="w-3 h-3" />
                         </div>
                     </div>
                </div>

                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 mx-1"></div>

                {/* 3. Search */}
                <div className="relative w-64">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-zinc-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-100 dark:bg-zinc-950 border-none rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 placeholder-zinc-400 dark:placeholder-zinc-600 text-zinc-900 dark:text-zinc-100 transition-all"
                    />
                </div>
                
                {/* 4. Reset Button (if drilled down) */}
                {selectedRoot !== "ALL" && (
                    <button 
                         onClick={() => setSelectedRoot("ALL")}
                         className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                         data-tooltip="Reset View"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>

        {/* INSTRUCTION HINT */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-xs font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-widest opacity-60">
             <span className="flex items-center gap-2"><MousePointer2 className="w-3 h-3" /> Double Click to Drill Down</span>
        </div>

        {/* GRAPH RENDERER */}
        <ForceGraph2D
            ref={fgRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            backgroundColor={bgColor}
            
            // PHYSICS TWEAKS FOR "NOT STUCK TOGETHER"
            d3AlphaDecay={0.01}             // SLOWER DECAY = MORE MOVEMENT TO FIND SETTLING
            d3VelocityDecay={0.2}           // LESS FRICTION
            cooldownTicks={200}
            
            // FORCES
            onEngineStop={() => fgRef.current?.zoomToFit(400)}
            
            // NODE RENDERING
            nodeLabel="name"
            nodeRelSize={6}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
                // SAFETY: SKIP INVALID POSITIONS
                if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) {
                    return;
                }
                
                const label = node.name;
                const fontSize = 12 / globalScale;
                const isHover = hoverNode === node;
                const hasTech = node.tech && node.tech.slug;
                
                // CALCULATE NODE RADIUS (LARGER FOR TECH ICONS)
                const baseR = node.type === "item" ? 4 : (node.type === "root" ? 12 : 8);
                const r = hasTech ? baseR + 1 : baseR;
                
                // HOVER GLOW EFFECT
                if (isHover) {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, r + 4, 0, 2 * Math.PI, false);
                    ctx.fillStyle = node.color + '30'; // 30% opacity
                    ctx.fill();
                }
                
                // DRAW MAIN CIRCLE
                ctx.beginPath();
                ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
                
                // VALIDATE HEX COLOR
                const safeColor = (node.color && node.color.startsWith('#')) 
                    ? node.color 
                    : (node.color ? `#${node.color}` : '#6366f1');
                
                if (hasTech) {
                    // APPLY TECH GRADIENT FILL
                    try {
                        const gradient = ctx.createRadialGradient(node.x - r/3, node.y - r/3, 0, node.x, node.y, r);
                        gradient.addColorStop(0, safeColor);
                        gradient.addColorStop(1, safeColor + 'AA');
                        ctx.fillStyle = gradient;
                    } catch {
                        ctx.fillStyle = safeColor;
                    }
                } else {
                    ctx.fillStyle = safeColor;
                }
                
                if (isHover) {
                    ctx.shadowColor = safeColor;
                    ctx.shadowBlur = 20;
                }
                
                ctx.fill();
                ctx.shadowBlur = 0;
                
                // TECH ICON RENDERING
                if (hasTech && node.tech.slug) {
                    const iconUrl = getTechIconUrl(node.tech.slug, 'ffffff'); // White icon
                    const cacheKey = iconUrl;
                    
                    if (!iconCache.current.has(cacheKey)) {
                        // CACHE ICON IMAGE
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.src = iconUrl;
                        img.onload = () => {
                            iconCache.current.set(cacheKey, img);
                            // Force re-render by updating state
                            setIconsLoaded(prev => !prev);
                        };
                        iconCache.current.set(cacheKey, img); // Set immediately to prevent duplicate loads
                    } else {
                        const img = iconCache.current.get(cacheKey);
                        if (img && img.complete && img.naturalWidth) {
                            // DRAW ICON CENTERED
                            const iconSize = r * 1.2;
                            ctx.drawImage(
                                img,
                                node.x - iconSize / 2,
                                node.y - iconSize / 2,
                                iconSize,
                                iconSize
                            );
                        }
                    }
                } else if (node.type !== "item") {
                    // FALLBACK: Draw simple inner circle for non-tech groups
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, r * 0.4, 0, 2 * Math.PI, false);
                    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
                    ctx.fill();
                }

                // TEXT RENDERING
                const showText = node.type !== "item" || globalScale > 1.5 || isHover || searchQuery;
                
                if (showText) {
                    ctx.font = `${node.type === "root" ? "bold " : ""}${fontSize}px 'Inter', sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    // SHADOW/STROKE FOR READABILITY
                    ctx.lineWidth = 3 / globalScale;
                    ctx.strokeStyle = isDark ? '#000' : '#fff';
                    ctx.strokeText(label, node.x, node.y + (node.type === "item" ? 10 : 14));
                    
                    ctx.fillStyle = txtColor;
                    ctx.fillText(label, node.x, node.y + (node.type === "item" ? 10 : 14));
                }
            }}
            
            // INTERACTIVE EVENTS
            onNodeHover={(node) => {
                setHoverNode(node || null);
                document.body.style.cursor = node ? 'pointer' : 'default';
            }}
            onNodeClick={handleNodeClick}

            // SIMULATE DOUBLE CLICK VIA STATE (NATIVE HANDLER MISSING)
            onNodeDragEnd={node => {
                node.fx = node.x;
                node.fy = node.y;
            }}
            
            // LINK STYLE
            linkColor={() => linkColor}
            linkWidth={1.5}
            linkDirectionalParticles={selectedRoot !== "ALL" ? 2 : 0} // ONLY SHOW FLOW WHEN DRILLED DOWN
            linkDirectionalParticleWidth={2}
            
        />
        
        
    </div>
  );
}

