/*************************************************************
 *   Project : LocalSnips (Preview)                           *
 *   File    : PosterModal.tsx                                *
 *   Purpose : APPLE-STYLE PDF POSTER GENERATOR               *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import React, { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { X, Download, FileText, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, GripVertical, Eye, EyeOff, FileStack, File, Sparkles, Wand2, LayoutTemplate, Palette, RotateCcw, ZoomIn, ZoomOut, Check, Terminal, Type, Grid, Columns, ChevronsDown, ChevronsUp, FileX, Plus, Minus, Pencil, Maximize2, Trash2 } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Item } from "../lib/types";
import AlertModal from "./AlertModal";

// =============================================================================
// SECTION TYPES & CONSTRAINTS
// =============================================================================

interface PosterSection {
  id: string;
  type: 'header' | 'whatItIs' | 'whenToUse' | 'implementation' | 'stepByStep' | 'variants' | 'prerequisites' | 'warnings' | 'related' | 'footer';
  title: string;
  content: string;
  isCollapsed: boolean;
  isEnabled: boolean;
  order: number;
  minOrder: number;
  maxOrder: number;
}

interface PosterTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
}

type PosterTheme = 'academic' | 'journal' | 'modern' | 'terminal' | 'clean' | 'elegant' | 'cards' | 'focus' | 'bauhaus';
type PosterColor = 'blue' | 'purple' | 'green' | 'orange' | 'rose' | 'slate' | 'lime';

const ACCENT_COLORS: { id: PosterColor; value: string; label: string; }[] = [
  { id: 'blue', value: '#2563eb', label: 'Blue' },
  { id: 'purple', value: '#7c3aed', label: 'Purple' },
  { id: 'green', value: '#059669', label: 'Green' },
  { id: 'orange', value: '#ea580c', label: 'Orange' },
  { id: 'rose', value: '#e11d48', label: 'Rose' },
  { id: 'slate', value: '#334155', label: 'Slate' },
  { id: 'lime', value: '#4ade80', label: 'Terminal' },
];

const THEMES: { id: PosterTheme; name: string; description: string; fontFamily: string }[] = [
  { id: 'academic', name: 'Academic', description: 'Original Serif', fontFamily: '"Times New Roman", Times, serif' },
  { id: 'journal', name: 'Journal', description: 'Scientific 2-Col', fontFamily: 'Georgia, serif' },
  { id: 'modern', name: 'Modern', description: 'Bold Blocks', fontFamily: 'Inter, system-ui, sans-serif' },
  { id: 'terminal', name: 'Terminal', description: 'Dark Mode', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
  { id: 'clean', name: 'Clean', description: 'Apple Minimal', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { id: 'elegant', name: 'Elegant', description: 'Refined Serif', fontFamily: 'Optima, sans-serif' },
  { id: 'cards', name: 'Cards', description: 'iOS Grouped', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  { id: 'focus', name: 'Focus', description: 'Typographic', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' },
  { id: 'bauhaus', name: 'Bauhaus', description: 'Geometric', fontFamily: 'Futura, "Century Gothic", sans-serif' },
];

const POSTER_TEMPLATES: PosterTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Essentials only',
    sections: ['header', 'whatItIs', 'implementation', 'footer'],
  },
  {
    id: 'complete',
    name: 'Complete',
    description: 'Full details',
    sections: ['header', 'whatItIs', 'whenToUse', 'prerequisites', 'implementation', 'stepByStep', 'warnings', 'footer'],
  },
  {
    id: 'tutorial',
    name: 'Tutorial',
    description: 'Step-by-step',
    sections: ['header', 'whatItIs', 'prerequisites', 'stepByStep', 'variants', 'footer'],
  },
  {
    id: 'reference',
    name: 'Cheat Sheet',
    description: 'Dense layout',
    sections: ['header', 'implementation', 'variants', 'related', 'footer'],
  },
];

// ... (Parsing logic same)
const parseDocMarkdown = (docMarkdown: string): Record<string, string> => {
  const sections: Record<string, string> = {};
  if (!docMarkdown) return sections;
  const headingRegex = /^#\s+(.+)$/gm;
  const headings = ['What it is', 'When to use', 'Prerequisites', 'Snippet/Command', 'Step-by-step explanation', 'Variants', 'Risks/Warnings', 'Related'];
  headings.forEach((heading, idx) => {
    const startRegex = new RegExp(`^#\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'im');
    const match = docMarkdown.match(startRegex);
    if (match && match.index !== undefined) {
      const startIdx = match.index + match[0].length;
      let endIdx = docMarkdown.length;
      for (const nextHeading of headings.slice(idx + 1)) {
        const nextRegex = new RegExp(`^#\\s+${nextHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'im');
        const nextMatch = docMarkdown.slice(startIdx).match(nextRegex);
        if (nextMatch && nextMatch.index !== undefined) {
          endIdx = startIdx + nextMatch.index;
          break;
        }
      }
      sections[heading] = docMarkdown.slice(startIdx, endIdx).trim();
    }
  });
  return sections;
};

const createSections = (item: Item): PosterSection[] => {
  const parsed = parseDocMarkdown(item.doc_markdown || '');
  
  // Helper to create optional section
  const mkSec = (id: string, type: any, title: string, order: number, contentKey?: string): PosterSection => {
    const content = contentKey ? (parsed[contentKey] || '') : '';
    // If it's a core section (header, implementation, footer, whatItIs), it defaults to enabled.
    // Others default to enabled ONLY if they have content.
    const hasContent = content.length > 0;
    const isCore = ['header', 'whatItIs', 'implementation', 'footer'].includes(type);
    
    // EXCEPTION: 'whatItIs' comes from summary if parsing fails, so check that too for core.
    
    return {
       id, type, title, 
       content: content, 
       isCollapsed: true, 
       isEnabled: isCore || hasContent, 
       order, minOrder: isCore ? (type === 'header' ? 0 : (type==='footer'?99:1)) : 1, 
       maxOrder: isCore ? (['header','footer'].includes(type)?type==='footer'?99:0 : 10) : 10
    };
  };

  const sections: PosterSection[] = [
    { id: 'header', type: 'header', title: 'Header', content: item.title || item.original_filename || 'Untitled Snippet', isCollapsed: true, isEnabled: true, order: 0, minOrder: 0, maxOrder: 0 },
    
    // CORE CONTENT
    { id: 'whatItIs', type: 'whatItIs', title: 'What it is', content: parsed['What it is'] || item.summary || '', isCollapsed: true, isEnabled: true, order: 1, minOrder: 1, maxOrder: 10 },
    
    // OPTIONAL SECTIONS (ALWAYS CREATED, ENABLED IF CONTENT EXISTS)
    mkSec('whenToUse', 'whenToUse', 'When to use', 2, 'When to use'),
    mkSec('prerequisites', 'prerequisites', 'Prerequisites', 3, 'Prerequisites'),
    
    // CORE IMPLEMENTATION
    { id: 'implementation', type: 'implementation', title: 'Implementation', content: item.raw_content || '', isCollapsed: true, isEnabled: true, order: 4, minOrder: 1, maxOrder: 10 },
    
    // OPTIONAL SECTIONS
    mkSec('stepByStep', 'stepByStep', 'Step-by-step', 5, 'Step-by-step explanation'),
    mkSec('variants', 'variants', 'Variants', 6, 'Variants'),
    mkSec('warnings', 'warnings', 'Warnings', 7, 'Risks/Warnings'),
    mkSec('related', 'related', 'Related', 8, 'Related'),

    { id: 'footer', type: 'footer', title: 'Footer', content: '', isCollapsed: true, isEnabled: true, order: 99, minOrder: 99, maxOrder: 99 },
  ];
  
  // SPECIAL CHECK FOR WARNINGS/PREREQUISITES ARRAY FALLBACK
  const prereq = sections.find(s=>s.id==='prerequisites');
  if (prereq && !prereq.content && item.prerequisites?.length) { prereq.content = item.prerequisites.join('\n'); prereq.isEnabled = true; }
  
  const warn = sections.find(s=>s.id==='warnings');
  if (warn && !warn.content && item.warnings?.length) { warn.content = item.warnings.join('\n'); warn.isEnabled = true; }

  return sections.sort((a, b) => a.order - b.order);
};

interface PosterModalProps {
  open: boolean;
  onClose: () => void;
  item: Item;
}

// HELPER TO CONVERT HEX TO HSL FOR DYNAMIC BRANDING
const hexToHsl = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt("0x" + hex[1] + hex[1]);
      g = parseInt("0x" + hex[2] + hex[2]);
      b = parseInt("0x" + hex[3] + hex[3]);
    } else if (hex.length === 7) {
      r = parseInt("0x" + hex[1] + hex[2]);
      g = parseInt("0x" + hex[3] + hex[4]);
      b = parseInt("0x" + hex[5] + hex[6]);
    }
    r /= 255; g /= 255; b /= 255;
    const cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin;
    let h = 0, s = 0, l = 0;
    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return { h, s, l };
};

export default function PosterModal({ open, onClose, item }: PosterModalProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<PosterSection[]>(() => createSections(item));
  const [pageMode, setPageMode] = useState<'single' | 'multi'>('single');
  
  // CUSTOMIZATION STATES
  const [activeTheme, setActiveTheme] = useState<PosterTheme>('academic');
  const [activeColor, setActiveColor] = useState<PosterColor>('blue');

  // SYNC BRAND VARIABLES FOR ACCENT ELEMENTS (SURFACE INHERITS NATURALLY FROM :ROOT FOR WINDOW TINT)
  useEffect(() => {
    if (modalRef.current) {
        const color = ACCENT_COLORS.find(c => c.id === activeColor) || ACCENT_COLORS[0];
        const hsl = hexToHsl(color.value);
        modalRef.current.style.setProperty('--brand-h', hsl.h.toString());
        modalRef.current.style.setProperty('--brand-s', `${hsl.s}%`);
    }
  }, [activeColor]);

  // UI STATES
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [showCustomEdit, setShowCustomEdit] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [hideDisabledSections, setHideDisabledSections] = useState(false);
  const [hoveredHeaderIcon, setHoveredHeaderIcon] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(0.75);
  const [manualZoom, setManualZoom] = useState(false);


  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [posterTitle, setPosterTitle] = useState(item.title || item.original_filename || 'Untitled');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

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

  // MOBILE STATE
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePreviewExpanded, setMobilePreviewExpanded] = useState(false);

  // DYNAMIC AUTO-ZOOM
  useEffect(() => {
    if (!containerRef.current || !posterRef.current) return;
    
    const updateZoom = () => {
        if (isGenerating) return;
        if (manualZoom) return; // PREVENT AUTO-ZOOM FIGHTING MANUAL CONTROL
        
        if (!containerRef.current || !posterRef.current) return;
        const container = containerRef.current.getBoundingClientRect();
        const contentW = 794; 
        const contentH = posterRef.current.scrollHeight;
        
        const padding = 96; 
        const availableW = container.width - padding;
        const availableH = container.height - padding;
        
        const scaleW = availableW / contentW;
        const scaleH = availableH / contentH;
        
        // ALWAYS FIT PAGE (ENSURE ENTIRE VIEW IS VISIBLE BY DEFAULT)
        setZoomLevel(Math.min(1, Math.min(scaleW, scaleH)));
    };

    const observer = new ResizeObserver(updateZoom);
    observer.observe(containerRef.current);
    if (posterRef.current) observer.observe(posterRef.current);
    
    updateZoom();
    window.addEventListener('resize', updateZoom); // HELPER FOR WINDOW RESIZE ENSURING
    return () => {
        observer.disconnect();
        window.removeEventListener('resize', updateZoom);
    };
  }, [pageMode, sections, activeTheme, isMobile, manualZoom, isGenerating]);

  useEffect(() => {
    const checkMobile = () => { setIsMobile(window.innerWidth < 1024); };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // BODY SCROLL LOCK (IOS SAFARI COMPATIBLE)
    if (open) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.documentElement.style.overflow = 'hidden';
    }
    
    return () => {
        window.removeEventListener('resize', checkMobile);
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.documentElement.style.overflow = '';
    };
  }, [open]);

  const handleReset = () => {
    setAlertConfig({
        isOpen: true,
        title: "Reset Content",
        description: "This will revert the poster to its original generated state. All custom sections and edits will be lost.",
        confirmText: "Reset Poster",
        isDestructive: true,
        Icon: FileX,
        onConfirm: () => {
            setSections(createSections(item));
            setPosterTitle(item.title || item.original_filename || 'Untitled');
            setActiveTheme('academic');
            setActiveColor('blue');
            setPageMode('single');
            setZoomLevel(isMobile ? 0.4 : 0.75);
            setAlertConfig(prev => ({ ...prev, isOpen: false }));
        }
    });
  };

  const sortedSections = useMemo(() => [...sections].sort((a, b) => a.order - b.order), [sections]);
  const enabledSections = useMemo(() => sortedSections.filter(s => s.isEnabled), [sortedSections]);
  const currentColor = ACCENT_COLORS.find(c => c.id === activeColor) || ACCENT_COLORS[0];
  const currentThemeObj = THEMES.find(t => t.id === activeTheme) || THEMES[0];

  // PAGINATION LOGIC
  const [sectionHeights, setSectionHeights] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  
  // RESET PAGE WHEN MODE/SECTIONS CHANGE
  useEffect(() => { setCurrentPage(0); }, [pageMode, sections]);

  const pages = useMemo(() => {
    if (pageMode === 'single') return [enabledSections];
    
    // A4 dimensions: 297mm height = 1123px at 96dpi
    // USABLE HEIGHT ADJUSTED FOR PADDING AND SECTION GAPS
    const USABLE_HEIGHT = 1050;
    const SECTION_GAP = 24; // GAP BETWEEN SECTIONS
    
    const result: PosterSection[][] = [];
    let currentPageArr: PosterSection[] = [];
    let currentHeight = 0;
    
    enabledSections.forEach(section => {
        const h = sectionHeights[section.id] || 150; 
        const totalHeight = currentPageArr.length > 0 ? currentHeight + SECTION_GAP + h : h;
        
        if (totalHeight > USABLE_HEIGHT && currentPageArr.length > 0) {
            result.push(currentPageArr);
            currentPageArr = [section];
            currentHeight = h;
        } else {
            currentPageArr.push(section);
            currentHeight = totalHeight;
        }
    });
    
    if (currentPageArr.length > 0) result.push(currentPageArr);
    return result.length > 0 ? result : [enabledSections];
  }, [enabledSections, sectionHeights, pageMode]);

  // SAFE GUARD: RESET CURRENTPAGE IF PAGES SHRINK
  useEffect(() => {
      if (currentPage >= pages.length) {
          setCurrentPage(Math.max(0, pages.length - 1));
      }
  }, [pages.length, currentPage]);

  // MEASURE SECTIONS - TRACK CONTENT CHANGES FOR DYNAMIC REPAGINATION
  useEffect(() => {
     const timer = setTimeout(() => {
         const updates: Record<string, number> = {};
         let changed = false;
         enabledSections.forEach(section => {
             const el = document.querySelector(`[data-measure-id="${section.id}"]`);
             if (el) {
                 const h = el.getBoundingClientRect().height;
                 if (Math.abs((sectionHeights[section.id] || 0) - h) > 2) {
                     updates[section.id] = h;
                     changed = true;
                 }
             }
         });
         if (changed) setSectionHeights(prev => ({ ...prev, ...updates }));
     }, 100);
     return () => clearTimeout(timer);
  }, [enabledSections, posterTitle, activeTheme, currentThemeObj, pageMode, sections]);

  // DRAG HANDLERS ...
  const handleDragStart = (e: React.DragEvent, id: string) => { setDraggedId(id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', id); };
  const handleDragOver = (e: React.DragEvent, id: string) => { 
    e.preventDefault(); 
    // PROTECT FOOTER: BLOCK DROPPING ON FOOTER
    const target = sections.find(s => s.id === id);
    if (target?.type === 'footer') {
        setDragOverId(null);
        return;
    }
    if (id !== draggedId) setDragOverId(id); 
  };
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    // PROTECT FOOTER: BLOCK DROPPING ONTO/AFTER FOOTER
    const targetSection = sections.find(s => s.id === targetId);
    if (targetSection?.type === 'footer') {
        setDraggedId(null);
        setDragOverId(null);
        return;
    }

    if (!draggedId || draggedId === targetId) { setDraggedId(null); setDragOverId(null); return; }
    setSections(prev => {
      const draggedSection = prev.find(s => s.id === draggedId);
      const targetSection = prev.find(s => s.id === targetId);
      if (!draggedSection || !targetSection) return prev;
      return prev.map(s => {
        if (s.id === draggedId) return { ...s, order: targetSection.order };
        if (s.id === targetId) return { ...s, order: draggedSection.order };
        return s;
      });
    });
    setDraggedId(null); setDragOverId(null);
  };

  // CLEAN UP DRAG STATE WHEN DRAG ENDS (ANYWHERE)
  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const toggleSection = (id: string) => { setSections(prev => prev.map(s => s.id === id ? { ...s, isCollapsed: !s.isCollapsed } : s)); setActiveSectionId(id); };
  const toggleEnabled = (id: string) => { setSections(prev => prev.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s)); };
  const updateContent = (id: string, content: string) => { setSections(prev => prev.map(s => s.id === id ? { ...s, content } : s)); };
  const applyTemplate = (template: PosterTemplate) => {
    setActiveSectionId(null); // CLEAR SELECTION TO PREVENT AUTO-MARKING
    setSections(prev => {
        const nextSections: PosterSection[] = [];
        const usedIds = new Set<string>();

        // 1. PROCESS TEMPLATE SECTIONS (RESTORE/ENABLE/ORDER)
        template.sections.forEach((templateId, index) => {
            // TRY FINDING EXACT MATCH BY ID FIRST
            let match = prev.find(s => s.id === templateId);
            
            // IF NOT FOUND, TRY FINDING BY TYPE FOR CORE MATCHING
            if (!match) {
                 match = prev.find(s => s.type === templateId && !usedIds.has(s.id));
            }

            if (match) {
                nextSections.push({
                    ...match,
                    isEnabled: true,
                    order: index,
                    isCollapsed: true // KEEP COLLAPSED BY DEFAULT TO AVOID CLUTTER
                });
                usedIds.add(match.id);
            } else {
                // RE-CREATE MISSING SECTION
                const defaults: Partial<PosterSection> = {
                    title: templateId.charAt(0).toUpperCase() + templateId.slice(1).replace(/([A-Z])/g, ' $1').trim(),
                    content: '',
                    isCollapsed: true, // CREATE COLLAPSED
                    minOrder: 1, 
                    maxOrder: 10
                };

                if (templateId === 'header') { defaults.title = 'Header'; defaults.content = item.title || item.original_filename || 'Untitled'; defaults.minOrder=0; defaults.maxOrder=0; }
                else if (templateId === 'footer') { defaults.title = 'Footer'; defaults.minOrder=99; defaults.maxOrder=99; }
                else if (templateId === 'whatItIs') { defaults.title = 'What it is'; defaults.content = item.summary || ''; }
                
                nextSections.push({
                    id: templateId,
                    type: templateId as any,
                    title: defaults.title!,
                    content: defaults.content || '',
                    isCollapsed: true,
                    isEnabled: true,
                    order: index,
                    minOrder: defaults.minOrder || 1,
                    maxOrder: defaults.maxOrder || 10
                });
            }
        });

        // 2. PROCESS REMAINING SECTIONS (DISABLE THEM AND MOVE TO END)
        prev.forEach(s => {
            if (!usedIds.has(s.id)) {
                nextSections.push({
                    ...s,
                    isEnabled: false,
                    isCollapsed: true, // COLLAPSE DISABLED ONES TOO
                    order: template.sections.length + (s.order || 0)
                });
            }
        });

        return nextSections.sort((a, b) => a.order - b.order);
    });
  };

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  useEffect(() => {
    // IF WE JUST ADDED A SECTION AND IT'S EDITING, FOCUS THE INPUT
    if (editingSectionId) {
        // TIMEOUT TO ALLOW RENDER
        setTimeout(() => {
            const el = document.getElementById(`title-edit-${editingSectionId}`);
            if(el) el.focus();
        }, 50);
    }
  }, [editingSectionId]);
  const generatePdf = async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);
    
    // WAIT FOR RE-RENDER WITH ALL PAGES VISIBLE (ISGENERATING = TRUE RENDERS ALL PAGES)
    await new Promise(r => setTimeout(r, 500));
    
    try {
      const pageElements = posterRef.current.querySelectorAll('.poster-page');
      if (!pageElements.length) throw new Error("No pages found");

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;
      const bgColor = activeTheme === 'terminal' ? '#1e1e1e' : (activeTheme === 'cards' ? '#f9fafb' : '#ffffff');

      for (let i = 0; i < pageElements.length; i++) {
        if (i > 0) pdf.addPage();
        
        const page = pageElements[i] as HTMLElement;
        
        // GET NATURAL DIMENSIONS FOR SINGLE PAGE MODE
        const captureOptions = {
          quality: 1.0, 
          pixelRatio: 3, 
          backgroundColor: bgColor,
        };
        
        // FOR MULTI-PAGE, FORCE A4 DIMENSIONS; FOR SINGLE PAGE, CAPTURE NATURAL SIZE
        if (pageMode === 'multi') {
          Object.assign(captureOptions, { width: 793, height: 1122 });
        }
        
        const blob = await htmlToImage.toPng(page, captureOptions);
        
        const imgProps = pdf.getImageProperties(blob);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        if (pageMode === 'single') {
          // SCALE TO FIT ENTIRE CONTENT INTO ONE A4 PAGE
          if (imgHeight > pdfHeight) {
            // CONTENT IS TALLER THAN A4, SCALE DOWN TO FIT
            const scaleFactor = pdfHeight / imgHeight;
            const scaledWidth = pdfWidth * scaleFactor;
            const xOffset = (pdfWidth - scaledWidth) / 2; // CENTER HORIZONTALLY
            pdf.addImage(blob, 'PNG', xOffset, 0, scaledWidth, pdfHeight);
          } else {
            // CONTENT FITS, USE NATURAL SIZE
            pdf.addImage(blob, 'PNG', 0, 0, pdfWidth, imgHeight);
          }
        } else {
          // MULTI-PAGE: FIXED A4 DIMENSIONS
          pdf.addImage(blob, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }
      }
      
      pdf.save(`${posterTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_poster.pdf`);
    } catch (err) { 
      console.error('PDF error', err); 
    } finally { 
      setIsGenerating(false); 
    }
  };

  if (!open) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-[60] flex flex-col lg:flex-row bg-surface-950/40 backdrop-blur-md animate-fade-in overscroll-none">
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
      
      {/* LEFT PANEL: EDITOR */}
      <div className="w-full lg:w-[440px] bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-3xl border-r border-surface-200/50 dark:border-white/5 flex flex-col h-[calc(100%-40px)] lg:h-full shadow-2xl z-20 order-2 lg:order-1">
        
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-surface-200/50 dark:border-white/5 flex justify-between items-center bg-surface-50/40 dark:bg-surface-900/40 backdrop-blur-xl z-30 transition-colors shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-gradient-to-br from-brand-500/10 to-brand-600/10 text-brand-600 dark:text-brand-400">
                <FileText className="w-5 h-5" strokeWidth={2} />
             </div>
             <div>
                <h2 className="text-base font-bold text-brand-600 dark:text-brand-400 tracking-widest uppercase">Poster Editor</h2>
                <p className="text-[11px] font-medium text-surface-500 dark:text-surface-400">Customize layout</p>
             </div>
          </div>
          
          <div className="flex gap-1.5">
             <button
                onClick={() => { const newState = !showTemplates; setShowTemplates(newState); setShowAppearance(false); setShowCustomEdit(false); if(!newState) setHoveredHeaderIcon(null); }}
                onMouseEnter={() => setHoveredHeaderIcon('templates')}
                onMouseLeave={() => setHoveredHeaderIcon(null)}
                className={`tooltip-surface p-2 rounded-lg transition-all border ${showTemplates ? 'bg-surface-100 dark:bg-white/10 border-surface-200 dark:border-white/10 shadow-sm' : 'border-transparent hover:bg-surface-100 dark:hover:bg-white/5 text-surface-500'}`}
                style={{ color: showTemplates || hoveredHeaderIcon === 'templates' ? 'var(--brand-500)' : undefined }}
                data-tooltip="Layout Templates"
            >
                {showTemplates ? <X className="w-5 h-5" /> : <LayoutTemplate className="w-5 h-5" strokeWidth={1.5} />}
            </button>
            <button
                onClick={() => { const newState = !showAppearance; setShowAppearance(newState); setShowTemplates(false); setShowCustomEdit(false); if(!newState) setHoveredHeaderIcon(null); }}
                onMouseEnter={() => setHoveredHeaderIcon('appearance')}
                onMouseLeave={() => setHoveredHeaderIcon(null)}
                className={`tooltip-surface p-2 rounded-lg transition-all border ${showAppearance ? 'bg-surface-100 dark:bg-white/10 border-surface-200 dark:border-white/10 shadow-sm' : 'border-transparent hover:bg-surface-100 dark:hover:bg-white/5 text-surface-500'}`}
                style={{ color: showAppearance || hoveredHeaderIcon === 'appearance' ? 'var(--brand-500)' : undefined }}
                data-tooltip="Theme & Colors"
            >
                {showAppearance ? <X className="w-5 h-5" /> : <Palette className="w-5 h-5" strokeWidth={1.5} />}
            </button>
            <button
                onClick={() => { const newState = !showCustomEdit; setShowCustomEdit(newState); setShowTemplates(false); setShowAppearance(false); if(!newState) setHoveredHeaderIcon(null); }}
                onMouseEnter={() => setHoveredHeaderIcon('custom')}
                onMouseLeave={() => setHoveredHeaderIcon(null)}
                className={`tooltip-surface p-2 rounded-lg transition-all border ${showCustomEdit ? 'bg-surface-100 dark:bg-white/10 border-surface-200 dark:border-white/10 shadow-sm' : 'border-transparent hover:bg-surface-100 dark:hover:bg-white/5 text-surface-500'}`}
                style={{ color: showCustomEdit || hoveredHeaderIcon === 'custom' ? 'var(--brand-500)' : undefined }}
                data-tooltip="Custom Tools"
            >
                {showCustomEdit ? <X className="w-5 h-5" /> : <Wand2 className="w-5 h-5" strokeWidth={1.5} />}
            </button>
            {isMobile && (
                <button
                    onClick={onClose}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 ml-2 text-surface-500 active:scale-95 transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
          </div>
        </div>

        {/* MENUS */}
        <div className="flex-col relative z-20 bg-surface-50/50 dark:bg-surface-900/50 border-b border-surface-200/50 dark:border-white/5 transition-all duration-300 overflow-hidden shadow-sm" 
             style={{ 
                 maxHeight: showTemplates || showAppearance || showCustomEdit ? '400px' : '0px',
                 opacity: showTemplates || showAppearance || showCustomEdit ? 1 : 0
             }}>
             
             {/* TEMPLATES */}
            {showTemplates && (
            <div className="px-5 py-4 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                {POSTER_TEMPLATES.map(template => {
                    const sectionsInTemplate = template.sections;
                    // Strict match: 
                    // 1. All enabled sections must be in the template.
                    // 2. All sections in the template must be enabled (if available).
                    // 3. CRITICAL: If the document physically lacks a section required by the template, 
                    //    this template cannot be "fully" active, so we don't mark it as selected.
                    //    This prevents "Complete" from being selected on sparse docs where it degenerates to "Minimal".
                    
                    const availableIds = sections.map(s => s.id);
                    const templateIdsAreAvailable = sectionsInTemplate.every(id => availableIds.includes(id));
                    
                    const isMatch = templateIdsAreAvailable && 
                                    enabledSections.length === sectionsInTemplate.length &&
                                    sectionsInTemplate.every(id => enabledSections.some(s => s.id === id));

                    return (
                    <button
                        key={template.id}
                        onClick={() => applyTemplate(template)}
                        onMouseEnter={() => setHoveredTemplate(template.id)}
                        onMouseLeave={() => setHoveredTemplate(null)}
                        className={`group relative p-3 rounded-xl border transition-all duration-300 overflow-hidden text-left ${isMatch ? 'shadow-md scale-[1.02]' : 'border-surface-200 dark:border-white/5 bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-surface-300 hover:text-brand-600 dark:hover:text-brand-400'}`}
                        style={isMatch ? { borderColor: 'var(--brand-500)', backgroundColor: 'var(--brand-500)', color: 'white' } : {}}
                    >
                        <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${!isMatch ? 'bg-surface-300 group-hover:bg-brand-600 dark:group-hover:bg-brand-400' : ''}`} style={{ backgroundColor: isMatch ? 'white' : undefined }} />
                        <span className={`text-xs font-bold transition-colors`} style={{ color: isMatch ? 'white' : undefined }}>{template.name}</span>
                        </div>
                        <p className={`text-[10px] leading-tight transition-colors ${isMatch ? 'text-surface-500 dark:text-surface-400' : 'text-surface-500 dark:text-surface-400 group-hover:text-brand-600 dark:group-hover:text-brand-400'}`} style={{ color: isMatch ? 'white' : undefined }}>{template.description}</p>
                    </button>
                    );
                })}

            </div>
            )}
            
            {/* CUSTOM TOOLS PANEL */}
            {showCustomEdit && (
                <div className="px-5 py-5 space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
                     <div className="flex justify-between items-center pb-2 border-b border-surface-200/50 dark:border-white/5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-surface-400">Custom Tools</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setSections(prev => prev.map(s => ({...s, isCollapsed: true})))} className="tooltip-surface p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-white/5 text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" data-tooltip="Collapse All"><ChevronsUp className="w-4 h-4" /></button>
                            <button onClick={() => setSections(prev => prev.map(s => ({...s, isCollapsed: false})))} className="tooltip-surface p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-white/5 text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" data-tooltip="Expand All"><ChevronsDown className="w-4 h-4" /></button>
                        </div>
                     </div>
                     
                     <div className="space-y-3">
                        {/* CLEAN VIEW TOGGLE */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50/50 dark:bg-surface-900/30 border border-surface-200/50 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${hideDisabledSections ? 'bg-brand-500/10 text-brand-600' : 'bg-surface-200/50 text-surface-400'}`}>
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-surface-900 dark:text-surface-100">Clean View</h4>
                                    <p className="text-[10px] text-surface-500">Hide unused sections</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setHideDisabledSections(!hideDisabledSections)}
                                className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${hideDisabledSections ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 shadow-sm ${hideDisabledSections ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {/* RESET CONTENT */}

                        {/* MANAGE SECTIONS */}
                         <div className="grid grid-cols-3 gap-2">
                            <button 
                                onClick={() => {
                                    const newId = `custom-${Date.now()}`;
                                    const newSection: PosterSection = {
                                        id: newId,
                                        type: 'implementation',
                                        title: 'Section',
                                        content: '',
                                        isCollapsed: false,
                                        isEnabled: true,
                                        order: sections.length,
                                        minOrder: 1,
                                        maxOrder: 10
                                    };
                                    setSections(prev => [...prev, newSection]);
                                    setEditingSectionId(newId);
                                }}
                                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-50 dark:bg-white/5 border border-surface-200/50 dark:border-white/5 transition-all group shadow-sm active:scale-[0.98] hover:bg-surface-100 dark:hover:bg-white/10 hover:text-brand-600 dark:hover:text-brand-400"
                            >
                                <div className="p-1.5 rounded-lg bg-surface-100 dark:bg-white/5 text-surface-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-semibold text-surface-600 dark:text-surface-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">Add Section</span>
                            </button>

                            <button 
                                onClick={() => {
                                    const newId = `header-${Date.now()}`;
                                    const newSection: PosterSection = {
                                        id: newId,
                                        type: 'header',
                                        title: 'Header',
                                        content: item.title || item.original_filename || 'Untitled Snippet',
                                        isCollapsed: false,
                                        isEnabled: true,
                                        order: 0,
                                        minOrder: 0,
                                        maxOrder: 0
                                    };
                                    setSections(prev => [newSection, ...prev]);
                                }}
                                disabled={sections.some(s => s.type === 'header')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border border-surface-200/50 dark:border-white/5 transition-all shadow-sm active:scale-[0.98] ${sections.some(s => s.type === 'header') ? 'bg-surface-100 dark:bg-white/5 opacity-50 cursor-not-allowed' : 'bg-surface-50 dark:bg-white/5 group hover:bg-surface-100 dark:hover:bg-white/10 hover:text-brand-600 dark:hover:text-brand-400'}`}
                            >
                                <div className={`p-1.5 rounded-lg bg-surface-100 dark:bg-white/5 text-surface-400 ${!sections.some(s => s.type === 'header') && 'group-hover:text-brand-600 dark:group-hover:text-brand-400'} transition-colors`}>
                                    <Type className="w-4 h-4" />
                                </div>
                                <span className={`text-xs font-semibold text-surface-600 dark:text-surface-300 ${!sections.some(s => s.type === 'header') && 'group-hover:text-brand-600 dark:group-hover:text-brand-400'}`}>Add Header</span>
                            </button>

                            <button 
                                onClick={() => {
                                    const newId = `footer-${Date.now()}`;
                                    const newSection: PosterSection = {
                                        id: newId,
                                        type: 'footer',
                                        title: 'Footer',
                                        content: '',
                                        isCollapsed: false,
                                        isEnabled: true,
                                        order: 99,
                                        minOrder: 99,
                                        maxOrder: 99
                                    };
                                    setSections(prev => [...prev, newSection]);
                                }}
                                disabled={sections.some(s => s.type === 'footer')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border border-surface-200/50 dark:border-white/5 transition-all shadow-sm active:scale-[0.98] ${sections.some(s => s.type === 'footer') ? 'bg-surface-100 dark:bg-white/5 opacity-50 cursor-not-allowed' : 'bg-surface-50 dark:bg-white/5 group hover:bg-surface-100 dark:hover:bg-white/10 hover:text-brand-600 dark:hover:text-brand-400'}`}
                            >
                                <div className={`p-1.5 rounded-lg bg-surface-100 dark:bg-white/5 text-surface-400 ${!sections.some(s => s.type === 'footer') && 'group-hover:text-brand-600 dark:group-hover:text-brand-400'} transition-colors`}>
                                    <FileStack className="w-4 h-4" />
                                </div>
                                <span className={`text-xs font-semibold text-surface-600 dark:text-surface-300 ${!sections.some(s => s.type === 'footer') && 'group-hover:text-brand-600 dark:group-hover:text-brand-400'}`}>Add Footer</span>
                            </button>
                        </div>

                     </div>
                </div>
            )}

            {/* APPEARANCE */}
            {showAppearance && (
            <div className="px-5 py-5 space-y-5 animate-in fade-in slide-in-from-top-1 duration-300">
                {/* THEMES */}
                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-surface-400 pl-1">Visual Theme</label>
                    <div className="grid grid-cols-3 gap-2">
                        {THEMES.map(theme => {
                            const isActive = activeTheme === theme.id;
                            return (
                                <button
                                    key={theme.id}
                                    onClick={() => setActiveTheme(theme.id)}
                                    className={`px-2 py-2.5 rounded-xl text-xs border transition-all ${isActive ? 'font-semibold shadow-sm scale-[1.02]' : 'bg-white/50 dark:bg-white/5 border-transparent text-surface-600 dark:text-surface-400 hover:bg-white border-transparent hover:text-brand-600 dark:hover:text-brand-400'}`}
                                    style={isActive ? { borderColor: 'var(--brand-500)', backgroundColor: 'var(--brand-500)', color: 'white' } : {}}
                                >
                                    <div className="mb-0.5">{theme.name}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* COLORS */}
                <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-surface-400 pl-1">Poster Accent</label>
                    <div className="flex gap-3 px-1">
                        {ACCENT_COLORS.filter(c => c.id !== 'lime' || activeTheme === 'terminal').map(color => (
                            <button
                                key={color.id}
                                onClick={() => setActiveColor(color.id)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-sm ${activeColor === color.id ? 'scale-110 ring-2 ring-brand-500 ring-offset-2 ring-offset-surface-50 dark:ring-offset-surface-900' : 'hover:scale-105'}`}
                                style={{ backgroundColor: color.value }}
                                title={color.label}
                            >
                                {activeColor === color.id && <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            )}
        </div>

        {/* PAGE MODE */}
        <div className="px-5 py-4 pb-2 shrink-0">
          <div className="flex p-0.5 bg-surface-200/40 dark:bg-white/5 rounded-lg border border-surface-200/50 dark:border-white/5">
            {[ { id: 'single', label: 'Single Page' }, { id: 'multi', label: 'Multi-Page' } ].map(mode => (
              <button
                key={mode.id}
                onClick={() => { setPageMode(mode.id as any); setManualZoom(false); }}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-[6px] text-xs font-semibold transition-all duration-300 ${pageMode === mode.id ? 'shadow-sm' : 'text-surface-500 hover:text-brand-600 dark:hover:text-brand-400'}`}
                style={pageMode === mode.id ? { 
                    backgroundColor: 'var(--brand-500)', 
                    color: 'white',
                    borderColor: 'var(--brand-600)',
                    borderWidth: '1px'
                } : { border: '1px solid transparent' }}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* SECTIONS */}
        <div className="flex-1 overflow-y-auto px-5 pb-16 space-y-3 scrollbar-hide">
          {sortedSections.filter(s => !hideDisabledSections || s.isEnabled).map((section) => {
             const isActive = !section.isCollapsed;
             const isEnabled = section.isEnabled;
             return (
              <div
                key={section.id}
                draggable={section.minOrder !== section.maxOrder}
                onDragStart={(e) => handleDragStart(e, section.id)}
                onDragOver={(e) => handleDragOver(e, section.id)}
                onDrop={(e) => handleDrop(e, section.id)}
                onDragEnd={handleDragEnd}
                onClick={() => {
                    setActiveSectionId(section.id);
                    toggleSection(section.id);
                }}
                className={`group rounded-xl border transition-all duration-200 ${dragOverId === section.id ? 'scale-[1.02] shadow-xl z-20 border-brand-500' : draggedId === section.id ? 'opacity-30 border-dashed border-surface-300 scale-95' : isActive ? 'bg-surface-100/80 dark:bg-surface-800/80 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : isEnabled ? 'bg-surface-50/50 dark:bg-surface-900/50 hover:bg-surface-100 dark:hover:bg-white/10 hover:text-brand-600 dark:hover:text-brand-400 border-transparent' : 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-surface-100 dark:hover:bg-white/10'}`}
                style={isActive ? { borderColor: currentColor.value } : {}}
              >
                <div className="flex items-center gap-3 p-3">
                  <div className={`text-surface-400 dark:text-surface-500 transition-colors ${section.minOrder !== section.maxOrder ? 'cursor-grab active:cursor-grabbing hover:text-surface-600 dark:hover:text-surface-300' : 'opacity-0 pointer-events-none'}`}>
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleEnabled(section.id); }} className={`p-1.5 rounded-lg transition-all ${section.isEnabled ? 'bg-surface-100 dark:bg-white/5 text-brand-600 dark:text-brand-400' : 'bg-surface-100 dark:bg-white/5 text-surface-400 hover:text-surface-600'}`}>
                    {section.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  {editingSectionId === section.id ? (
                    <input
                        id={`title-edit-${section.id}`}
                        value={section.title}
                        onChange={(e) => setSections(prev => prev.map(s => s.id === section.id ? {...s, title: e.target.value} : s))}
                        onBlur={() => setEditingSectionId(null)}
                        onKeyDown={(e) => { if(e.key === 'Enter') setEditingSectionId(null); }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 text-base md:text-sm font-semibold tracking-tight bg-transparent border-b border-brand-500 focus:outline-none text-surface-900 dark:text-surface-100 p-0 rounded-none leading-relaxed"
                        style={{ fontFamily: currentThemeObj.fontFamily }}
                    />
                  ) : (
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                        <span className={`text-xs font-semibold tracking-tight truncate transition-colors ${section.isEnabled ? 'text-brand-700 dark:text-brand-300 group-hover:text-brand-600 dark:group-hover:text-brand-400' : 'text-surface-400 line-through decoration-surface-300 group-hover:text-brand-600 dark:group-hover:text-brand-400'}`}>
                            {section.title}
                        </span>
                        {section.type !== 'footer' && section.type !== 'header' && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setEditingSectionId(section.id); }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-surface-100 dark:hover:bg-white/5 transition-all scale-90 hover:scale-100"
                                title="Edit Title"
                            >
                                <Pencil className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                  )}
                  {!['footer'].includes(section.type) && (
                    <button onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }} className={`p-1.5 rounded-lg transition-transform duration-300 ${!section.isCollapsed ? 'rotate-180' : 'hover:bg-surface-100 dark:hover:bg-white/5 text-surface-400 hover:text-brand-600 dark:hover:text-brand-400'}`} style={!section.isCollapsed ? { backgroundColor: currentColor.value, color: 'white' } : {}}>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {/* DELETE SECTION BUTTON - BRAND ACCENT SYNCED */}
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setSections(prev => prev.filter(s => s.id !== section.id)); 
                    }} 
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                    title="Delete Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {!section.isCollapsed && !['header', 'footer'].includes(section.type) && (
                  <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-1 duration-200">
                    <textarea 
                        value={section.content} 
                        onChange={(e) => updateContent(section.id, e.target.value)} 
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-3 py-2.5 rounded-lg border border-surface-200 dark:border-white/10 bg-white dark:bg-black/30 text-base md:text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all resize-none shadow-sm placeholder:text-surface-400" 
                        style={{ fontFamily: section.type === 'implementation' ? 'monospace' : currentThemeObj.fontFamily, lineHeight: '1.5' }}
                        rows={section.type === 'implementation' ? 8 : 4} 
                    />
                  </div>
                )}
                 {section.type === 'header' && !section.isCollapsed && (
                   <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-1">
                     <input 
                        value={posterTitle} 
                        onChange={(e) => setPosterTitle(e.target.value)} 
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-white/10 bg-white dark:bg-black/30 text-base md:text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 shadow-sm"
                        style={{ fontFamily: currentThemeObj.fontFamily, fontWeight: 'bold' }}
                    />
                   </div>
                 )}
              </div>
            );
          })}
        </div>
        
        {/* BOTTOM */}
        <div className="p-3 lg:p-5 flex gap-2 lg:gap-3 items-center border-t border-surface-200/50 dark:border-white/5 bg-surface-50/90 dark:bg-surface-900/90 backdrop-blur-xl z-30 shrink-0 relative">
           {isMobile ? (
               // MOBILE BOTTOM BAR
               <>
                <button onClick={handleReset} className="h-10 w-10 shrink-0 rounded-xl border border-surface-200 dark:border-white/10 shadow-sm flex items-center justify-center relative overflow-hidden group transition-all hover:scale-105 active:scale-95 bg-surface-100 dark:bg-white/10 hover:bg-surface-200 dark:hover:bg-white/20 tooltip-top tooltip-surface" data-tooltip="Reset Content"> <FileX className="w-4 h-4 text-red-500 group-hover:text-red-600 dark:text-red-400 dark:group-hover:text-red-300 transition-colors" /> </button>
                <button onClick={() => setMobilePreviewExpanded(true)} className="h-10 w-10 shrink-0 rounded-xl border border-surface-200 dark:border-white/10 shadow-sm flex items-center justify-center relative overflow-hidden group transition-all hover:scale-105 active:scale-95 bg-surface-100 dark:bg-white/10 hover:bg-surface-200 dark:hover:bg-white/20">
                    <Maximize2 className="w-4 h-4 text-surface-500 dark:text-surface-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
                </button>
                <button onClick={generatePdf} disabled={isGenerating} className="flex-1 h-10 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:grayscale flex justify-center items-center gap-2 group border border-white/10 hover:opacity-90 hover:scale-[1.02]">
                    {isGenerating ? <div className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" /> : <Download className="w-4 h-4" />}
                    <span className="text-xs">Save PDF</span>
                </button>
               </>
           ) : (
               // DESKTOP BOTTOM BAR
               <>
                <button onClick={handleReset} className="h-10 w-10 shrink-0 rounded-xl bg-surface-100 dark:bg-white/10 hover:bg-surface-200 dark:hover:bg-white/20 text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center justify-center tooltip-top tooltip-surface" data-tooltip="Reset Content"> <FileX className="w-4 h-4" /> </button>
                <button onClick={generatePdf} disabled={isGenerating} className="flex-1 h-9 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:grayscale flex justify-center items-center gap-2 group border border-white/10 hover:opacity-90 hover:scale-[1.02]">
                    {isGenerating ? <div className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" /> : <Download className="w-3.5 h-3.5" />}
                    <span className="text-xs">Export Poster PDF</span>
                </button>
               </>
           )}
        </div>
      </div>

      {/* RIGHT PANEL: DESKTOP PREVIEW */}
      {!isMobile && (
        <div className="flex-1 relative flex flex-col bg-surface-100/50 dark:bg-surface-950/50 overflow-hidden order-2">
            
            {/* TOOLBAR (UNIFIED) */}
            <div className="absolute top-6 right-6 z-30 flex gap-2 lg:gap-3 items-center transition-all">
                 {/* PAGINATION */}
                 {pages.length > 1 && !isGenerating && (
                    <div className="flex bg-surface-100/80 dark:bg-surface-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-black/5 p-1 items-center justify-center">
                        <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-surface-500 hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"> <ChevronLeft className="w-4 h-4" /> </button>
                        <span className="px-2 text-xs font-mono font-medium text-surface-500 min-w-[5ch] text-center">{currentPage + 1} / {pages.length}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))} disabled={currentPage === pages.length - 1} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-surface-500 hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"> <ChevronRight className="w-4 h-4" /> </button>
                    </div>
                 )}
                 
                 {/* ZOOM */}
                 <div className="flex bg-surface-100/80 dark:bg-surface-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-black/5 p-1 items-center justify-center">
                    <button onClick={() => { setZoomLevel(z => Math.max(0.3, z - 0.1)); setManualZoom(true); }} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 hover:scale-110 active:scale-95 transition-all"> <ZoomOut className="w-4 h-4" /> </button>
                    <button onClick={() => setManualZoom(false)} className={`px-2 text-xs font-mono font-medium min-w-[3ch] text-center hover:text-brand-600 cursor-pointer transition-colors ${manualZoom ? 'text-brand-600 font-bold' : 'text-surface-500'}`} title="Click to Auto Fit">{Math.round(zoomLevel * 100)}%</button>
                    <button onClick={() => { setZoomLevel(z => Math.min(1.5, z + 0.1)); setManualZoom(true); }} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 hover:scale-110 active:scale-95 transition-all"> <ZoomIn className="w-4 h-4" /> </button>
                 </div>
                 
                 {/* CLOSE */}
                 <button onClick={onClose} className="p-2.5 rounded-xl bg-surface-100/80 dark:bg-white/5 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/5 hover:bg-surface-200 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-surface-500 hover:text-brand-600 dark:hover:text-brand-400"> <X className="w-5 h-5" /> </button>
            </div>

            {/* EXPORT LOADING OVERLAY */}
            {isGenerating && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-surface-100 dark:bg-surface-950 animate-in fade-in duration-300">
                    <div className="relative">
                        {/* SPINNING RING */}
                        <div className="w-20 h-20 rounded-full border-4 border-surface-200 dark:border-white/10 border-t-brand-500 animate-spin" />
                        {/* CENTER ICON */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-brand-500 animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-8 text-lg font-bold text-brand-600 dark:text-brand-400 animate-pulse">
                        Generating PDF...
                    </p>
                    <p className="mt-2 text-sm text-brand-500/70 dark:text-brand-400/70">
                        Please wait while we prepare your poster
                    </p>
                </div>
            )}

            {/* CANVAS */}
            <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center p-6 cursor-default bg-surface-100/50 dark:bg-surface-950/50 relative">

            {/* POSTER WRAPPER (SCALED) */}
            <div 
                ref={posterRef} 
                className="transition-transform duration-300 origin-top flex flex-col gap-8 mt-12"
                style={{ 
                    width: '210mm',
                    transform: `scale(${isGenerating ? 1 : zoomLevel})`,
                    transformOrigin: 'top center'
                }}
            >
                {(isGenerating ? pages : [pages[currentPage]]).filter(Boolean).map((pageSections, i) => {
                    const pageIndex = isGenerating ? i : currentPage;
                    return (
                    <div 
                        key={pageIndex}
                        className={`poster-page shadow-2xl rounded-lg ring-1 ring-black/5 ${pageMode === 'single' ? 'overflow-visible' : 'overflow-hidden'} relative flex flex-col`} 
                        style={{ 
                            width: '210mm', 
                            height: pageMode === 'single' ? 'auto' : '297mm',
                            minHeight: pageMode === 'single' ? undefined : '297mm',
                            backgroundColor: activeTheme === 'terminal' ? '#1e1e1e' : (activeTheme === 'cards' ? '#f3f4f6' : 'white') 
                        }}
                    >
                        <div className={`poster-content p-[15mm] flex flex-col ${pageMode === 'multi' ? 'flex-1' : ''} bg-transparent ${activeTheme === 'terminal' ? 'text-gray-300 font-mono' : 'font-sans'}`} style={{ fontFamily: currentThemeObj.fontFamily }}>  
                            {renderThemeContent(pageSections, posterTitle, activeTheme, currentColor.value)}
                            
                            {/* PAGE NUMBER */}
                            {pages.length > 1 && (
                                <div className="absolute bottom-4 right-6 text-[9px] opacity-40 font-mono">
                                    {pageIndex + 1} / {pages.length}
                                </div>
                            )}
                        </div>
                    </div>
                )})}
            </div>
            </div>

            {/* DESKTOP FOOTER - FIXED INSIDE RIGHT PANEL */}
            <footer className="hidden lg:block absolute bottom-0 left-0 right-0 z-50 px-4 py-2 text-[10px] text-surface-400 bg-surface-50/90 dark:bg-surface-950/90 backdrop-blur-sm rounded-tl-lg pointer-events-none select-none text-right leading-relaxed">
              <span>© 2025 Yeray Lois Sánchez — Proprietary preview build. All rights reserved.</span>
            </footer>
        </div>
      )}

       {/* MOBILE FULLSCREEN PREVIEW OVERLAY */}
       {isMobile && mobilePreviewExpanded && (
           <div 
              className="fixed inset-0 z-[60] flex flex-col animate-in fade-in zoom-in-95 duration-200 bg-[color-mix(in_srgb,var(--background)_95%,transparent)] backdrop-blur-3xl"
           >
              {/* APPLE-STYLE HEADER */}
              <div className="px-5 py-3 border-b border-surface-200/50 dark:border-white/5 flex justify-between items-center bg-surface-50/40 dark:bg-surface-900/40 backdrop-blur-xl shrink-0">
                  {/* LEFT: BACK BUTTON */}
                  <button 
                     onClick={() => setMobilePreviewExpanded(false)} 
                     className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-medium text-sm active:opacity-60 transition-opacity"
                  >
                      <ChevronDown className="w-5 h-5" strokeWidth={2} />
                      <span>Done</span>
                  </button>

                  {/* CENTER: TITLE */}
                  <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="text-sm font-bold tracking-tight text-brand-700 dark:text-brand-300 uppercase truncate max-w-[180px]">{posterTitle}</span>
                      <span className="text-[10px] text-surface-400 dark:text-surface-500">PDF Preview</span>
                  </div>
              </div>
             
              {/* CONTENT AREA */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 cursor-grab active:cursor-grabbing bg-brand-50/20 dark:bg-brand-900/10">
                  {/* SCALED PREVIEW WRAPPER */}
                  <div style={{
                      position: 'relative',
                      width: `calc(210mm * ${zoomLevel})`,
                      height: pageMode === 'single' ? `calc(297mm * ${zoomLevel})` : undefined,
                      flexShrink: 0
                  }}>
                      <div 
                         className="shadow-2xl rounded-lg ring-1 ring-black/5 dark:ring-white/5 transition-transform duration-200"
                         style={{ 
                             position: pageMode === 'single' ? 'absolute' : 'static',
                             top: 0, left: 0,
                             transformOrigin: 'top left',
                             width: '210mm', 
                             height: pageMode === 'single' ? '297mm' : 'auto',
                             minHeight: '297mm',
                             transform: `scale(${zoomLevel})`, 
                             backgroundColor: activeTheme === 'terminal' ? '#1e1e1e' : (activeTheme === 'cards' ? '#f3f4f6' : 'white') 
                         }}
                      >
                      <div className={`poster-content p-[15mm] flex flex-col h-full bg-transparent ${activeTheme === 'terminal' ? 'text-gray-300 font-mono' : 'font-sans'}`} style={{ minHeight: pageMode === 'single' ? '297mm' : 'auto', fontFamily: currentThemeObj.fontFamily }}>  
                         {renderThemeContent(enabledSections, posterTitle, activeTheme, currentColor.value)}
                         {enabledSections.find(s => s.type === 'footer') && (
                             <footer className={`mt-auto pt-6 border-t flex justify-between items-center text-[9px] uppercase tracking-wider opacity-50 ${activeTheme === 'terminal' ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                             <div>Generated via LocalSnips AI</div><div>Research Confidential</div>
                             </footer>
                         )}
                     </div>
                  </div>
              </div>
           </div>

           {/* BOTTOM ACTION BAR */}
           <div className="px-5 py-3 border-t border-surface-200/50 dark:border-white/5 bg-surface-50/40 dark:bg-surface-900/40 backdrop-blur-xl shrink-0 flex gap-3">
               <button onClick={generatePdf} disabled={isGenerating} className="flex-1 h-11 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:grayscale flex justify-center items-center gap-2 group border border-white/10">
                   {isGenerating ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Download className="w-4 h-4" />}
                   <span className="text-sm">Export PDF</span>
               </button>
           </div>
          </div>
       )}

      {/* COPYRIGHT FOOTER - ONLY VISIBLE ON MOBILE, FLOWS IN LAYOUT */}
      <footer className="lg:hidden w-full px-4 py-2 text-[9px] text-surface-400 bg-surface-50/90 dark:bg-surface-950/90 backdrop-blur-sm pointer-events-none select-none text-center leading-relaxed shrink-0 order-last">
        <span className="hidden md:inline">© 2025 Yeray Lois Sánchez — Proprietary preview build. All rights reserved.</span>
        <span className="md:hidden">© 2025 Yeray Lois Sánchez</span>
      </footer>

       {/* GHOST MEASUREMENT CONTAINER */}
       <div className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none" style={{ width: '210mm' }} aria-hidden="true">
            <div className={`p-[15mm] flex flex-col ${activeTheme === 'terminal' ? 'text-gray-300 font-mono' : 'font-sans'}`} style={{ fontFamily: currentThemeObj.fontFamily }}>
                {enabledSections.map(section => (
                    <div key={section.id} data-measure-id={section.id}>
                        {renderThemeContent([section], posterTitle, activeTheme, currentColor.value)}
                    </div>
                ))}
            </div>
       </div>
    </div>
  );
}

function renderThemeContent(sections: PosterSection[], title: string, theme: PosterTheme, accent: string) {
    const header = sections.find(s => s.type === 'header');
    const bodySections = sections.filter(s => !['header', 'footer'].includes(s.type));
    
    // 1. ACADEMIC
    if (theme === 'academic') {
        return (
            <>
                {header && (<header className="border-b-2 border-black pb-4 mb-6 text-center"><h1 className="text-4xl font-bold mb-2 uppercase tracking-tight text-black">{title}</h1><p className="text-xs text-gray-500 italic">Documentation</p></header>)}
                <div className="flex-1 space-y-6 text-black">
                    {bodySections.map(s => (<section key={s.id}><h3 className="text-sm font-bold uppercase tracking-wider border-b border-black/20 mb-2 pb-1 inline-block text-black">{s.title}</h3>{renderSection(s, accent, theme)}</section>))}
                </div>
            </>
        )
    }

    // 2. JOURNAL
    if (theme === 'journal') {
        return (
             <>
                {header && <header className="border-b-4 border-black pb-4 mb-6 text-center"><h1 className="text-4xl font-bold mb-2 uppercase text-black">{title}</h1></header>}
                <div className="flex-1 columns-2 gap-8 text-black fill-current text-justify">
                    {bodySections.map(s => (<section key={s.id} className="break-inside-avoid mb-6"><h3 className="text-sm font-bold uppercase border-b border-black mb-2" style={{color: 'black'}}>{s.title}</h3>{renderSection(s, accent, theme)}</section>))}
                </div>
            </>
        )
    }

    // 3. MODERN
    if (theme === 'modern') {
         return (
            <>
                {header && (
                    <header className="mb-8 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex justify-between">
                            <div><div className="text-xs font-bold uppercase opacity-60 text-slate-500">DOCS</div><h1 className="text-4xl font-black text-slate-900">{title}</h1></div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: accent }}><FileText/></div>
                        </div>
                    </header>
                )}
                <div className="flex-1 grid grid-cols-12 gap-6">
                    <div className="col-span-4 space-y-6">{bodySections.filter(s => ['whatItIs','whenToUse','prerequisites'].includes(s.type)).map(s => <div key={s.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100"><h3 className="text-xs font-black uppercase mb-2 flex items-center gap-2" style={{color:accent}}>{s.title}</h3>{renderSection(s,accent,theme)}</div>)}</div>
                    <div className="col-span-8 space-y-8">{bodySections.filter(s => !['whatItIs','whenToUse','prerequisites'].includes(s.type)).map(s => <div key={s.id}><h3 className="text-xl font-bold mb-3 flex gap-2 text-slate-900"><span style={{color:accent}}>/</span>{s.title}</h3>{renderSection(s,accent,theme)}</div>)}</div>
                </div>
            </>
        )
    }

    // 4. TERMINAL
    if (theme === 'terminal') {
         return (
             <>
                {header && <header className="mb-8 border-b-2 border-dashed border-gray-700 pb-4 font-mono"><h1 className="text-3xl font-bold" style={{color: accent}}>$ {title}</h1></header>}
                <div className="flex-1 space-y-6 font-mono text-sm text-gray-400">
                    {bodySections.map(s => (<section key={s.id} className="border-l-2 border-dashed border-gray-800 pl-4 py-1"><h3 className="font-bold mb-2 uppercase flex items-center gap-2" style={{color: accent}}><Terminal className="w-3 h-3"/> {s.title}</h3>{renderSection(s, accent, theme)}</section>))}
                </div>
             </>
         )
    }

    // 5. CLEAN (APPLE)
    if (theme === 'clean') {
        return (
            <>
                {header && <header className="mb-12"><h1 className="text-5xl font-semibold tracking-tight leading-none mb-4 text-black">{title}</h1><div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: accent }}></div></header>}
                <div className="flex-1 space-y-10">
                     {bodySections.map(s => <div key={s.id} className=""><h3 className="text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2 text-gray-400">{s.title}</h3>{renderSection(s, accent, theme)}</div>)}
                </div>
            </>
        )
    }

    // 6. ELEGANT
    if (theme === 'elegant') {
        return (
            <>
                {header && <header className="mb-12 text-center"><h1 className="text-5xl font-light italic text-slate-800 mb-2">{title}</h1><div className="w-16 h-px bg-slate-300 mx-auto"></div></header>}
                <div className="flex-1 space-y-10 px-8">
                     {bodySections.map(s => <div key={s.id} className="text-center"><h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">{s.title}</h3><div className="text-left">{renderSection(s, accent, theme)}</div></div>)}
                </div>
            </>
        )
    }

    // 7. CARDS (NEW)
    if (theme === 'cards') {
        return (
            <>
                {header && <header className="mb-8 text-center p-6"><h1 className="text-4xl font-bold text-gray-900 tracking-tight">{title}</h1></header>}
                <div className="flex-1 space-y-6">
                    {bodySections.map(s => (
                        <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                             <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor: accent}}></div>{s.title}</h3>
                             {renderSection(s, accent, theme)}
                        </div>
                    ))}
                </div>
            </>
        )
    }

    // 8. FOCUS (NEW)
    if (theme === 'focus') {
        return (
            <>
                {header && <header className="mb-16 pt-8"><h1 className="text-6xl font-black text-black leading-none tracking-tighter">{title}</h1><div className="mt-6 w-full h-2 bg-black"></div></header>}
                <div className="flex-1 space-y-12">
                     {bodySections.map(s => <div key={s.id} className="grid grid-cols-12 gap-8"><div className="col-span-3 text-right"><h3 className="text-xl font-bold text-black leading-none">{s.title}</h3></div><div className="col-span-9 border-l border-gray-200 pl-8">{renderSection(s, accent, theme)}</div></div>)}
                </div>
            </>
        )
    }

    // 9. BAUHAUS (NEW)
    if (theme === 'bauhaus') {
        return (
            <>
                {header && (
                    <header className="mb-12 flex items-stretch">
                         <div className="w-8 shrink-0 mr-6" style={{backgroundColor: accent}}></div>
                         <div><h1 className="text-5xl font-bold text-black mb-2">{title}</h1><p className="font-mono text-xs text-gray-400 tracking-widest uppercase">Figure 1.0 // Doc</p></div>
                    </header>
                )}
                <div className="flex-1 pl-14 relative">
                     <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
                     {bodySections.map(s => (
                        <div key={s.id} className="mb-10 relative">
                            <div className="absolute -left-11 top-0.5 w-3 h-3 border-2 border-white rounded-full box-content" style={{backgroundColor: accent}}></div>
                            <h3 className="text-lg font-bold text-black mb-3 underline decoration-2 underline-offset-4" style={{textDecorationColor: accent}}>{s.title}</h3>
                            {renderSection(s, accent, theme)}
                        </div>
                     ))}
                </div>
            </>
        )
    }
}

function renderSection(section: PosterSection, accent: string, theme: PosterTheme) {
    if (section.type === 'implementation') {
        const bg = theme === 'terminal' ? 'bg-[#000]' : 'bg-gray-50';
        const txt = theme === 'terminal' ? 'text-gray-200' : 'text-gray-700'; // FIXED TERMINAL TEXT COLOR CONTRAST
        const border = theme === 'terminal' ? 'border-gray-800' : 'border-gray-200';
        
        const trafficLights = theme !== 'terminal' ? (
             <div className="px-3 py-2 bg-white border-b border-gray-100 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-black/5" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-black/5" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-black/5" />
             </div>
        ) : null;

        return (
            <div className={`rounded-lg overflow-hidden my-2 border ${bg} ${border} ${txt}`}>
                {trafficLights}
                <pre className={`p-4 font-mono text-[9px] leading-relaxed whitespace-pre-wrap break-all ${txt}`}>{section.content}</pre>
            </div>
        );
    }
    const md = marked.parse(section.content) as string;
    return <article className="prose prose-sm max-w-none text-[10px] leading-relaxed text-justify opacity-90" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(md) }} />;
}
