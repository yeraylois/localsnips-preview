/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : ResizableDivider.tsx                           *
 *   Purpose : DRAGGABLE RESIZER HANDLE FOR PANELS            *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GripVertical } from "lucide-react";

interface ResizableDividerProps {
  onResize: (delta: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  className?: string;
}

/**
 * VERTICAL DRAGGABLE HANDLE FOR RESIZING SIDEBAR WIDTH.
 * @param onResize CALLBACK RECEIVING DRAG DELTAX
 * @param className OPTIONAL EXTRA CLASSES
 */
export default function ResizableDivider({ onResize, onResizeStart, onResizeEnd, className = "" }: ResizableDividerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Use refs for callbacks to avoid re-binding event listeners on every render
  const onResizeRef = useRef(onResize);
  const onResizeStartRef = useRef(onResizeStart);
  const onResizeEndRef = useRef(onResizeEnd);

  useEffect(() => {
    onResizeRef.current = onResize;
    onResizeStartRef.current = onResizeStart;
    onResizeEndRef.current = onResizeEnd;
  }, [onResize, onResizeStart, onResizeEnd]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
    onResizeStartRef.current?.();
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      
      const currentX = e.clientX;
      rafRef.current = requestAnimationFrame(() => {
        const delta = currentX - startXRef.current;
        onResizeRef.current(delta);
        startXRef.current = currentX;
        rafRef.current = null;
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onResizeEndRef.current?.();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDragging]);

  return (
    <div
      className={`group relative flex-shrink-0 w-3 -ml-1.5 z-10 cursor-col-resize flex justify-center items-center ${className}`}
      onMouseDown={handleMouseDown}
    >
      {/* VISIBLE DIVIDER LINE */}
      <div className={`w-[1px] h-full bg-surface-200 dark:bg-surface-800 transition-all duration-150 group-hover:bg-brand-500/50 group-hover:w-[3px] rounded-full ${isDragging ? '!w-[3px] !bg-brand-500' : ''}`} />
      
      {/* DRAG INDICATOR (APPLE STYLE) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-10 flex items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none ${isDragging ? 'opacity-100 bg-brand-50 dark:bg-brand-900/30 border-brand-300 dark:border-brand-700' : ''}`}>
        <GripVertical className={`w-3 h-3 text-surface-400 ${isDragging ? 'text-brand-600' : ''}`} />
      </div>
    </div>
  );
}
