"use client";

import { useEffect } from "react";

/**
 * Sets the browser tab title and keeps it: Next.js re-applies the server-rendered title after hydration,
 * which would otherwise overwrite a title chosen for the visitor's language.
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const apply = () => {
      if (document.title !== title) document.title = title;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [title]);
}
