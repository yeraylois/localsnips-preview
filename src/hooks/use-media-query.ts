/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : use-media-query.ts                             *
 *   Purpose : CUSTOM HOOK FOR RESPONSIVE BREAKPOINTS         *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

import { useEffect, useState } from "react";

/**
 * LISTENS TO A MEDIA QUERY RETURNING TRUE/FALSE.
 * @param query CSS MEDIA QUERY STRING (E.G. "(MAX-WIDTH: 768PX)")
 * @returns BOOLEAN MATCHING STATE
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
