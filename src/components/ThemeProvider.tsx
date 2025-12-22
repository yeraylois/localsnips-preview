/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : ThemeProvider.tsx                              *
 *   Purpose : GLOBAL THEME & COLOR CONTEXT MANAGER           *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system" | "custom";

// EXTENDED STATE FOR CUSTOM COLORS
interface CustomThemeState {
    // CUSTOM MODE SETTINGS
    darkBg: string;           // HEX FOR BASE BACKGROUND
    brandHue: number;
    brandSat: number;
    titleHue: number;
    titleSat: number;
    sidebarOpacity: number; // 0-100
    
    // STANDARD MODE TINTS (NEW)
    lightHue: number;
    lightSat: number;
    darkHue: number;
    darkSat: number;
    
    // LEGACY (KEPT/UNUSED)
    surfaceHue: number;
    surfaceSat: number;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customTheme: CustomThemeState;
  setCustomTheme: (s: CustomThemeState) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * PROVIDES THEME STATE AND COLOR LOGIC TO THE APP.
 * HANDLES SYSTEM/LIGHT/DARK MODES AND CUSTOM COLOR PALETTES.
 * INJECTS CSS VARIABLES FOR DYNAMIC STYLING.
 * - Parameter children: App content
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [customTheme, setCustomTheme] = useState<CustomThemeState>({
      darkBg: "#1d1d1d",
      brandHue: 142,  // Apple Green
      brandSat: 70,
      titleHue: 210,      
      titleSat: 15,       
      sidebarOpacity: 50, 
      
      // DEFAULTS MATCHING GLOBALS.CSS
      lightHue: 210, // SLATE
      lightSat: 40,
      darkHue: 240, // ZINC/NEUTRAL
      darkSat: 4,
      
      surfaceHue: 210,
      surfaceSat: 40,
  });

  useEffect(() => {
    const saved = localStorage.getItem("localsnips-theme") as Theme;
    if (saved) setTheme(saved);
    
    const savedCustom = localStorage.getItem("localsnips-custom-theme");
    if (savedCustom) {
        try {
            setCustomTheme(JSON.parse(savedCustom));
        } catch(e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("localsnips-custom-theme", JSON.stringify(customTheme));
  }, [customTheme]);

    // HELPERS FOR REAL-TIME COLOR GENERATION (APPLE-LIKE MIXING)
    // WE STICK TO SIMPLE HEX/RGB MANIPULATION TO ALLOW "0 DEPENDENCIES"
    const hexToRgb = (hex: string) => {
        let c = hex.substring(1).split('');
        if(c.length== 3) c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        const n = parseInt(c.join(''), 16);
        return [(n>>16)&255, (n>>8)&255, n&255];
    }

    const mix = (c1: number[], c2: number[], weight: number) => {
        // WEIGHT: 0 = C1, 1 = C2. APPLE CARDS ARE DARK + ~12% WHITE
        const w1 = 1 - weight;
        return [
            Math.round(c1[0] * w1 + c2[0] * weight),
            Math.round(c1[1] * w1 + c2[1] * weight),
            Math.round(c1[2] * w1 + c2[2] * weight)
        ];
    }
    
    const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    // UNIFIED THEME APPLICATION LOGIC
    const applyTheme = () => {
        if (typeof window === "undefined") return;
        
        const root = window.document.documentElement;
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        // RESET ALL CUSTOM PROPERTIES FIRST
        [50,100,200,300,400,500,600,700,800,900,950].forEach(n => {
            root.style.removeProperty(`--surface-${n}`);
            root.style.removeProperty(`--brand-${n}`);
        });
        root.style.removeProperty("--background");
        root.style.removeProperty("--foreground");
        root.style.removeProperty("--brand-h");
        root.style.removeProperty("--brand-s");
        
        // ENSURE STANDARD TINTS ARE CLEANLY RESET BEFORE RE-APPLYING
        root.style.removeProperty("--surface-h"); 
        root.style.removeProperty("--surface-s");

        // RESET TITLE VARS
        root.style.removeProperty("--title-color");
        root.style.removeProperty("--title-muted");
        root.style.removeProperty("--sidebar-opacity");
        
        // DETERMINE MODE AND APPLY CLASS
        root.classList.remove("light", "dark");
        
        if (theme === "custom") {
            // CUSTOM MODE: ALWAYS USE 'DARK' CLASS FOR TAILWIND COMPATIBILITY
            // THE ENTIRE PALETTE IS CONTROLLED BY OUR CSS VARIABLES
            root.classList.add("dark");
            
            console.log("[ThemeProvider] Custom mode active - injecting full palette");
            
            // ===========================================
            // A. BACKGROUND PALETTE (FROM DARKBG)
            // ===========================================
            const bgRgb = hexToRgb(customTheme.darkBg || "#1d1d1d");
            const white = [255, 255, 255];
            
            const generateSurfaceStep = (weight: number) => {
                const mixed = mix(bgRgb, white, weight);
                return rgbToHex(mixed[0], mixed[1], mixed[2]);
            };

            const surfacePalette: Record<number, string> = {
                950: customTheme.darkBg || "#1d1d1d",  // MAIN BACKGROUND
                900: generateSurfaceStep(0.06),        // CARDS, SIDEBAR
                800: generateSurfaceStep(0.12),        // BORDERS, HOVER STATES
                700: generateSurfaceStep(0.20),        // ACTIVE STATES
                600: generateSurfaceStep(0.30),        // MUTED TEXT
                500: generateSurfaceStep(0.42),        // SECONDARY TEXT
                400: generateSurfaceStep(0.55),        // ICONS, PLACEHOLDERS
                300: generateSurfaceStep(0.68),        // LIGHT TEXT
                200: generateSurfaceStep(0.80),        // BRIGHT ACCENTS
                100: generateSurfaceStep(0.90),        // NEAR-WHITE
                50:  generateSurfaceStep(0.96)         // PRIMARY TEXT (ALMOST WHITE)
            };

            // APPLY SURFACE TOKENS
            Object.entries(surfacePalette).forEach(([stop, color]) => {
                root.style.setProperty(`--surface-${stop}`, color);
            });
            root.style.setProperty("--background", surfacePalette[950]);
            root.style.setProperty("--foreground", surfacePalette[50]);
            
            // ===========================================
            // B. ACCENT/BRAND PALETTE (FROM BRANDHUE/BRANDSAT)
            // ===========================================
            const h = customTheme.brandHue;
            const s = customTheme.brandSat;
            
            // GENERATE BRAND PALETTE USING HSL (GOOD FOR ACCENT COLORS)
            root.style.setProperty("--brand-h", h.toString());
            root.style.setProperty("--brand-s", `${s}%`);
            
            // PRE-GENERATE BRAND COLORS FOR DIRECT USE
            const brandPalette: Record<number, string> = {
                50:  `hsl(${h}, ${s}%, 97%)`,
                100: `hsl(${h}, ${s}%, 94%)`,
                200: `hsl(${h}, ${s}%, 86%)`,
                300: `hsl(${h}, ${s}%, 77%)`,
                400: `hsl(${h}, ${s}%, 66%)`,
                500: `hsl(${h}, ${s}%, 55%)`,
                600: `hsl(${h}, ${s}%, 47%)`,
                700: `hsl(${h}, ${s}%, 40%)`,
                800: `hsl(${h}, ${s}%, 33%)`,
                900: `hsl(${h}, ${s}%, 25%)`,
                950: `hsl(${h}, ${s}%, 15%)`
            };
            
            Object.entries(brandPalette).forEach(([stop, color]) => {
                root.style.setProperty(`--brand-${stop}`, color);
            });
            
            // AI SUGGEST BUTTON - USE SURFACE COLORS FOR BETTER READABILITY ON DARK BG
            root.style.setProperty("--ai-suggest-bg", surfacePalette[800]);
            root.style.setProperty("--ai-suggest-text", surfacePalette[200]);
            root.style.setProperty("--ai-suggest-hover", surfacePalette[700]);
            
            // TOOLTIPS - SUBTLE SURFACE COLORS FOR CUSTOM MODE
            root.style.setProperty("--tooltip-bg", surfacePalette[900]);
            root.style.setProperty("--tooltip-text", surfacePalette[200]);
            root.style.setProperty("--tooltip-border", surfacePalette[800]);
            
            // ===========================================
            // C. SECTION TITLES (FROM TITLEHUE/TITLESAT)
            // ===========================================
            const th = customTheme.titleHue;
            const ts = customTheme.titleSat;
            root.style.setProperty("--title-color", `hsl(${th}, ${ts}%, 65%)`);
            root.style.setProperty("--title-muted", `hsl(${th}, ${Math.max(ts - 5, 0)}%, 50%)`);
            
            // ===========================================
            // D. SIDEBAR OPACITY
            // ===========================================
            root.style.setProperty("--sidebar-opacity", `${customTheme.sidebarOpacity / 100}`);
            
            console.log("[ThemeProvider] Custom palette applied:", { 
                bg: surfacePalette[950], 
                accent: `hsl(${h}, ${s}%, 55%)`,
                titles: `hsl(${th}, ${ts}%, 65%)`
            });
            
        } else {
            // STANDARD MODES: LIGHT, DARK, SYSTEM
            const effectiveMode = theme === "light" ? "light" : theme === "dark" ? "dark" : (systemDark ? "dark" : "light");
            root.classList.add(effectiveMode);
            
            // MODE-SPECIFIC BRAND COLORS
            if (effectiveMode === "light") {
                // LIGHT MODE: EMERALD #079669
                root.style.setProperty("--brand-h", "161");
                root.style.setProperty("--brand-s", "91%");
            } else {
                // DARK MODE: APPLE BLUE
                root.style.setProperty("--brand-h", "211");
                root.style.setProperty("--brand-s", "100%");
            }

            // INJECT SUB-TINTS FOR STANDARD MODES (OVERRIDES GLOBALS.CSS)
            if (effectiveMode === "light") {
                // ONLY IF CUSTOMTHEME.LIGHTHUE/SAT ARE DEFINED (THEY ARE IN DEFAULT)
                if (customTheme.lightHue !== undefined) {
                    root.style.setProperty("--surface-h", customTheme.lightHue.toString());
                    root.style.setProperty("--surface-s", `${customTheme.lightSat}%`);
                }
            } else {
                if (customTheme.darkHue !== undefined) {
                     root.style.setProperty("--surface-h", customTheme.darkHue.toString());
                    root.style.setProperty("--surface-s", `${customTheme.darkSat}%`);
                }
            }
        }
    };

    // RUN ON MOUNT + STATE CHANGE
    useEffect(() => {
        applyTheme();
        localStorage.setItem("localsnips-theme", theme);
        localStorage.setItem("localsnips-custom-theme", JSON.stringify(customTheme));
    }, [theme, customTheme]);

    // LISTEN FOR SYSTEM CHANGES
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => { applyTheme(); }; // Re-run logic on system change
        media.addEventListener("change", handler);
        return () => media.removeEventListener("change", handler);
    }, [theme, customTheme]); 

    // REAPPLY THEME ON NAVIGATION (visibility change / popstate)
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                applyTheme();
            }
        };
        const handlePopState = () => {
            applyTheme();
        };
        
        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('popstate', handlePopState);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [theme, customTheme]); 

    // SYNC WITH NATIVE APP (LocalSnips)
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).webkit?.messageHandlers?.windowControl) {
             (window as any).webkit.messageHandlers.windowControl.postMessage({
                action: "setTheme",
                mode: theme,
                customHex: theme === 'custom' ? customTheme.darkBg : undefined,
                titleHue: theme === 'custom' ? customTheme.titleHue : undefined
             });
        }
    }, [theme, customTheme.darkBg, customTheme.titleHue]); 


  return (
    <ThemeContext.Provider value={{ theme, setTheme, customTheme, setCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
