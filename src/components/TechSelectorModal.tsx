/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : TechSelectorModal.tsx                          *
 *   Purpose : MODAL FOR SELECTING TECHNOLOGIES               *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Check, HelpCircle, ChevronLeft, Plus, Palette } from "lucide-react";
import { TECH_ICONS, getTechIconUrl } from "../lib/tech-icons";
import { useTheme } from "./ThemeProvider";

// GROUP TECHNOLOGIES BY CATEGORY
const TECH_CATEGORIES: Record<string, string[]> = {
  "Languages": ["python", "javascript", "typescript", "java", "go", "rust", "c", "cpp", "swift", "kotlin", "ruby", "php", "scala", "haskell", "elixir", "dart"],
  "DevOps": ["docker", "kubernetes", "ansible", "terraform", "jenkins", "gitlab", "github", "helm", "prometheus", "grafana", "traefik", "istio"],
  "Databases": ["postgresql", "mysql", "mongodb", "redis", "elasticsearch", "sqlite", "cassandra", "neo4j", "dynamodb"],
  "Cloud": ["aws", "gcp", "azure", "vercel", "netlify", "cloudflare", "heroku", "digitalocean", "firebase", "supabase"],
  "Frontend": ["react", "vue", "angular", "svelte", "nextjs", "nuxt", "tailwind", "bootstrap", "sass", "vite", "webpack"],
  "Backend": ["nodejs", "django", "flask", "fastapi", "express", "spring", "rails", "laravel", "dotnet"],
  "Systems": ["linux", "ubuntu", "debian", "macos", "nginx", "bash", "tmux"],
  "Tools": ["git", "vim", "neovim", "vscode", "postman", "figma"],
  "Testing": ["jest", "cypress", "selenium", "playwright", "pytest"],
  "Messaging": ["kafka", "rabbitmq", "redis"],
  "AI & ML": ["tensorflow", "pytorch", "jupyter", "openai"],
};

// HELPER TO CHECK IF A COLOR IS TOO DARK
const isColorDark = (hex: string): boolean => {
  const color = hex.replace('#', '');
  if (color.length < 6) return false;
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 100;
};

// CUSTOM TECHNOLOGIES STORAGE KEY
const CUSTOM_TECH_KEY = 'localsnips_custom_technologies';

// LOAD CUSTOM TECHNOLOGIES FROM LOCALSTORAGE
const loadCustomTechs = (): Record<string, { color: string }> => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(CUSTOM_TECH_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// SAVE CUSTOM TECHNOLOGIES TO LOCALSTORAGE
const saveCustomTechs = (techs: Record<string, { color: string }>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CUSTOM_TECH_KEY, JSON.stringify(techs));
};

interface TechSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string | null;
  onChange: (value: string | null) => void;
}

/**
 * MODAL INTERFACE FOR SEARCHING AND SELECTING TECHNOLOGIES.
 * SUPPORTS CUSTOM TECHNOLOGY ADDITION WITH COLOR PICKER.
 * GROUPED BY CATEGORY WITH SEARCH FILTERING.
 * @param isOpen VISIBILITY STATE
 * @param onClose CALLBACK TO CLOSE
 * @param value CURRENTLY SELECTED VALUE
 * @param onChange CALLBACK FOR SELECTION
 */
export default function TechSelectorModal({ isOpen, onClose, value, onChange }: TechSelectorModalProps) {
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTechName, setNewTechName] = useState("");
  const [newTechColor, setNewTechColor] = useState("#6366f1");
  const [customTechs, setCustomTechs] = useState<Record<string, { color: string }>>({});
  const { theme, customTheme } = useTheme();

  // LOAD CUSTOM TECHS ON MOUNT
  useEffect(() => {
    setMounted(true);
    setCustomTechs(loadCustomTechs());
  }, []);

  // CLOSE ON ESCAPE
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showAddForm) {
          setShowAddForm(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, onClose, showAddForm]);

  // RESET ON CLOSE
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setShowAddForm(false);
      setNewTechName("");
      setNewTechColor("#6366f1");
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  // FILTER TECHNOLOGIES
  const filteredCategories = Object.entries(TECH_CATEGORIES)
    .map(([category, techs]) => ({
      category,
      techs: techs.filter(tech => !search || tech.toLowerCase().includes(search.toLowerCase()))
    }))
    .filter(c => c.techs.length > 0);

  // FILTER CUSTOM TECHS
  const filteredCustomTechs = Object.keys(customTechs).filter(
    tech => !search || tech.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (tech: string | null) => {
    onChange(tech);
    onClose();
  };

  const handleAddCustomTech = () => {
    if (!newTechName.trim()) return;
    const name = newTechName.toLowerCase().trim().replace(/\s+/g, '-');
    const updated = { ...customTechs, [name]: { color: newTechColor } };
    setCustomTechs(updated);
    saveCustomTechs(updated);
    setShowAddForm(false);
    handleSelect(name);
  };

  const handleDeleteCustomTech = (tech: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...customTechs };
    delete updated[tech];
    setCustomTechs(updated);
    saveCustomTechs(updated);
    if (value === tech) onChange(null);
  };

  // HELPER TO DETERMINE IF A BG COLOR IS DARK (FOR TEXT CONTRAST)
  const isBgDark = (hex: string): boolean => {
    const color = hex.replace('#', '');
    if (color.length < 6) return true;
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  // GET THE ACTUAL BACKGROUND COLOR FROM CUSTOM THEME
  const customBg = customTheme.darkBg || '#1d1d1d';
  const isCustomDark = isBgDark(customBg);

  // THEME-AWARE COLORS - SYNC WITH WINDOW TINT FOR CUSTOM MODE
  const cardBg = theme === 'custom' 
    ? customBg
    : theme === 'dark' ? '#1c1c1e' : '#ffffff';
  
  // LIGHTER VERSION OF CARD BG
  const cardBgLight = theme === 'custom' 
    ? (isCustomDark 
        ? `color-mix(in srgb, ${customBg} 85%, white 15%)` 
        : `color-mix(in srgb, ${customBg} 90%, black 10%)`)
    : theme === 'dark' ? '#2c2c2e' : '#f5f5f7';
  
  const borderColor = theme === 'custom'
    ? (isCustomDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)')
    : theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  
  // ACCENT-TINTED BORDER FOR INPUTS
  const accentBorderColor = 'var(--brand-200, rgba(99, 102, 241, 0.3))';
  
  // AUTO-READABLE TEXT COLORS BASED ON BACKGROUND
  const textPrimary = theme === 'custom' 
    ? (isCustomDark ? '#ffffff' : '#1d1d1f')
    : theme === 'dark' ? '#ffffff' : '#1d1d1f';
  
  const textSecondary = theme === 'custom'
    ? (isCustomDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)')
    : theme === 'dark' ? '#8e8e93' : '#86868b';
  
  const inputBg = theme === 'custom'
    ? (isCustomDark 
        ? `color-mix(in srgb, ${customBg} 70%, black 30%)` 
        : `color-mix(in srgb, ${customBg} 95%, black 5%)`)
    : theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

  const hoverBg = theme === 'custom'
    ? (isCustomDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')
    : theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  
  // ACCENT COLOR FOR HOVER TEXT
  const accentColor = 'var(--brand-600, #4f46e5)';
  const accentColorDark = 'var(--brand-400, #818cf8)';

  // RENDER TECH ITEM
  const renderTechItem = (tech: string, techColor: string, isCustom = false) => {
    const isSelected = value === tech;
    const isDark = isColorDark(techColor);
    const iconUrl = TECH_ICONS[tech] 
      ? (isDark ? getTechIconUrl(TECH_ICONS[tech].slug, 'ffffff') : getTechIconUrl(TECH_ICONS[tech].slug))
      : null;
    const bgOpacity = isDark ? '50' : '30';
    const textAccent = theme === 'dark' || (theme === 'custom' && isCustomDark) ? accentColorDark : accentColor;
    
    return (
      <div
        role="button"
        tabIndex={0}
        key={tech}
        onClick={() => handleSelect(tech)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(tech);
          }
        }}
        className="w-full px-4 py-2.5 flex items-center gap-3 text-left transition-all group cursor-pointer outline-none focus:bg-surface-100 dark:focus:bg-white/5"
        style={{ 
          backgroundColor: isSelected ? `${techColor}20` : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = hoverBg;
          const span = e.currentTarget.querySelector('.tech-label') as HTMLElement;
          if (span) span.style.color = textAccent;
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
          const span = e.currentTarget.querySelector('.tech-label') as HTMLElement;
          if (span && !isSelected) span.style.color = textPrimary;
        }}
      >
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: techColor + bgOpacity }}
        >
          {iconUrl ? (
            <img 
              src={iconUrl}
              alt={tech}
              className="w-4 h-4"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <span 
              className="text-xs font-bold uppercase"
              style={{ color: isDark ? '#fff' : techColor }}
            >
              {tech.charAt(0)}
            </span>
          )}
        </div>
        <span className="flex-1 text-sm capitalize tech-label transition-colors" style={{ color: isSelected ? textAccent : textPrimary }}>{tech}</span>
        {isCustom && (
          <button
            onClick={(e) => handleDeleteCustomTech(tech, e)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all"
            title="Delete custom technology"
          >
            <X className="w-3 h-3 text-red-400" />
          </button>
        )}
        {isSelected && <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--brand-500, #6366f1)' }} />}
      </div>
    );
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={() => showAddForm ? setShowAddForm(false) : onClose()}
      />

      {/* MODAL */}
      <div 
        className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
      >
        {showAddForm ? (
          /* ADD FORM VIEW */
          <>
            <div 
              className="px-5 py-4 flex items-center gap-3"
              style={{ borderBottom: `1px solid ${borderColor}` }}
            >
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1.5 -ml-1 rounded-lg transition-colors"
                style={{ color: theme === 'dark' || (theme === 'custom' && isCustomDark) ? accentColorDark : accentColor }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="flex-1 text-xs font-bold uppercase tracking-widest" style={{ color: theme === 'dark' || (theme === 'custom' && isCustomDark) ? accentColorDark : accentColor }}>
                Add Custom Technology
              </h2>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., MyFramework"
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-base md:text-sm outline-none transition-all border border-transparent hover:border-brand-200 dark:hover:border-brand-500/30 focus:border-brand-500 dark:focus:border-brand-400"
                  style={{ 
                    backgroundColor: inputBg, 
                    color: textPrimary
                  }}
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 flex-shrink-0"
                    style={{ backgroundColor: newTechColor, borderColor: borderColor }}
                  />
                  <input
                    type="text"
                    value={newTechColor}
                    onChange={(e) => setNewTechColor(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl text-base md:text-sm font-mono outline-none border border-transparent hover:border-brand-200 dark:hover:border-brand-500/30 focus:border-brand-500 dark:focus:border-brand-400"
                    style={{ 
                      backgroundColor: inputBg, 
                      color: textPrimary
                    }}
                  />
                </div>
              </div>

              {/* PREVIEW */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>
                  Preview
                </label>
                <div 
                  className="p-3 rounded-xl flex items-center gap-3"
                  style={{ backgroundColor: cardBgLight, border: `1px solid ${borderColor}` }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: newTechColor + '40' }}
                  >
                    <span 
                      className="text-xs font-bold uppercase"
                      style={{ color: isColorDark(newTechColor) ? '#fff' : newTechColor }}
                    >
                      {newTechName.charAt(0) || '?'}
                    </span>
                  </div>
                  <span className="text-sm capitalize" style={{ color: textPrimary }}>
                    {newTechName || 'Technology name'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddCustomTech}
                disabled={!newTechName.trim()}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 shadow-sm active:scale-[0.98] bg-brand-600 dark:bg-brand-500 text-white hover:bg-brand-700 dark:hover:bg-brand-400"
              >
                Add Technology
              </button>
            </div>
          </>
        ) : (
          /* MAIN LIST VIEW */
          <>
            {/* HEADER */}
            <div 
              className="px-5 py-4 flex items-center gap-3"
              style={{ borderBottom: `1px solid ${borderColor}` }}
            >
              <button
                onClick={onClose}
                className="p-1.5 -ml-1 rounded-lg transition-colors"
                style={{ color: theme === 'dark' || (theme === 'custom' && isCustomDark) ? accentColorDark : accentColor }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="flex-1 text-xs font-bold uppercase tracking-widest" style={{ color: theme === 'dark' || (theme === 'custom' && isCustomDark) ? accentColorDark : accentColor }}>
                Select Technology
              </h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: theme === 'dark' || (theme === 'custom' && isCustomDark) ? accentColorDark : accentColor }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Add custom technology"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* SEARCH */}
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textSecondary }} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-base md:text-sm outline-none transition-all border border-transparent hover:border-brand-200 dark:hover:border-brand-500/30 focus:border-brand-500 dark:focus:border-brand-400"
                  style={{
                    backgroundColor: inputBg,
                    color: textPrimary
                  }}
                  autoFocus
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="max-h-[50vh] overflow-y-auto">
              {/* NONE OPTION */}
              <button
                type="button"
                onClick={() => handleSelect(null)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-all group"
                style={{ 
                  backgroundColor: !value ? `var(--brand-500, #6366f1)20` : 'transparent',
                  borderBottom: `1px solid ${borderColor}`
                }}
                onMouseEnter={(e) => {
                  if (value) e.currentTarget.style.backgroundColor = hoverBg;
                  const span = e.currentTarget.querySelector('.none-label') as HTMLElement;
                  if (span) span.style.color = theme === 'dark' || (theme === 'custom' && isCustomDark) ? accentColorDark : accentColor;
                }}
                onMouseLeave={(e) => {
                  if (value) e.currentTarget.style.backgroundColor = 'transparent';
                  const span = e.currentTarget.querySelector('.none-label') as HTMLElement;
                  if (span && value) span.style.color = textPrimary;
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${textSecondary}20` }}>
                  <HelpCircle className="w-4 h-4" style={{ color: textSecondary }} />
                </div>
                <span className="flex-1 text-sm none-label transition-colors" style={{ color: !value ? (theme === 'dark' || (theme === 'custom' && isCustomDark) ? accentColorDark : accentColor) : textPrimary }}>None</span>
                {!value && <Check className="w-4 h-4" style={{ color: 'var(--brand-500, #6366f1)' }} />}
              </button>

              {/* CUSTOM TECHNOLOGIES */}
              {filteredCustomTechs.length > 0 && (
                <>
                  <div 
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider sticky top-0"
                    style={{ backgroundColor: cardBg, color: textSecondary }}
                  >
                    Custom
                  </div>
                  {filteredCustomTechs.map(tech => renderTechItem(tech, customTechs[tech].color, true))}
                </>
              )}

              {/* BUILT-IN CATEGORIES */}
              {filteredCategories.map(({ category, techs }) => (
                <div key={category}>
                  <div 
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider sticky top-0"
                    style={{ backgroundColor: cardBg, color: textSecondary }}
                  >
                    {category}
                  </div>
                  {techs.map(tech => {
                    const techData = TECH_ICONS[tech];
                    if (!techData) return null;
                    return renderTechItem(tech, techData.color);
                  })}
                </div>
              ))}

              {filteredCategories.length === 0 && filteredCustomTechs.length === 0 && (
                <div className="p-8 text-center" style={{ color: textSecondary }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2">No technologies found</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--brand-500, #6366f1)' }}
                  >
                    Add a custom technology
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
