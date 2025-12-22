/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : TechIcon.tsx                                   *
 *   Purpose : TECHNOLOGY ICON COMPONENT                      *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { HelpCircle, FileCode, Code, Terminal, Hash } from "lucide-react";
import { getTechIconUrl, TECH_ICONS } from "../lib/tech-icons";

// UNKNOWN ICONS ROTATION
const UNKNOWN_ICONS = [HelpCircle, Code, FileCode, Terminal, Hash];

interface TechIconProps {
  technology: string | null;
  title?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * RENDERS A LOGO ICON FOR A GIVEN TECHNOLOGY.
 * FALLS BACK TO GENERIC ICONS IF TECHNOLOGY IS UNKNOWN.
 * - Parameter technology: Slug of technology
 * - Parameter title: Tooltip text
 * - Parameter size: Size variant (sm/md/lg)
 * - Parameter className: Optional extra classes
 */
export default function TechIcon({ 
  technology, 
  title,
  size = "md",
  className = ""
}: TechIconProps) {
  // GET TECH INFO
  const techData = technology && TECH_ICONS[technology] 
    ? { name: technology, ...TECH_ICONS[technology] }
    : null;

  // SIZE CLASSES
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  // GET RANDOM UNKNOWN ICON BASED ON HASH OF TITLE
  const UnknownIcon = UNKNOWN_ICONS[
    title ? Math.abs(title.charCodeAt(0) % UNKNOWN_ICONS.length) : 0
  ];

  return (
    <div className={`relative inline-flex ${className}`}>
      {techData ? (
        <img 
          src={getTechIconUrl(techData.slug)}
          alt={techData.name}
          title={techData.name}
          className={`${sizeMap[size]} flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity`}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <UnknownIcon 
          className={`${sizeMap[size]} flex-shrink-0 text-surface-400 dark:text-surface-500 hover:text-surface-500 dark:hover:text-surface-400 transition-colors`} 
        />
      )}
    </div>
  );
}
