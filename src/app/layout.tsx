/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : layout.tsx                                     *
 *   Purpose : ROOT LAYOUT WITH THEME PROVIDER                *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { SmartTooltipProvider } from "../components/SmartTooltipProvider";
import { ASSET_PREFIX } from "../lib/types";

/**
 * ROOT LAYOUT COMPONENT.
 * WRAPS ALL PAGES WITH THEME PROVIDER AND GLOBAL STYLES.
 * @param children CHILD COMPONENTS TO RENDER
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* BLOCKING SCRIPT TO PREVENT FLASH OF WRONG THEME */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('localsnips-theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark;
                  
                  if (theme === 'custom') {
                    isDark = true;
                    // APPLY FULL CUSTOM PALETTE IMMEDIATELY
                    try {
                      var custom = JSON.parse(localStorage.getItem('localsnips-custom-theme'));
                      if (custom && custom.darkBg) {
                        var h2r = function(h){var c=h.substring(1).split('');if(c.length==3)c=[c[0],c[0],c[1],c[1],c[2],c[2]];var n=parseInt(c.join(''),16);return[(n>>16)&255,(n>>8)&255,n&255]};
                        var mix = function(c1,c2,w){var w1=1-w;return[Math.round(c1[0]*w1+c2[0]*w),Math.round(c1[1]*w1+c2[1]*w),Math.round(c1[2]*w1+c2[2]*w)]};
                        var r2h = function(c){return"#"+c.map(function(x){var h=x.toString(16);return h.length==1?"0"+h:h}).join('')};
                        
                        var bg = h2r(custom.darkBg);
                        var wh = [255,255,255];
                        var weights = {900:0.06,800:0.12,700:0.2,600:0.3,500:0.42,400:0.55,300:0.68,200:0.8,100:0.9,50:0.96};
                        
                        var root = document.documentElement;
                        root.style.setProperty('--surface-950', custom.darkBg);
                        root.style.setProperty('--background', custom.darkBg);
                        root.style.setProperty('--foreground', r2h(mix(bg,wh,0.96)));
                        
                        for(var k in weights) {
                          root.style.setProperty('--surface-'+k, r2h(mix(bg,wh,weights[k])));
                        }

                        // ALSO INJECT ACCENT COLOR IF PRESENT
                        if(custom.brandHue) {
                           root.style.setProperty('--brand-h', custom.brandHue);
                           root.style.setProperty('--brand-s', (custom.brandSat || 70) + '%');
                           // GENERATE CRITICAL BRAND SHADES TO AVOID ACCENT FLASH
                           // SIMPLE HSL INJECTION IS ENOUGH AS CSS HANDLES THE REST
                           var h = custom.brandHue;
                           var s = custom.brandSat || 70;
                           root.style.setProperty('--brand-500', 'hsl('+h+','+s+'%,55%)');
                           root.style.setProperty('--brand-600', 'hsl('+h+','+s+'%,47%)');
                        }
                      }
                    } catch(e) {}
                  } else if (theme === 'light') {
                    isDark = false;
                    // LIGHT MODE: EMERALD ACCENT - GENERATE FULL PALETTE
                    var rootLight = document.documentElement;
                    rootLight.style.setProperty('--brand-h', '161');
                    rootLight.style.setProperty('--brand-s', '91%');
                    rootLight.style.setProperty('--brand-50', 'hsl(161,91%,97%)');
                    rootLight.style.setProperty('--brand-400', 'hsl(161,91%,48%)');
                    rootLight.style.setProperty('--brand-500', 'hsl(161,91%,38%)');
                    rootLight.style.setProperty('--brand-600', 'hsl(161,91%,31%)');
                  } else if (theme === 'dark') {
                    isDark = true;
                    // DARK MODE: APPLE BLUE ACCENT - GENERATE FULL PALETTE
                    var rootDark = document.documentElement;
                    rootDark.style.setProperty('--brand-h', '211');
                    rootDark.style.setProperty('--brand-s', '90%');
                    rootDark.style.setProperty('--brand-50', 'hsl(211,90%,97%)');
                    rootDark.style.setProperty('--brand-400', 'hsl(211,90%,66%)');
                    rootDark.style.setProperty('--brand-500', 'hsl(211,90%,55%)');
                    rootDark.style.setProperty('--brand-600', 'hsl(211,90%,47%)');
                  } else {
                    isDark = systemDark;
                    // SYSTEM MODE: SET BRAND BASED ON SYSTEM PREFERENCE
                    var rootSys = document.documentElement;
                    if (isDark) {
                      rootSys.style.setProperty('--brand-h', '211');
                      rootSys.style.setProperty('--brand-s', '90%');
                      rootSys.style.setProperty('--brand-50', 'hsl(211,90%,97%)');
                      rootSys.style.setProperty('--brand-400', 'hsl(211,90%,66%)');
                      rootSys.style.setProperty('--brand-500', 'hsl(211,90%,55%)');
                      rootSys.style.setProperty('--brand-600', 'hsl(211,90%,47%)');
                    } else {
                      rootSys.style.setProperty('--brand-h', '161');
                      rootSys.style.setProperty('--brand-s', '91%');
                      rootSys.style.setProperty('--brand-50', 'hsl(161,91%,97%)');
                      rootSys.style.setProperty('--brand-400', 'hsl(161,91%,48%)');
                      rootSys.style.setProperty('--brand-500', 'hsl(161,91%,38%)');
                      rootSys.style.setProperty('--brand-600', 'hsl(161,91%,31%)');
                    }
                  }
                  
                  document.documentElement.classList.add(isDark ? 'dark' : 'light');
                } catch(e) {}
              })();
            `,
          }}
        />
        <title>LocalSnips Preview</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="description" content="Static preview of the LocalSnips application" />
        <meta name="author" content="Yeray Lois Sánchez" />
        <link rel="icon" type="image/png" href={`${ASSET_PREFIX}/logo.png`} />
      </head>
      <body className="antialiased flex flex-col h-screen overflow-hidden">
        <ThemeProvider>
          <SmartTooltipProvider>
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {children}
            </div>
            <footer className="w-full px-3 py-1 text-[9px] md:text-[10px] text-surface-400 bg-transparent pointer-events-none select-none text-center md:text-right leading-tight shrink-0">
              <span className="hidden md:inline">© 2025 Yeray Lois Sánchez — Proprietary preview build. All rights reserved.</span>
              <span className="md:hidden">© 2025 Yeray Lois Sánchez</span>
            </footer>
          </SmartTooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
