/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : TechDropdown.tsx                               *
 *   Purpose : TRIGGER BUTTON FOR TECHNOLOGY SELECTOR         *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useState } from "react";
import { ChevronRight, HelpCircle } from "lucide-react";
import { TECH_ICONS, getTechIconUrl } from "../lib/tech-icons";
import TechSelectorModal from "./TechSelectorModal";

interface TechDropdownProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

/**
 * DROPDOWN TRIGGER SHOWING SELECTED TECHNOLOGY ICON/NAME.
 * OPENS THE TECH SELECTOR MODAL WHEN CLICKED.
 * @param value CURRENTLY SELECTED TECHNOLOGY SLUG
 * @param onChange CALLBACK WHEN SELECTION CHANGES
 * @param className OPTIONAL EXTRA STYLES
 */
export default function TechDropdown({ value, onChange, className = "" }: TechDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTech = value && TECH_ICONS[value] ? { name: value, ...TECH_ICONS[value] } : null;

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`
          w-full px-4 py-3 rounded-xl border transition-all text-sm text-left flex items-center gap-3
          border-transparent hover:border-brand-200 dark:hover:border-brand-500/30
          focus:border-brand-500 dark:focus:border-brand-400 outline-none
          hover:bg-surface-100/50 dark:hover:bg-white/5
          bg-surface-50 dark:bg-white/5
          active:scale-[0.99]
          ${isOpen ? 'border-brand-500 dark:border-brand-400' : ''}
          ${className}
        `}
      >
        {/* SELECTED TECH ICON */}
        {selectedTech ? (
          <>
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: selectedTech.color + '20' }}
            >
              <img 
                src={getTechIconUrl(selectedTech.slug)}
                alt={selectedTech.name}
                className="w-4 h-4"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <span className="flex-1 text-surface-900 dark:text-white capitalize font-medium">{selectedTech.name}</span>
          </>
        ) : (
          <>
            <div className="w-7 h-7 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4 h-4 text-surface-400" />
            </div>
            <span className="flex-1 text-surface-400 dark:text-surface-500">Select technology...</span>
          </>
        )}
        <ChevronRight className="w-4 h-4 text-surface-400 flex-shrink-0" />
      </button>

      {/* MODAL */}
      <TechSelectorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        value={value}
        onChange={onChange}
      />
    </>
  );
}
