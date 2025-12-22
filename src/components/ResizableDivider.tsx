/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : ResizableDivider.tsx                           *
 *   Purpose : DRAGGABLE RESIZER HANDLE FOR PANELS            *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useState, useCallback, useEffect } from "react";
import { GripVertical } from "lucide-react";

interface ResizableDividerProps {
  onResize: (delta: number) => void;
  className?: string;
}

/**
 * VERTICAL DRAGGABLE HANDLE FOR RESIZING SIDEBAR WIDTH.
 * - Parameter onResize: Callback receiving drag deltaX
 * - Parameter className: Optional extra classes
 */
export default function ResizableDivider({ onResize, className = "" }: ResizableDividerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      onResize(delta);
      setStartX(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startX, onResize]);

  return (
    <div
      className={`group relative flex-shrink-0 w-[1px] hover:w-[3px] bg-surface-200 dark:bg-surface-800 cursor-col-resize transition-all duration-150 ${isDragging ? 'w-[3px] bg-brand-500' : ''} ${className}`}
      onMouseDown={handleMouseDown}
    >
      {/* DRAG INDICATOR (APPLE STYLE) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-10 flex items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm ${isDragging ? 'opacity-100 bg-brand-50 dark:bg-brand-900/30 border-brand-300 dark:border-brand-700' : ''}`}>
        <GripVertical className={`w-3 h-3 text-surface-400 ${isDragging ? 'text-brand-600' : ''}`} />
      </div>
    </div>
  );
}
