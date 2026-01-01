/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : AlertModal.tsx                                 *
 *   Purpose : REUSABLE ALERT MODAL FOR CONFIRM ATIONS        *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2 } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  Icon?: React.ElementType;
}

/**
 * DISPLAYS A MODAL DIALOG FOR CRITICAL CONFIRMATIONS.
 * RENDERS INTO DOCUMENT BODY VIA REACT PORTAL.
 * @param isOpen VISIBILITY STATE
 * @param onClose CALLBACK WHEN DISMISSED
 * @param onConfirm CALLBACK WHEN ACTION IS CONFIRMED
 * @param title MODAL TITLE
 * @param description MODAL EXPLANATION TEXT
 * @param confirmText LABEL FOR CONFIRM BUTTON (DEFAULT: "DELETE")
 * @param cancelText LABEL FOR CANCEL BUTTON (DEFAULT: "CANCEL")
 * @param isDestructive STYLES BUTTON AS DANGER IF TRUE
 * @param Icon ICON COMPONENT (DEFAULT: TRASH2)
 */
export default function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDestructive = true,
  Icon = Trash2,
}: AlertModalProps) {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  // RENDER TO BODY (PORTAL)
  return createPortal(
    <div className={`fixed inset-0 z-[70] flex items-center justify-center p-4 ${isDark ? 'dark' : ''}`}>
      {/* OVERLAY: BLUR & DIM */}
      <div 
        className={`absolute inset-0 backdrop-blur-sm transition-opacity animate-fade-in ${isDark ? 'bg-black/60' : 'bg-black/20'}`}
        onClick={onClose}
      />

      {/* MODAL: GLASSMORPHISM ALERT */}
      <div className={`relative w-full max-w-sm transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-2xl backdrop-blur-xl transition-all animate-scale-in border ${isDark ? 'bg-surface-900/95 border-white/10' : 'bg-white/90 border-surface-200'} ring-1 ring-black/5`}>
        
        {/* ICON: FLOATING PREMIUM ICON */}
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 ring-4 ${
            isDestructive 
                ? (isDark ? 'bg-red-900/30 ring-red-900/10' : 'bg-red-100 ring-red-50')
                : (isDark ? 'bg-brand-500/20 ring-brand-500/10' : 'bg-brand-100 ring-brand-50')
        }`}>
          <Icon className={`h-6 w-6 ${
              isDestructive 
                 ? (isDark ? 'text-red-400' : 'text-red-600')
                 : (isDark ? 'text-brand-400' : 'text-brand-600')
          }`} aria-hidden="true" />
        </div>

        {/* CONTENT */}
        <div className="text-center">
          <h3 className={`text-lg font-semibold leading-6 ${isDark ? 'text-white' : 'text-surface-900'}`}>
            {title}
          </h3>
          <div className="mt-2">
            <p className={`text-sm ${isDark ? 'text-surface-300' : 'text-surface-500'}`}>
              {description}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-2 sm:gap-3">
          <button
            type="button"
            className={`inline-flex w-full justify-center rounded-lg border border-transparent px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDestructive 
                ? "bg-red-600 hover:bg-red-500 focus:ring-red-500" 
                : "bg-brand-600 hover:bg-brand-700 focus:ring-brand-500"
            } transition-all duration-200`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className={`mt-3 inline-flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 active:scale-[0.98] transition-all duration-100 ${isDark ? 'bg-surface-800 text-surface-200 ring-surface-600 hover:bg-surface-700' : 'bg-surface-100 text-surface-900 ring-surface-300 hover:bg-surface-200'}`}
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
