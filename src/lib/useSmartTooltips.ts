/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : useSmartTooltips.ts                            *
 *   Purpose : ROBUST SMART TOOLTIP HOOK IMPLEMENTATION       *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useEffect } from "react";

/**
 * ROBUST SMART TOOLTIP SYSTEM - V2
 * 
 * Re-engineered for maximum stability and re-entrance capability.
 * - Uses `mouseover` / `mouseout` for simpler bubbling delegation.
 * - Robust state clearing to ensure tooltips re-appear correctly.
 * - Handles immediate interaction cancellation.
 */

interface TooltipPosition {
  x: number;
  y: number;
  position: 'top' | 'bottom';
}

// CONFIGURATION
const TOOLTIP_OFFSET = 8;
const TOOLTIP_PADDING = 12;
const SHOW_DELAY = 300; // Slightly faster for snappier feel
const HIDE_DELAY = 100;

/**
 * CALCULATES OPTIMAL TOOLTIP POSITION TO AVOID VIEWPORT EDGE CLIPPING.
 * @param triggerRect BOUNDING BOX OF THE TRIGGER ELEMENT
 * @param tooltipWidth WIDTH OF THE TOOLTIP
 * @param tooltipHeight HEIGHT OF THE TOOLTIP
 * @returns CALCULATED X, Y COORDINATES AND POSITION (TOP/BOTTOM)
 */
function calculatePosition(
  triggerRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number
): TooltipPosition {
  const viewport = { w: window.innerWidth, h: window.innerHeight };
  const centerX = triggerRect.left + triggerRect.width / 2;
  
  // CLAMP X
  let x = Math.max(TOOLTIP_PADDING, Math.min(viewport.w - tooltipWidth - TOOLTIP_PADDING, centerX - tooltipWidth / 2));

  // Y LOGIC (DEFAULT BOTTOM, FLIP TOP)
  let y = triggerRect.bottom + TOOLTIP_OFFSET;
  let position: 'top' | 'bottom' = 'bottom';
  
  if (y + tooltipHeight > viewport.h - TOOLTIP_PADDING) {
    y = triggerRect.top - tooltipHeight - TOOLTIP_OFFSET;
    position = 'top';
  }
  
  // CLAMP Y
  y = Math.max(TOOLTIP_PADDING, Math.min(viewport.h - tooltipHeight - TOOLTIP_PADDING, y));

  return { x, y, position };
}

/**
 * INITIALIZES THE GLOBAL TOOLTIP SYSTEM.
 * SETS UP EVENT LISTENERS FOR DELEGATED TOOLTIP RENDERING.
 * @returns CLEANUP FUNCTION TO REMOVE LISTENERS
 */
export function initSmartTooltips() {
  let activeTooltip: HTMLDivElement | null = null;
  let showTimeout: NodeJS.Timeout | null = null;
  let currentTarget: HTMLElement | null = null;

  // ENSURE TOOLTIP ELEMENT EXISTS
  const getTooltipElement = () => {
    if (activeTooltip && document.body.contains(activeTooltip)) {
      return activeTooltip;
    }
    
    // Create new if missing or removed
    const el = document.createElement('div');
    el.className = 'smart-tooltip-pill';
    el.style.cssText = `
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
    `;
    document.body.appendChild(el);
    activeTooltip = el;
    return el;
  };

  const show = (target: HTMLElement, text: string) => {
    if (showTimeout) clearTimeout(showTimeout);
    
    currentTarget = target;
    
    showTimeout = setTimeout(() => {
      // If target is no longer hovered (handled via clean mouseout logic), abort
      if (currentTarget !== target) return;

      const tooltip = getTooltipElement();
      
      // RESET STATE FOR POSITIONING
      tooltip.style.transition = 'none';
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      
      // SET CONTENT
      tooltip.textContent = text;
      tooltip.style.whiteSpace = text.length > 35 ? 'normal' : 'nowrap';
      tooltip.style.maxWidth = '260px';
      
      // MEASURE
      const tRect = tooltip.getBoundingClientRect();
      const elRect = target.getBoundingClientRect();
      
      // SAFETY CHECK: Element must be visible
      if (elRect.width === 0 || elRect.height === 0 || !document.body.contains(target)) {
        return;
      }

      const pos = calculatePosition(elRect, tRect.width, tRect.height);
      
      // APPLY POSITION
      tooltip.style.left = `${pos.x}px`;
      tooltip.style.top = `${pos.y}px`;
      tooltip.style.transformOrigin = pos.position === 'bottom' ? 'top center' : 'bottom center';
      tooltip.style.transform = pos.position === 'bottom' ? 'translateY(4px) scale(0.96)' : 'translateY(-4px) scale(0.96)';
      tooltip.style.visibility = 'visible';
      
      // FLUSH
      tooltip.offsetHeight; 

      // ANIMATE
      tooltip.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0) scale(1)';

    }, SHOW_DELAY);
  };

  const hide = () => {
    if (showTimeout) clearTimeout(showTimeout);
    showTimeout = null;
    currentTarget = null;
    
    if (activeTooltip) {
      activeTooltip.style.opacity = '0';
      activeTooltip.style.transform = 'scale(0.96)';
      // We keep visibility: visible during fade out so animation plays
      // But we can set a timeout to hide it fully? No need, opacity 0 + pointer-events none is enough
    }
  };

  // ROBUST EVENT DELEGATION
  const handleMouseOver = (e: MouseEvent) => {
    const target = e.target instanceof Element ? e.target.closest('[data-tooltip]') : null;
    if (target instanceof HTMLElement && target.dataset.tooltip) {
      // If we are already showing for this target, do nothing
      if (currentTarget === target) return;
      show(target, target.dataset.tooltip);
    } else {
      // If we moved to something that ISN'T a tooltip trigger, hide
      // BUT check if we moved INTO the tooltip itself (rare but possible if pointer-events was auto)
      // Since ours is pointer-events: none, this is fine
      if (currentTarget) hide();
    }
  };

  const handleMouseOut = (e: MouseEvent) => {
    const target = e.target instanceof Element ? e.target.closest('[data-tooltip]') : null;
    // Only hide if we actually LEFT the current target
    // Mouseout fires when entering children too, so we need to check strict containment
    if (currentTarget && (!target || target !== currentTarget)) {
       // Check if relatedTarget (where we went) is inside the current target
       if (e.relatedTarget instanceof Node && currentTarget.contains(e.relatedTarget)) {
         return; // Still inside
       }
       hide();
    }
  };
  
  const handleInteraction = () => {
    hide();
  };

  // ADD LISTENERS
  document.addEventListener('mouseover', handleMouseOver);
  document.addEventListener('mouseout', handleMouseOut);
  document.addEventListener('mousedown', handleInteraction);
  document.addEventListener('wheel', handleInteraction, { passive: true }); // Hide on scroll

  return () => {
    document.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('mouseout', handleMouseOut);
    document.removeEventListener('mousedown', handleInteraction);
    document.removeEventListener('wheel', handleInteraction);
    if (activeTooltip) activeTooltip.remove();
  };
}

/**
 * REACT HOOK TO ACTIVATE SMART TOOLTIPS ON MOUNT.
 */
export function useSmartTooltips() {
  useEffect(() => initSmartTooltips(), []);
}
