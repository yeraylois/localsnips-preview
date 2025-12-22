/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : layout.tsx                                     *
 *   Purpose : ROOT LAYOUT WITH THEME PROVIDER                *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { ASSET_PREFIX } from "../lib/types";

/**
 * ROOT LAYOUT COMPONENT.
 * WRAPS ALL PAGES WITH THEME PROVIDER AND GLOBAL STYLES.
 * - Parameter children: Child components to render
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>


        <title>LocalSnips - Preview</title>
        <meta name="description" content="AI-powered local knowledge base" />
        <link rel="icon" type="image/png" href={`${ASSET_PREFIX}/logo.png`} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
