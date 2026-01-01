/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : MobileBanner.tsx                               *
 *   Purpose : DISMISSIBLE ALERT FOR MOBILE VISITORS          *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

/**
 * RENDERS A BANNER WARNING ABOUT LIMITED MOBILE EXPERIENCE.
 * PERSISTS DISMISSAL STATE IN LOCALSTORAGE.
 * @returns BANNER COMPONENT OR NULL
 */
export function MobileBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("ls_mobile_banner_dismissed");
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem("ls_mobile_banner_dismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="bg-surface-100 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 px-4 py-3 flex items-start gap-3 relative animate-in slide-in-from-top-2">
      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div className="flex-1 pr-6">
        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
          Optimized for macOS
        </p>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
          Mobile version is a UI demo only. For the full experience, please use a desktop.
        </p>
      </div>
      <button 
        onClick={dismiss}
        className="absolute top-3 right-3 p-1 rounded-md hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
