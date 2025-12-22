/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : next.config.mjs                                *
 *   Purpose : NEXT.JS CONFIGURATION FOR STATIC EXPORT        *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

/** @type {import('next').NextConfig} */
const nextConfig = {
  // STATIC HTML EXPORT FOR GITHUB PAGES
  output: 'export',

  // BASE PATH FOR GITHUB PAGES (ONLY IN PRODUCTION)
  basePath: process.env.NODE_ENV === 'production' ? '/localsnips-preview' : '',
  
  // DISABLE IMAGE OPTIMIZATION FOR STATIC EXPORT
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
