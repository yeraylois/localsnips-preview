(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,33525,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"warnOnce",{enumerable:!0,get:function(){return s}});let s=e=>{}},18566,(e,t,r)=>{t.exports=e.r(76562)},59919,e=>{"use strict";var t=e.i(43476),r=e.i(71645),s=e.i(18566);let o=(0,r.createContext)(void 0);function a({children:e}){let a=(0,s.usePathname)(),[n,l]=(0,r.useState)(()=>localStorage.getItem("localsnips-theme")||"system"),i={darkBg:"#1d1d1d",brandHue:142,brandSat:70,titleHue:210,titleSat:15,sidebarOpacity:50,lightHue:210,lightSat:40,darkHue:240,darkSat:4,surfaceHue:210,surfaceSat:40},[d,c]=(0,r.useState)(()=>{{let e=localStorage.getItem("localsnips-custom-theme");if(e)try{return{...i,...JSON.parse(e)}}catch(e){}}return i}),[h,y]=(0,r.useState)(!1);(0,r.useEffect)(()=>{h&&localStorage.setItem("localsnips-custom-theme",JSON.stringify(d))},[d,h]);let u=e=>{let t=e.substring(1).split("");3==t.length&&(t=[t[0],t[0],t[1],t[1],t[2],t[2]]);let r=parseInt(t.join(""),16);return[r>>16&255,r>>8&255,255&r]},m=()=>{let e=window.document.documentElement,t=window.matchMedia("(prefers-color-scheme: dark)").matches;[50,100,200,300,400,500,600,700,800,900,950].forEach(t=>{e.style.removeProperty(`--surface-${t}`),e.style.removeProperty(`--brand-${t}`)}),e.style.removeProperty("--background"),e.style.removeProperty("--foreground"),e.style.removeProperty("--brand-h"),e.style.removeProperty("--brand-s"),e.style.removeProperty("--surface-h"),e.style.removeProperty("--surface-s"),e.style.removeProperty("--title-color"),e.style.removeProperty("--title-muted"),e.style.removeProperty("--sidebar-opacity");let r="custom"===n?"dark":"light"===n?"light":"dark"===n||t?"dark":"light";if(e.classList.add(r),e.classList.remove("dark"===r?"light":"dark"),"custom"===n){e.classList.add("dark"),console.log("[ThemeProvider] Custom mode active - injecting full palette");let t=u(d.darkBg||"#1d1d1d"),r=[255,255,255],s=e=>{let s,o,a=(s=1-e,[Math.round(t[0]*s+r[0]*e),Math.round(t[1]*s+r[1]*e),Math.round(t[2]*s+r[2]*e)]);return o=a[0],"#"+[o,a[1],a[2]].map(e=>{let t=e.toString(16);return 1===t.length?"0"+t:t}).join("")},o={950:d.darkBg||"#1d1d1d",900:s(.06),800:s(.12),700:s(.2),600:s(.3),500:s(.42),400:s(.55),300:s(.68),200:s(.8),100:s(.9),50:s(.96)};Object.entries(o).forEach(([t,r])=>{e.style.setProperty(`--surface-${t}`,r)}),e.style.setProperty("--background",o[950]),e.style.setProperty("--foreground",o[50]);let a=(()=>{let e=u(d.darkBg||"#1d1d1d"),t=e[0]/255,r=e[1]/255,s=e[2]/255,o=Math.max(t,r,s),a=Math.min(t,r,s),n=0,l=0;if(o!==a){let e=o-a;switch(l=(o+a)/2>.5?e/(2-o-a):e/(o+a),o){case t:n=((r-s)/e+6*(r<s))/6;break;case r:n=((s-t)/e+2)/6;break;case s:n=((t-r)/e+4)/6}}return{h:Math.round(360*n),s:Math.round(100*l)}})();e.style.setProperty("--surface-h",a.h.toString()),e.style.setProperty("--surface-s",`${Math.max(a.s,4)}%`);let n=d.brandHue,l=d.brandSat;e.style.setProperty("--brand-h",n.toString()),e.style.setProperty("--brand-s",`${l}%`),Object.entries({50:`hsl(${n}, ${l}%, 97%)`,100:`hsl(${n}, ${l}%, 94%)`,200:`hsl(${n}, ${l}%, 86%)`,300:`hsl(${n}, ${l}%, 77%)`,400:`hsl(${n}, ${l}%, 66%)`,500:`hsl(${n}, ${l}%, 55%)`,600:`hsl(${n}, ${l}%, 47%)`,700:`hsl(${n}, ${l}%, 40%)`,800:`hsl(${n}, ${l}%, 33%)`,900:`hsl(${n}, ${l}%, 25%)`,950:`hsl(${n}, ${l}%, 15%)`}).forEach(([t,r])=>{e.style.setProperty(`--brand-${t}`,r)}),e.style.setProperty("--ai-suggest-bg",o[800]),e.style.setProperty("--ai-suggest-text",o[200]),e.style.setProperty("--ai-suggest-hover",o[700]),e.style.setProperty("--tooltip-bg",o[900]),e.style.setProperty("--tooltip-text",o[200]),e.style.setProperty("--tooltip-border",o[800]);let i=d.titleHue,c=d.titleSat;e.style.setProperty("--title-color",`hsl(${i}, ${c}%, 65%)`),e.style.setProperty("--title-muted",`hsl(${i}, ${Math.max(c-5,0)}%, 50%)`),e.style.setProperty("--sidebar-opacity",`${d.sidebarOpacity/100}`),console.log("[ThemeProvider] Custom palette applied:",{bg:o[950],accent:`hsl(${n}, ${l}%, 55%)`,titles:`hsl(${i}, ${c}%, 65%)`})}else{let r="light"===n?"light":"dark"===n||t?"dark":"light";e.classList.add(r),"light"===r?(e.style.setProperty("--brand-h","161"),e.style.setProperty("--brand-s","91%")):(e.style.setProperty("--brand-h","211"),e.style.setProperty("--brand-s","90%")),"light"===r?void 0!==d.lightHue&&(e.style.setProperty("--surface-h",d.lightHue.toString()),e.style.setProperty("--surface-s",`${d.lightSat}%`)):void 0!==d.darkHue&&(e.style.setProperty("--surface-h",d.darkHue.toString()),e.style.setProperty("--surface-s",`${d.darkSat}%`))}};return(0,r.useLayoutEffect)(()=>{m(),h||y(!0)},[n,d]),(0,r.useEffect)(()=>{if(!h)return;let e=window.matchMedia("(prefers-color-scheme: dark)"),t=()=>{m()};return e.addEventListener("change",t),()=>e.removeEventListener("change",t)},[n,d,h]),(0,r.useEffect)(()=>{let e=()=>{"visible"===document.visibilityState&&m()},t=()=>{m()};return document.addEventListener("visibilitychange",e),window.addEventListener("popstate",t),()=>{document.removeEventListener("visibilitychange",e),window.removeEventListener("popstate",t)}},[n,d]),(0,r.useLayoutEffect)(()=>{m()},[a]),(0,r.useEffect)(()=>{window.webkit?.messageHandlers?.windowControl&&window.webkit.messageHandlers.windowControl.postMessage({action:"setTheme",mode:n,customHex:"custom"===n?d.darkBg:void 0,titleHue:"custom"===n?d.titleHue:void 0})},[n,d.darkBg,d.titleHue]),(0,t.jsx)(o.Provider,{value:{theme:n,setTheme:e=>{localStorage.setItem("localsnips-theme",e),l(e)},customTheme:d,setCustomTheme:c},children:e})}function n(){let e=(0,r.useContext)(o);if(!e)throw Error("useTheme must be used within a ThemeProvider");return e}e.s(["ThemeProvider",()=>a,"useTheme",()=>n])},27639,e=>{"use strict";e.s(["ASSET_PREFIX",0,"/localsnips-preview"])},53642,e=>{"use strict";var t=e.i(43476),r=e.i(59919),s=e.i(71645);function o({children:e}){return(0,s.useEffect)(()=>{let e,t,r,s,o,a,n;return e=null,t=null,r=null,s=()=>{t&&clearTimeout(t),t=null,r=null,e&&(e.style.opacity="0",e.style.transform="scale(0.96)")},o=o=>{let a=o.target instanceof Element?o.target.closest("[data-tooltip]"):null;if(a instanceof HTMLElement&&a.dataset.tooltip){var n;if(r===a)return;n=a.dataset.tooltip,t&&clearTimeout(t),r=a,t=setTimeout(()=>{var t,s;let o,l,i,d,c;if(r!==a)return;let h=(()=>{if(e&&document.body.contains(e))return e;let t=document.createElement("div");return t.className="smart-tooltip-pill",t.style.cssText=`
      position: fixed;
      z-index: 99999;
      pointer-events: none;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.4;
      background: var(--brand-500);
      color: white;
      text-align: center;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1);
      opacity: 0;
      transform: scale(0.96);
      transition: opacity 0.15s ease-out, transform 0.15s ease-out;
      left: 0;
      top: 0;
      visibility: hidden;
    `,document.body.appendChild(t),e=t,t})();h.style.transition="none",h.style.opacity="0",h.style.visibility="hidden",h.textContent=n,h.style.whiteSpace=n.length>35?"normal":"nowrap",h.style.maxWidth="260px";let y=h.getBoundingClientRect(),u=a.getBoundingClientRect();if(0===u.width||0===u.height||!document.body.contains(a))return;let m=(t=y.width,s=y.height,o={w:window.innerWidth,h:window.innerHeight},l=u.left+u.width/2,i=Math.max(12,Math.min(o.w-t-12,l-t/2)),d=u.bottom+8,c="bottom",d+s>o.h-12&&(d=u.top-s-8,c="top"),{x:i,y:d=Math.max(12,Math.min(o.h-s-12,d)),position:c});h.style.left=`${m.x}px`,h.style.top=`${m.y}px`,h.style.transformOrigin="bottom"===m.position?"top center":"bottom center",h.style.transform="bottom"===m.position?"translateY(4px) scale(0.96)":"translateY(-4px) scale(0.96)",h.style.visibility="visible",h.offsetHeight,h.style.transition="opacity 0.15s ease-out, transform 0.15s ease-out",h.style.opacity="1",h.style.transform="translateY(0) scale(1)"},300)}else r&&s()},a=e=>{let t=e.target instanceof Element?e.target.closest("[data-tooltip]"):null;if(r&&(!t||t!==r)){if(e.relatedTarget instanceof Node&&r.contains(e.relatedTarget))return;s()}},n=()=>{s()},document.addEventListener("mouseover",o),document.addEventListener("mouseout",a),document.addEventListener("mousedown",n),document.addEventListener("wheel",n,{passive:!0}),()=>{document.removeEventListener("mouseover",o),document.removeEventListener("mouseout",a),document.removeEventListener("mousedown",n),document.removeEventListener("wheel",n),e&&e.remove()}},[]),(0,t.jsx)(t.Fragment,{children:e})}var a=e.i(27639);function n({children:e}){return(0,t.jsxs)("html",{lang:"en",suppressHydrationWarning:!0,children:[(0,t.jsxs)("head",{children:[(0,t.jsx)("script",{dangerouslySetInnerHTML:{__html:`
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
            `}}),(0,t.jsx)("title",{children:"LocalSnips Preview"}),(0,t.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"}),(0,t.jsx)("meta",{name:"description",content:"Static preview of the LocalSnips application"}),(0,t.jsx)("meta",{name:"author",content:"Yeray Lois Sánchez"}),(0,t.jsx)("link",{rel:"icon",type:"image/png",href:`${a.ASSET_PREFIX}/logo.png`})]}),(0,t.jsx)("body",{className:"antialiased flex flex-col h-screen overflow-hidden",children:(0,t.jsx)(r.ThemeProvider,{children:(0,t.jsxs)(o,{children:[(0,t.jsx)("div",{className:"flex-1 flex flex-col min-h-0 overflow-hidden",children:e}),(0,t.jsxs)("footer",{className:"w-full px-3 py-1 text-[9px] md:text-[10px] text-surface-400 bg-transparent pointer-events-none select-none text-center md:text-right leading-tight shrink-0",children:[(0,t.jsx)("span",{className:"hidden md:inline",children:"© 2025 Yeray Lois Sánchez — Proprietary preview build. All rights reserved."}),(0,t.jsx)("span",{className:"md:hidden",children:"© 2025 Yeray Lois Sánchez"})]})]})})})]})}e.s(["default",()=>n],53642)}]);