/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : MacTitleBar.tsx                                *
 *   Purpose : CUSTOM MACOS-STYLE WINDOW CONTROL BAR          *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

import React, { useState, useEffect } from 'react';

/**
 * CUSTOM MACOS WINDOW TITLE BAR WITH TRAFFIC LIGHT CONTROLS.
 * COMMUNICATES WITH NATIVE SWIFT APP VIA WEBKIT MESSAGE HANDLERS.
 * HANDLES FULLSCREEN STATE SYNC AND WINDOW ACTIONS (CLOSE, MINIMIZE, MAXIMIZE).
 */
export default function MacTitleBar() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // EVENT LISTENER: SYNC STATE WITH NATIVE APP
    const handleNativeFS = (e: any) => {
        setIsFullscreen(e.detail === true);
    };
    
    window.addEventListener('native-fullscreen-change', handleNativeFS);
    
    // FALLBACK CHECK ON MOUNT
    const fallbackCheck = () => {
         if (window.innerHeight === window.screen.height) setIsFullscreen(true);
    };
    fallbackCheck();
    
    return () => window.removeEventListener('native-fullscreen-change', handleNativeFS);
  }, []);

  const send = (action: string) => {
    // BRIDGE: SEND MESSAGES TO NATIVE SWIFT COORDINATOR
    const win = window as any;
    if (win.webkit?.messageHandlers?.windowControl) {
        win.webkit.messageHandlers.windowControl.postMessage(action);
    } else {
        console.log("NATIVE BRIDGE MOCK:", action);
    }
  };

  return (
    <div className="flex items-center gap-2 h-10 px-2" style={{ WebkitAppRegion: "no-drag" } as any}>
      {/* CLOSE BUTTON (ALWAYS RED X) */}
      <button 
        onClick={() => send('close')}
        className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] flex items-center justify-center group/btn focus:outline-none active:scale-90 transition-transform"
        data-tooltip="Close"
      >
         <svg viewBox="0 0 10 10" className="w-[6px] h-[6px] text-black/80 opacity-0 group-hover/btn:opacity-100 transition-opacity" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 2l6 6M8 2l-6 6"/>
         </svg>
      </button>

      {/* YELLOW BUTTON - MINIMIZE OR DISABLED */}
      <button 
        onClick={() => !isFullscreen && send('minimize')}
        className={`w-3 h-3 rounded-full border flex items-center justify-center group/btn focus:outline-none active:scale-90 transition-all ${
            isFullscreen 
            ? "bg-[#3D3D3D] border-[#2A2A2A] cursor-not-allowed"
            : "bg-[#FFBD2E] border-[#DEA123] cursor-pointer"
        }`}
        data-tooltip={isFullscreen ? "Disabled in Full Screen" : "Minimize"}
        disabled={isFullscreen}
      >
           {!isFullscreen && (
             <svg viewBox="0 0 10 10" className="w-[6px] h-[6px] text-black/80 opacity-0 group-hover/btn:opacity-100 transition-opacity" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1.5 5h7"/>
             </svg>
           )}
      </button>

      {/* GREEN BUTTON - TOGGLE FULLSCREEN */}
      <button 
        onClick={() => send('maximize')} 
        className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] flex items-center justify-center group/btn cursor-pointer focus:outline-none active:scale-90 transition-transform"
        data-tooltip={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
      >
          {isFullscreen ? (
               // EXIT FULLSCREEN: ARROWS IN
               <svg viewBox="0 0 12 12" className="w-[8px] h-[8px] text-black/90 opacity-0 group-hover/btn:opacity-100 transition-opacity" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 1L1 1L1 4.5" />
                  <path d="M7.5 11L11 11L11 7.5" />
               </svg>
          ) : (
               // ENTER FULLSCREEN: ARROWS OUT
               <svg viewBox="0 0 12 12" className="w-[8px] h-[8px] text-black/90 opacity-0 group-hover/btn:opacity-100 transition-opacity" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4.5L1 1L4.5 1" />
                  <path d="M11 7.5L11 11L7.5 11" />
               </svg>
          )}
      </button>
    </div>
  );
}
