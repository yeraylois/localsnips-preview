/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : SmartTooltipProvider.tsx                       *
 *   Purpose : GLOBAL TOOLTIP PROVIDER WRAPPER                *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useSmartTooltips } from "@/lib/useSmartTooltips";

/**
 * SMART TOOLTIP PROVIDER
 * ENABLES ROBUST APPLE-STYLE TOOLTIPS GLOBALLY.
 * @param children APP CONTENT
 */
export function SmartTooltipProvider({ children }: { children: React.ReactNode }) {
  useSmartTooltips();
  return <>{children}</>;
}
