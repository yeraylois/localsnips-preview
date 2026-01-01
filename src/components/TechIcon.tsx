/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : TechIcon.tsx                                   *
 *   Purpose : TECHNOLOGY ICON COMPONENT                      *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { HelpCircle, FileCode, Code, Terminal, Hash } from "lucide-react";
import Image from "next/image";
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
 * @param technology SLUG OF TECHNOLOGY
 * @param title TOOLTIP TEXT
 * @param size SIZE VARIANT (SM/MD/LG)
 * @param className OPTIONAL EXTRA CLASSES
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
        <Image 
          src={getTechIconUrl(techData.slug)}
          alt={techData.name}
          title={techData.name}
          width={24}
          height={24}
          className={`${sizeMap[size]} flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity`}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          unoptimized // Explicitly unoptimized as per config, or let config handle it.
        />
      ) : (
        <UnknownIcon 
          className={`${sizeMap[size]} flex-shrink-0 text-surface-400 dark:text-surface-500 hover:text-surface-500 dark:hover:text-surface-400 transition-colors`} 
        />
      )}
    </div>
  );
}
